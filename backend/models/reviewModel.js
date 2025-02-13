import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String},
  createdAt: { type: Date, default: Date.now },
});

const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default reviewModel;
