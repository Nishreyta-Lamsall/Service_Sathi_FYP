import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  initiateSubscriptionPayment,
  verifySubscriptionPayment,
} from "../controllers/khaltiController.js";

const paymentRouter = express.Router();

paymentRouter.post("/initiate-payment", authUser, initiateSubscriptionPayment);
paymentRouter.post("/verify-khalti", authUser, verifySubscriptionPayment);

export default paymentRouter;
