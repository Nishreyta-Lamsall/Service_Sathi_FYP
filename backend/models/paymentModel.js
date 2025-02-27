import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["completed", "pending", "failed"],
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    paymentDetails: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
