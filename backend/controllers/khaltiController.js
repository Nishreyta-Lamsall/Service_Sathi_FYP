// controllers/khaltiController.js
import axios from "axios";
import userModel from "../models/userModel.js"; // Adjust path as per your project structure
import subscriptionModel from "../models/subscriptionModel.js"; // Adjust path as per your project structure

const khaltiSecretKey = process.env.KHALTI_SECRET_KEY;
const khaltiInitiateUrl = "https://dev.khalti.com/api/v2/epayment/initiate/";
const khaltiLookupUrl = "https://dev.khalti.com/api/v2/epayment/lookup/";

// Initiate Payment
export const initiateSubscriptionPayment = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "userId is required" });
    }

    const { amount, orderId, orderName } = req.body;

    if (!khaltiSecretKey) {
      throw new Error("Khalti secret key not configured");
    }

    // Fetch user details for customer_info
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const paymentData = {
      return_url: "http://localhost:5173/", 
      website_url: "http://localhost:5173",
      amount: amount || 350000, 
      purchase_order_id: orderId || `SUB-${Date.now()}`,
      purchase_order_name: orderName || "12-month Subscription",
      customer_info: {
        name: user.name,
        email: user.email,
        phone: user.phone || "9800000000", // Use user's phone or default test number
      },
    };

    const response = await axios.post(khaltiInitiateUrl, paymentData, {
      headers: {
        Authorization: `Key ${khaltiSecretKey}`,
        "Content-Type": "application/json",
      },
    });

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

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    if (!pidx) {
      return res.status(400).json({
        success: false,
        message: "Payment index (pidx) is required",
      });
    }

    console.log("Verifying payment for userId:", userId, "with pidx:", pidx);

    // Check if payment is already verified
    const existingSubscription = await subscriptionModel.findOne({
      "users.pidx": pidx,
    });
    if (existingSubscription) {
      return res.status(400).json({
        success: false,
        message: "Payment already verified",
      });
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
    console.log("Khalti verification response:", verificationResponse.data);

    if (verificationResponse.data.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${verificationResponse.data.status}`,
      });
    }

    const transactionId = verificationResponse.data.transaction_id;

    // Fetch user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Manage subscription
    let subscription = await subscriptionModel.findOne();
    if (!subscription) {
      subscription = new subscriptionModel({
        plan: "12-month",
        discount: 10,
        users: [],
      });
    }

    const userIndex = subscription.users.findIndex(
      (u) => u.userId.toString() === userId.toString()
    );
    if (userIndex !== -1) {
      subscription.users[userIndex] = {
        userId,
        startDate,
        endDate,
        status: "active",
        pidx,
        transactionId,
      };
    } else {
      subscription.users.push({
        userId,
        startDate,
        endDate,
        status: "active",
        pidx,
        transactionId,
      });
    }

    await subscription.save();
    user.isSubscribed = true;
    user.subscription = subscription._id;
    await user.save();

    res.json({
      success: true,
      message: "Subscription activated successfully!",
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