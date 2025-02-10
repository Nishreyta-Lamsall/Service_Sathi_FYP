import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    about: { type: String, required: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    price: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true, // To ensure every service must have a provider
    },
  },
  { minimize: false },
  { timestamps: true }
);

const serviceModel =
  mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;
