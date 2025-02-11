import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    serviceData: { type: Object, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" }, // Link to payment model
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
