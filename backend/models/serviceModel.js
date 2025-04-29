import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      en: { type: String, required: true },
      np: { type: String, required: true },
    },
    category: {
      en: { type: String, required: true }, 
      np: { type: String, required: true }, 
    },
    about: {
      en: { type: String, required: true },
      np: { type: String, required: true },
    },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    price: {type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
  },
  { minimize: false, timestamps: true }
);

const serviceModel =
  mongoose.models.service || mongoose.model("service", serviceSchema);

export default serviceModel;
