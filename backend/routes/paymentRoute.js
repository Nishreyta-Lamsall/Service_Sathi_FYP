import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  initiateBookingPayment,
  initiateSubscriptionPayment,
  verifyBookingPayment,
  verifySubscriptionPayment,
} from "../controllers/khaltiController.js";

const paymentRouter = express.Router();

paymentRouter.post("/initiate-payment", authUser, initiateSubscriptionPayment);
paymentRouter.post("/verify-khalti", authUser, verifySubscriptionPayment);
paymentRouter.post("/verify-khalti", authUser, verifySubscriptionPayment);
paymentRouter.post("/initiate-booking-payment", authUser, initiateBookingPayment);
paymentRouter.post(
  "/verify-booking-payment",
  authUser,
  verifyBookingPayment
);

export default paymentRouter;
