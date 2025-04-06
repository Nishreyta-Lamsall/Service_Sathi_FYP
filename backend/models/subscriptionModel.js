import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  plan: { type: String, enum: ["6-month", "12-month"], required: true },
  discount: { type: Number, required: true },
  users: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      status: { type: String, enum: ["active", "expired"], default: "active" },
      nextInspection: { type: Date, default: null },
      pidx: { type: String, default: null },
      transactionId: { type: String },
    },
  ],
});

const subscriptionModel =
  mongoose.models.subscription ||
  mongoose.model("subscription", subscriptionSchema);

export default subscriptionModel;
