import testimonialModel from "../models/testimonialModel.js";
import userModel from "../models/userModel.js";

const addTestimonial = async (req, res) => {
  try {
    const { message, rating } = req.body;
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newTestimonial = new testimonialModel({
      user: userId,
      message,
      rating,
      name: user.name, 
      image: user.image, 
    });

    const savedTestimonial = await newTestimonial.save();

    res.status(201).json({
      success: true,
      message: "Testimonial added successfully",
      testimonial: savedTestimonial, 
    });
  } catch (error) {
    console.error("Error adding testimonial:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel
      .find()

    if (testimonials.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No testimonials found" });
    }

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { testimonialId } = req.params;

    const deletedTestimonial = await testimonialModel.findByIdAndDelete(
      testimonialId
    );

    if (!deletedTestimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
      testimonial: deletedTestimonial,
    });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const toggleApproval = async (req, res) => {
  try {
    const { testimonialId } = req.params;
    const { approved } = req.body; 

    const testimonial = await testimonialModel.findById(testimonialId);

    if (!testimonial) {
      return res
        .status(404)
        .json({ success: false, message: "Testimonial not found" });
    }

    testimonial.approved = approved;
    await testimonial.save();

    res.status(200).json({
      success: true,
      message: "Testimonial approval status updated",
      testimonial,
    });
  } catch (error) {
    console.error("Error updating approval status:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getApprovedTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialModel.find({ approved: true });

    if (testimonials.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No approved testimonials found" });
    }

    res.status(200).json({
      success: true,
      testimonials,
    });
  } catch (error) {
    console.error("Error fetching approved testimonials:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export {
  addTestimonial,
  getAllTestimonials,
  deleteTestimonial,
  toggleApproval,
  getApprovedTestimonials,
};
