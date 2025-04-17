import axios from "axios";
import userModel from "../models/userModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import bookingModel from "../models/bookingModel.js";

const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;

// Environment variable validation
const {
  KHALTI_SECRET_KEY,
  KHALTI_API_BASE_URL = "https://dev.khalti.com",
  APP_BASE_URL = "http://localhost:5173",
} = process.env;

if (!KHALTI_SECRET_KEY) {
  throw new Error("KHALTI_SECRET_KEY is not configured");
}

const khaltiInitiateUrl = `${KHALTI_API_BASE_URL}/api/v2/epayment/initiate/`;
const khaltiLookupUrl = `${KHALTI_API_BASE_URL}/api/v2/epayment/lookup/`;

// Initiate Subscription Payment
export const initiateSubscriptionPayment = async (req, res) => {
  try {
    const { userId, amount, orderId, orderName } = req.body;
    if (!userId || !orderName) {
      return res
        .status(400)
        .json({ success: false, message: "userId and orderName are required" });
    }

    const plan = orderName.split(" ")[0];
    if (!["6-month", "12-month"].includes(plan)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan in orderName" });
    }

    if (!khaltiSecretKey) {
      throw new Error("Khalti secret key not configured");
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const paymentData = {
      return_url: "http://localhost:5173/",
      website_url: "http://localhost:5173",
      amount: amount,
      purchase_order_id: orderId || `SUB-${Date.now()}`,
      purchase_order_name: orderName,
      customer_info: {
        name: user.name,
        email: user.email,
        phone: user.phone || "9800000000",
      },
    };

    const response = await axios.post(khaltiInitiateUrl, paymentData, {
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
    });

    const pidx =
      response.data.pidx ||
      new URL(response.data.payment_url).searchParams.get("pidx");
    if (pidx) {
      global.paymentPlans = global.paymentPlans || {};
      global.paymentPlans[pidx] = { userId, plan };
    }

    res.json({ success: true, payment_url: response.data.payment_url });
  } catch (error) {
    console.error(
      "Error initiating payment:",
      error.response?.data || error.message
    );
    res.status(500).json({
      success: false,
      message: "Failed to initiate payment",
      error: error.response?.data?.detail || error.message,
    });
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    const { pidx } = req.query;

    console.log("Verifying payment:", { userId, pidx });

    if (!userId || !pidx) {
      console.log("Missing fields:", { userId, pidx });
      return res.status(400).json({
        success: false,
        message: "userId and pidx are required",
      });
    }

    // Retrieve plan from temporary storage
    const storedData = global.paymentPlans?.[pidx];
    const plan = storedData?.plan;
    if (!plan || !["6-month", "12-month"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Plan not found or invalid for this payment",
      });
    }

    if (storedData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "User ID does not match payment initiator",
      });
    }

    // Check if payment is already verified
    const existingSubscription = await subscriptionModel.findOne({
      "users.pidx": pidx,
    });
    if (existingSubscription) {
      return res
        .status(400)
        .json({ success: false, message: "Payment already verified" });
    }

    // Verify payment with Khalti
    const verificationResponse = await axios.post(
      khaltiLookupUrl,
      { pidx },
      {
        headers: {
          Authorization: `Key ${khaltiSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Khalti response:", verificationResponse.data);

    if (verificationResponse.data.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${verificationResponse.data.status}`,
      });
    }

    const transactionId = verificationResponse.data.transaction_id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check for existing active subscription
    if (user.isSubscribed && user.subscription) {
      const existingSub = await subscriptionModel.findById(user.subscription);
      if (
        existingSub &&
        existingSub.users.some(
          (u) =>
            u.userId.toString() === userId.toString() && u.status === "active"
        )
      ) {
        return res.status(400).json({
          success: false,
          message: "You already have an active subscription.",
        });
      }
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (plan === "6-month" ? 6 : 12));

    // Find or create subscription
    let subscription = await subscriptionModel.findOne({ plan });
    if (!subscription) {
      subscription = new subscriptionModel({
        plan,
        discount: plan === "6-month" ? 5 : 10,
        users: [],
      });
    }

    // Update subscription with user data
    const userIndex = subscription.users.findIndex(
      (u) => u.userId.toString() === userId.toString()
    );
    const subscriptionData = {
      userId,
      startDate,
      endDate,
      status: "active",
      pidx,
      transactionId,
    };
    if (userIndex !== -1) {
      subscription.users[userIndex] = subscriptionData;
    } else {
      subscription.users.push(subscriptionData);
    }

    await subscription.save();
    console.log("Subscription updated:", subscription);

    // Update user model
    user.isSubscribed = true;
    user.subscription = subscription._id;
    user.subscriptionPlan = plan; // Optional: store plan for reference
    await user.save();
    console.log("User updated:", user);

    // Update userData in active bookings
    const updatedUserData = {
      ...user.toObject(),
      isSubscribed: true,
      subscription: subscription._id,
      subscriptionPlan: plan,
    };
    await bookingModel.updateMany(
      { userId, cancelled: false, isCompleted: false },
      { $set: { userData: updatedUserData } }
    );
    console.log("Active bookings updated for user:", userId);

    // Clean up temporary storage
    if (global.paymentPlans?.[pidx]) {
      delete global.paymentPlans[pidx];
    }

    res.json({
      success: true,
      message: "Subscription activated successfully and bookings updated!",
    });
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// Initiate Booking Payment
export const initiateBookingPayment = async (req, res) => {
  try {
    const { userId, bookingId, amount } = req.body;
    console.log("Initiate booking payment request:", {
      userId,
      bookingId,
      amount,
    });
    if (!userId || !bookingId || !amount) {
      console.log("Missing fields:", { userId, bookingId, amount });
      return res
        .status(400)
        .json({
          success: false,
          message: "userId, bookingId, and amount are required",
        });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (!user.phone) {
      console.log("User phone missing:", userId);
      return res
        .status(400)
        .json({ success: false, message: "User phone number is required" });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      console.log("Booking not found:", bookingId);
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    if (booking.userId.toString() !== userId) {
      console.log("Booking user mismatch:", {
        bookingUserId: booking.userId,
        userId,
      });
      return res
        .status(403)
        .json({ success: false, message: "Booking does not belong to user" });
    }
    if (booking.paymentStatus === "Completed") {
      console.log("Payment already completed:", bookingId);
      return res
        .status(400)
        .json({ success: false, message: "Booking payment already completed" });
    }

    // Validate amount with discount for subscribed users
    let expectedAmount = booking.amount;
    if (user.isSubscribed) {
      const discount = 0.1; // 10% discount
      expectedAmount = booking.amount - booking.amount * discount;
    }
    if (expectedAmount !== amount) {
      console.log("Amount mismatch:", {
        expectedAmount,
        requestAmount: amount,
      });
      return res
        .status(400)
        .json({
          success: false,
          message: "Amount does not match expected booking amount",
        });
    }

    if (!APP_BASE_URL) {
      throw new Error("APP_BASE_URL is not defined");
    }

    const paymentData = {
      return_url: `${APP_BASE_URL}/my-bookings`,
      website_url: APP_BASE_URL,
      amount: amount * 100, // Convert NPR to paisa for Khalti
      purchase_order_id: `BOOKING-${bookingId}-${Date.now()}`,
      purchase_order_name: `Booking for ${
        booking.serviceData?.name || "Service"
      }`,
      customer_info: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
    console.log("Payment data for Khalti:", paymentData);

    const response = await axios.post(khaltiInitiateUrl, paymentData, {
      headers: {
        Authorization: `Key ${KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Khalti response:", response.data);

    const pidx =
      response.data.pidx ||
      new URL(response.data.payment_url).searchParams.get("pidx");
    if (!pidx) {
      throw new Error("Failed to retrieve pidx from Khalti response");
    }

    global.paymentPlans = global.paymentPlans || {};
    global.paymentPlans[pidx] = { userId, bookingId };

    booking.pidx = pidx;
    booking.paymentStatus = "Pending";
    await booking.save();

    res.json({ success: true, payment_url: response.data.payment_url });
  } catch (error) {
    console.error("Error initiating booking payment:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({
      success: false,
      message: "Failed to initiate booking payment",
      error: error.response?.data?.detail || error.message,
    });
  }
};

// Verify Booking Payment
export const verifyBookingPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    const { pidx } = req.query;

    console.log("Verifying booking payment:", { userId, pidx });

    if (!userId || !pidx) {
      console.log("Missing fields:", { userId, pidx });
      return res
        .status(400)
        .json({ success: false, message: "userId and pidx are required" });
    }

    const storedData = global.paymentPlans?.[pidx];
    if (!storedData || !storedData.bookingId) {
      console.log("Payment intent not found:", pidx);
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment intent not found or invalid",
        });
    }
    if (storedData.userId !== userId) {
      console.log("User ID mismatch:", {
        storedUserId: storedData.userId,
        userId,
      });
      return res
        .status(403)
        .json({
          success: false,
          message: "User ID does not match payment initiator",
        });
    }

    const booking = await bookingModel.findById(storedData.bookingId);
    if (!booking) {
      console.log("Booking not found:", storedData.bookingId);
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }
    if (booking.paymentStatus === "Completed") {
      console.log("Payment already verified:", booking._id);
      return res
        .status(400)
        .json({ success: false, message: "Booking payment already verified" });
    }

    const verificationResponse = await axios.post(
      khaltiLookupUrl,
      { pidx },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Khalti response:", verificationResponse.data);

    if (verificationResponse.data.status !== "Completed") {
      booking.paymentStatus = "Failed";
      await booking.save();
      console.log("Payment not completed:", verificationResponse.data.status);
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${verificationResponse.data.status}`,
      });
    }

    booking.paymentStatus = "Completed";
    booking.transactionId = verificationResponse.data.transaction_id;
    await booking.save();
    console.log("Booking updated:", booking);

    if (global.paymentPlans?.[pidx]) {
      delete global.paymentPlans[pidx];
    }

    res.json({
      success: true,
      message: "Booking payment verified successfully!",
    });
  } catch (error) {
    console.error("Booking verification error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({
      success: false,
      message: "Booking payment verification failed",
      error: error.response?.data?.detail || error.message,
    });
  }
};
