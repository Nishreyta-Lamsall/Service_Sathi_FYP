import express from "express";
import authUser from "../middlewares/authUser.js";
import { initiateSubscriptionPayment, verifySubscriptionPayment } from "../controllers/khaltiController.js";

const paymentRouter = express.Router()

// Route to initialize Khalti payment
paymentRouter.post("/initiate-payment", authUser, initiateSubscriptionPayment);

// Route to verify Khalti payment
paymentRouter.get("/verify-khalti", authUser, verifySubscriptionPayment);

export default paymentRouter;
