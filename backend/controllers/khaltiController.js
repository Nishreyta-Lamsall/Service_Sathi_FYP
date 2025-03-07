import axios from "axios";
import subscriptionModel from "../models/subscriptionModel.js";
import userModel from "../models/userModel.js";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
const KHALTI_BASE_URL = "https://a.khalti.com/api/v2";

export const initiateSubscriptionPayment = async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const userId = req.body.userId;  

    if (!subscriptionId) {
      return res.status(400).json({ message: "Subscription ID is required" });
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isSubscribed) {
      return res.status(400).json({ message: "User is already subscribed" });
    }

    const subscriptionPrice = subscription.plan === "12-month" ? 3500 : 0;

    const payload = {
      return_url: `${process.env.FRONTEND_URL}/subscription-payment-verify`,
      website_url: process.env.FRONTEND_URL,
      amount: subscriptionPrice * 100,
      purchase_order_id: `SUB_${Date.now()}`,
      purchase_order_name: `Subscription Plan - ${subscription.plan}`,
      customer_info: {
        name: user.name,
        email: user.email,
        phone: user.phone || "9800000000",
      },
    };

    const response = await axios.post(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      payload,
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      message: error.response?.data?.detail || error.message,
      error: error.toString(),
    });
  }
};

export const verifySubscriptionPayment = async (req, res) => {
  try {
    const { pidx, transaction_id, userId } = req.query;

    console.log("Received Data:", { pidx, transaction_id, userId });

    if (!userId) {
      console.error("User ID is missing!");
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!pidx) {
      console.error("Payment ID (pidx) is missing!");
      return res.status(400).json({ message: "Payment ID (pidx) is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found!");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Found:", user);

    if (!user.subscription) {
      console.error("User does not have a subscription assigned!");
      return res
        .status(400)
        .json({ message: "User does not have a subscription" });
    }

    let subscription = await subscriptionModel.findById(user.subscription);
    if (!subscription) {
      console.error("Subscription not found for user!");
      return res.status(404).json({ message: "Subscription not found" });
    }

    console.log("Subscription Found:", subscription);

    const isUserSubscribed = subscription.users.some(
      (sub) => sub.userId.toString() === userId
    );

    if (isUserSubscribed) {
      console.warn("User is already subscribed!");
      return res.status(400).json({ message: "User is already subscribed" });
    }

    // Verify payment with Khalti API
    const paymentVerification = await axios.post(
      `${KHALTI_BASE_URL}/epayment/verify/`,
      {
        transaction_id: transaction_id,
        pidx: pidx,
      },
      {
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
        },
      }
    );

    // Check payment verification response
    if (!paymentVerification.data || !paymentVerification.data.success) {
      console.error("Payment verification failed!");
      return res.status(400).json({ message: "Payment verification failed" });
    }

    console.log("Payment Verified:", paymentVerification.data);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);

    subscription.users.push({
      userId,
      startDate,
      endDate,
      status: "active",
      nextInspection: null,
      pidx: pidx,
    });

    console.log("Updated Subscription Users List:", subscription.users);

    await subscription.save();
    console.log("Subscription saved successfully!");

    user.isSubscribed = true;
    user.subscription = subscription._id;
    user.subscriptionPlan = "12-month";

    console.log("Updated User:", user);

    await user.save();
    console.log("User saved successfully!");

    res.json({ message: "Subscription updated successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
