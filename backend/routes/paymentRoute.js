import express from "express";
import authUser from "../middlewares/authUser.js";
import { initializeKhaltiPayment, verifyKhaltiPayment } from "../controllers/khaltiController.js";

const paymentRouter = express.Router();

// Route to initialize Khalti payment
paymentRouter.post("/initiate", authUser, initializeKhaltiPayment);

// Route to verify Khalti payment
paymentRouter.post("/verify-khalti", authUser, verifyKhaltiPayment);

export default paymentRouter;
