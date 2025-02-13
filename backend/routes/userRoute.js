import express from 'express'
import {registerUser, loginUser, getProfile, updateProfile, bookService, listService, cancelBooking, subscribeUser} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';
import { cancelSubscription } from '../controllers/subscriptionController.js';
import { addReview, deleteReview, getAllReviews, getReviewsByServiceProvider } from '../controllers/reviewController.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post("/login", loginUser);
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

export default userRouter
