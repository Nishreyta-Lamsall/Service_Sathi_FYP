import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import adminRouter from "./routes/adminRoute.js";
import serviceRouter from "./routes/serviceRoute.js";
import userRouter from "./routes/userRoute.js";
import Payment from "./models/paymentModel.js";
import Booking from "./models/bookingModel.js";
import { getEsewaPaymentHash, verifyEsewaPayment } from "./payment/esewa.js";

//app config
const app = express();
const port = process.env.PORT || 3000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/admin", adminRouter);
app.use("/api/service", serviceRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.post("/api/payment/initialize-esewa", async (req, res) => {
  try {
    const { bookingId, totalPrice } = req.body;

    // Validate that the booking exists and the amount matches
    const booking = await Booking.findOne({
      _id: bookingId,
      amount: Number(totalPrice),
      payment: false, // Ensure payment hasn't already been made
      cancelled: false, // Ensure booking isn't canceled
    });

    if (!booking) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking or price mismatch, or already paid.",
      });
    }

    // Initiate payment with eSewa
    const paymentInitiate = await getEsewaPaymentHash({
      amount: totalPrice,
      transaction_uuid: booking._id, // Use booking ID as transaction ID
    });

    // You might want to store the payment record here in case of a failed payment
    const paymentData = new Payment({
      bookingId: booking._id,
      userId: booking.userId,
      amount: totalPrice,
      paymentGateway: "esewa",
      status: "pending", // Status is pending until verified
    });
    await paymentData.save();

    res.json({
      success: true,
      payment: paymentInitiate,
      booking,
      paymentId: paymentData._id,
    });
  } catch (error) {
    console.error("Error initializing payment:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/payment/complete-payment", async (req, res) => {
  const { data } = req.query; // Transaction ID from eSewa

  try {
    // Verify payment with eSewa
    const paymentInfo = await verifyEsewaPayment(data);

    // Find the booking using the transaction UUID
    const booking = await Booking.findById(
      paymentInfo.response.transaction_uuid
    );

    if (!booking) {
      return res.status(500).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Create a new payment record in the database
    const paymentData = await Payment.create({
      pidx: paymentInfo.decodedData.transaction_code,
      transactionId: paymentInfo.decodedData.transaction_code,
      bookingId: booking._id,
      userId: booking.userId,
      amount: booking.amount,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: "esewa",
      status: "success",
    });

    // Update the booking to mark it as paid
    await Booking.findByIdAndUpdate(booking._id, { payment: true });

    res.json({
      success: true,
      message: "Payment successful",
      paymentData,
    });
  } catch (error) {
    console.error("Error during payment verification:", error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: "An error occurred during payment verification",
      error: error.message,
    });
  }
});


app.listen(port, () => {
  console.log("Server is listening on port", port);
});
