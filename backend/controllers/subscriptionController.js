import subscriptionModel from "../models/subscriptionModel.js";
import userModel from "../models/userModel.js";

export const createSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    const planDetails = {
      "6-month": { duration: 6, discount: 5 },
      "12-month": { duration: 12, discount: 10 },
    };

    if (!planDetails[plan]) {
      return res.status(400).json({ message: "Invalid plan type" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planDetails[plan].duration);

    let nextInspection = null;
    if (plan === "12-month") {
      nextInspection = new Date();
      nextInspection.setMonth(nextInspection.getMonth() + 4);
    }

    const newSubscription = new subscriptionModel({
      plan,
      discount: planDetails[plan].discount,
      startDate,
      endDate,
      nextInspection,
      status: "active",
      users: [],
    });

    await newSubscription.save();
    res.status(201).json({
      message: "Subscription created successfully",
      newSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId).populate("subscription");

    if (!user || !user.subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    res.status(200).json(user.subscription);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user._id;

    const subscription = await subscriptionModel.findOne({ users: userId });

    if (!subscription) {
      return res.status(404).json({ message: "No active subscription found" });
    }
    subscription.status = "canceled";
    await subscription.save();

    res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const assignSubscriptionToUser = async (req, res) => {
  try {
    const { userId, subscriptionId } = req.body;

    if (!userId || !subscriptionId) {
      return res.status(400).json({ message: "User ID and Subscription ID are required" });
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isUserSubscribed = subscription.users.some(user => user.userId.toString() === userId);
    if (isUserSubscribed) {
      return res.status(400).json({ message: "User is already subscribed to this plan" });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (subscription.plan === "12-month" ? 12 : 6));

    let nextInspection = null;
    if (subscription.plan === "12-month") {
      nextInspection = new Date();
      nextInspection.setMonth(nextInspection.getMonth() + 4);
    }

    subscription.users.push({
      userId,
      startDate,
      endDate,
      status: "active",
      nextInspection,
    });

    await subscription.save();
    user.subscription = subscriptionId;
    await user.save();

    res.status(200).json({ message: "Subscription assigned successfully", subscription });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
