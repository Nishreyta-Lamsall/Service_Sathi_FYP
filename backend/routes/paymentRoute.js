import express from "express";
import Booking from "../models/bookingModel.js";
import Payment from "../models/paymentModel.js";

const paymentRouter = express.Router();

paymentRouter.post("/initialize-esewa", async (req, res) => {
  // Changed `router` to `paymentRouter`
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.cancelled || booking.payment) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or already paid booking" });
    }

    const redirectUrl = `https://esewa.com/payment?amount=${booking.amount}&bookingId=${bookingId}`;

    res.json({
      success: true,
      payment: {
        redirectUrl,
        transaction_uuid: bookingId,
        amount: booking.amount,
      },
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error initializing payment",
      error: error.message,
    });
  }
});

paymentRouter.get("/complete-payment", async (req, res) => {
  // Changed `router` to `paymentRouter`
  try {
    const { transaction_code, bookingId } = req.query;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.cancelled || booking.payment) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or already paid booking" });
    }

    const paymentData = await Payment.create({
      transactionId: transaction_code,
      bookingId,
      amount: booking.amount,
      paymentGateway: "eSewa",
      status: "success",
    });

    await Booking.findByIdAndUpdate(bookingId, { $set: { payment: true } });

    res.json({
      success: true,
      message: "Payment successful",
      paymentData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
});

export default paymentRouter;
