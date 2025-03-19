import express from 'express'
import {registerUser, loginUser, getProfile, updateProfile, bookService, listService, cancelBooking, subscribeUser, verifyUser, resendVerification, forgotPassword, resetPassword, verifyResetToken} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { cancelSubscription } from '../controllers/subscriptionController.js';
import { addReview, deleteReview, getAllReviews, getReviewsByServiceProvider } from '../controllers/reviewController.js';
import { addTestimonial } from '../controllers/testimonialController.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post("/login", loginUser);
userRouter.get("/verify/:token", verifyUser);
userRouter.post("/resend-verification", resendVerification);
userRouter.post("/forgot-password", forgotPassword);
userRouter.get("/reset-password/:resetToken", verifyResetToken);
userRouter.post("/reset-password/:resetToken", resetPassword);
userRouter.get('/get-profile',authUser, getProfile)
userRouter.post("/update-profile",upload.single('image'),authUser,updateProfile);
userRouter.post('/book-service', authUser, bookService)
userRouter.get("/bookings",authUser,listService);
userRouter.post("/cancel-booking", authUser, cancelBooking);
userRouter.post("/cancel-subscription", authUser, cancelSubscription);
userRouter.post("/subscribe/:userId", authUser, subscribeUser);
userRouter.post("/addreview/:serviceProviderId", authUser, addReview);
userRouter.get("/getreviews/:serviceProviderId", getReviewsByServiceProvider);
userRouter.get("/get-all-reviews", getAllReviews);
userRouter.delete("/delete-review/:reviewId", authUser, deleteReview);
userRouter.post("/addtestimonial", authUser, addTestimonial);

export default userRouter
