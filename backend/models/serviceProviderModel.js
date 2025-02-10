import mongoose from "mongoose";
import serviceModel from "./serviceModel.js";

const serviceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
    category: { type: String, required: true },
    phone_number: { type: String, required: true },
    citizenship_number: { type: String, required: true, unique: true },
    experience: { type: String, required: true },
    address: { type: Object, default: { line1: "", line2: "" } },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service", // Reference to the Service model
          required: true,
        },
        serviceName: {
          type: String,
          required: true, // This will store the name of the service
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
