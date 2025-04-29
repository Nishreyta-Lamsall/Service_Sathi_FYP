import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    category: { type: String, required: true },
    phone_number: {
      type: String,
      required: true,
      match: [
        /^(97|98)[0-9]{7,8}$/,
        "Phone number must be a valid Nepali number (e.g., 9812345678)",
      ],
    },
    citizenship_number: { type: String, required: true, unique: true },
    experience: { type: String, required: true },
    address: { type: Object, default: { line1: "", line2: "" } },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          required: true,
        },
        serviceName: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const serviceProviderModel =
  mongoose.models.ServiceProvider ||
  mongoose.model("ServiceProvider", serviceProviderSchema);

export default serviceProviderModel;
