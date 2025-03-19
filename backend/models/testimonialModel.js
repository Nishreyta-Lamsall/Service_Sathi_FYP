import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  approved:{
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  name: { type: String, required: true }, 
  image: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const testimonialModel =
  mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);

export default testimonialModel;
