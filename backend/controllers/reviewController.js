import reviewModel from "../models/reviewModel.js";
import serviceProviderModel from "../models/serviceProviderModel.js";

const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { serviceProviderId } = req.params;
    const userId = req.body.userId; 

    const serviceProvider = await serviceProviderModel.findById(
      serviceProviderId
    );
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    }

    const newReview = new reviewModel({
      user: userId,
      serviceProvider: serviceProviderId,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({
      success: true, // 
      message: "Review added successfully",
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find().populate("user", "name").populate("serviceProvider", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByServiceProvider = async (req, res) => {
  try {
    const { serviceProviderId } = req.params;
    const reviews = await reviewModel
      .find({
        serviceProvider: serviceProviderId,
      })
      .populate("user", "name");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.body.userId; 

    const review = await reviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    await reviewModel.findByIdAndDelete(reviewId);
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addReview, getReviewsByServiceProvider, deleteReview , getAllReviews};
