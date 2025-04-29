import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import serviceModel from "../models/serviceModel.js";
import bookingModel from "../models/bookingModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import twilio from "twilio";
import serviceProviderModel from "../models/serviceProviderModel.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong password" });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    res.json({
      success: true,
      message: "User registered. Verify the link sent to your email to login.",
    });

    const verificationLink = `http://localhost:3000/api/user/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to ServiceSathi - Verify Your Email",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #007bff, #00c4ff);
              color: #ffffff;
              padding: 40px 20px;
              text-align: center;
            }
            .header img {
              max-width: 120px;
              margin-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
              text-align: center;
              color: #333333;
            }
            .content p {
              font-size: 16px;
              margin: 0 0 20px;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #007bff, #00c4ff);
              color: #ffffff;
              text-decoration: none;
              border-radius: 25px;
              font-size: 16px;
              font-weight: 600;
              transition: transform 0.2s ease;
            }
            .button:hover {
              transform: scale(1.05);
              background: linear-gradient(135deg, #0056b3, #0099cc);
            }
            .footer {
              background-color: #f8f9fa;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
              padding: 20px;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome, ${name}!</h1>
            </div>
            <div class="content">
              <p>We're thrilled to have you join ServiceSathi!</p>
              <p>To get started, please verify your email address by clicking the button below:</p>
              <a href="${verificationLink}" class="button">Verify Your Email</a>
            </div>
            <div class="footer">
              <p>If you didn’t sign up, feel free to ignore this email.</p>
              <p>© ${new Date().getFullYear()} Service Sathi. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `http://localhost:3000/api/user/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ServiceSathi - Resend Email Verification",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #007bff, #00c4ff);
              color: #ffffff;
              padding: 40px 20px;
              text-align: center;
            }
            .header img {
              max-width: 120px;
              margin-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
              text-align: center;
              color: #333333;
            }
            .content p {
              font-size: 16px;
              margin: 0 0 20px;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #007bff, #00c4ff);
              color: #ffffff;
              text-decoration: none;
              border-radius: 25px;
              font-size: 16px;
              font-weight: 600;
              transition: transform 0.2s ease;
            }
            .button:hover {
              transform: scale(1.05);
              background: linear-gradient(135deg, #0056b3, #0099cc);
            }
            .footer {
              background-color: #f8f9fa;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
              padding: 20px;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Email Verification</h1>
            </div>
            <div class="content">
              <p>You’ve requested a new verification link for ServiceSathi.</p>
              <p>Please click the button below to verify your email:</p>
              <a href="${verificationLink}" class="button">Verify Now</a>
           �n
            <div class="footer">
              <p>If you didn’t request this, please ignore this email.</p>
              <p>© ${new Date().getFullYear()} Service Sathi. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "Verification email has been sent.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // 1 hour expiration

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "ServiceSathi - Reset Your Password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 0;
              line-height: 1.6;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #007bff, #00c4ff);
              color: #ffffff;
              padding: 40px 20px;
              text-align: center;
            }
            .header img {
              max-width: 120px;
              margin-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
              text-align: center;
              color: #333333;
            }
            .content p {
              font-size: 16px;
              margin: 0 0 20px;
            }
            .button {
              display: inline-block;
              padding: 14px 30px;
              background: linear-gradient(135deg, #007bff, #00c4ff);
              color: #ffffff;
              text-decoration: none;
              border-radius: 25px;
              font-size: 16px;
              font-weight: 600;
              transition: transform 0.2s ease;
            }
            .button:hover {
              transform: scale(1.05);
              background: linear-gradient(135deg, #0056b3, #0099cc);
            }
            .footer {
              background-color: #f8f9fa;
              text-align: center;
              font-size: 12px;
              color: #6c757d;
              padding: 20px;
            }
            .footer a {
              color: #007bff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your ServiceSathi password.</p>
              <p>Click the button below to reset it (link expires in 1 hour):</p>
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <div class="footer">
              <p>If you didn’t request this, please ignore this email.</p>
              <p>© ${new Date().getFullYear()} ServiceSathi. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password reset email sent",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server error during verification" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    if (!user.isVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before logging in.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials!" });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyResetToken = async (req, res) => {
  const { resetToken } = req.params;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.json({
      success: true,
      message: "Token is valid, you can now reset your password",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await userModel.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Data missing" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        address: JSON.parse(address),
        dob,
        gender,
      },
      { new: true }
    );

    if (imageFile) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        imageFile.filename
      }`;
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });
      await bookingModel.updateMany(
        { userId },
        { $set: { userData: { ...updatedUser.toObject(), image: imageUrl } } }
      );
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const bookService = async (req, res) => {
  try {
    const { userId, serviceId, slotDate, slotTime } = req.body;

    const serviceData = await serviceModel.findById(serviceId);

    if (!serviceData.available) {
      return res.json({ success: false, message: "Service not available" });
    }

    let slots_booked = serviceData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Service already booked.",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData.phone || userData.phone === "0000000000") {
      return res.json({
        success: false,
        message:
          "Please provide a valid phone number in your profile before booking.",
      });
    }

    if (!userData.dob) {
      return res.json({
        success: false,
        message:
          "Please provide a valid date of birth in your profile before booking.",
      });
    }

    if (
      !userData.address ||
      !userData.address.line1.trim() ||
      !userData.address.line2.trim()
    ) {
      return res.json({
        success: false,
        message:
          "Please provide complete address in your profile before booking.",
      });
    }

    const userPhone = userData.phone;

    delete serviceData.slots_booked;

    const bookingData = {
      userId,
      serviceId,
      userData,
      serviceData,
      amount: serviceData.price.en,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newBooking = new bookingModel(bookingData);
    await newBooking.save();

    await serviceModel.findByIdAndUpdate(serviceId, { slots_booked });

    const serviceProvider = await serviceProviderModel.findOne({
      "services.serviceId": serviceId,
    });

    if (!serviceProvider) {
      return res.json({
        success: false,
        message: "Service Provider not found",
      });
    }

    const message = `Hello ${serviceProvider.name}, you have a new booking for your service (${serviceData.name}) on ${slotDate} at ${slotTime}. The user's phone number is ${userPhone}. Please be available.`;

    const phoneNumber = serviceProvider.phone_number.startsWith("+977")
      ? serviceProvider.phone_number
      : `+977${serviceProvider.phone_number}`;

    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.json({
      success: true,
      message: "Service Booked and service provider notified",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listService = async (req, res) => {
  try {
    const { userId } = req.body;
    const bookings = await bookingModel.find({ userId });

    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { userId, bookingId } = req.body;
    const bookingData = await bookingModel.findById(bookingId);

    if (!bookingData || bookingData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Cannot delete booking!" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, {
      cancelled: true,
      userCancelled: true,
    });

    const servicesData = await serviceModel.findById(bookingData.serviceId);
    if (!servicesData) {
      return res.json({ success: false, message: "Service not found!" });
    }

    const { slotDate, slotTime } = bookingData;
    let slots_booked = servicesData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
      if (slots_booked[slotDate].length === 0) delete slots_booked[slotDate];
    }

    await serviceModel.findByIdAndUpdate(bookingData.serviceId, {
      slots_booked,
    });

    const serviceProvider = await serviceProviderModel.findOne({
      "services.serviceId": bookingData.serviceId,
    });

    if (!serviceProvider) {
      return res.json({
        success: false,
        message: "Service provider not found!",
      });
    }

    const message = `Hello ${serviceProvider.name}, your booking for the service (${servicesData.name}) has been cancelled for the time slot ${slotTime} on ${slotDate}.`;

    const phoneNumber = serviceProvider.phone_number.startsWith("+977")
      ? serviceProvider.phone_number
      : `+977${serviceProvider.phone_number}`;

    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.json({
      success: true,
      message: "Booking Cancelled by User and Service Provider Notified",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const subscribeUser = async (req, res) => {
  const { subscriptionId, plan } = req.body;
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isSubscribed) {
      return res.status(400).json({ message: "User is already subscribed" });
    }

    const subscription = await subscriptionModel.findById(subscriptionId);
    if (!subscription) {
      throw new Error("Subscription plan not found");
    }

    const startDate = new Date();
    const endDate = new Date();
    if (plan === "6-month") {
      endDate.setMonth(startDate.getMonth() + 6);
    } else if (plan === "12-month") {
      endDate.setMonth(startDate.getMonth() + 12);
    } else {
      throw new Error("Invalid plan type");
    }

    subscription.users.push({
      userId: user._id,
      startDate,
      endDate,
      status: "active",
    });

    await subscription.save();

    user.isSubscribed = true;
    user.subscription = subscription._id;
    user.subscriptionPlan = plan;
    await user.save();

    return res.status(200).json({
      message: "User successfully subscribed",
      user,
      subscription,
    });
  } catch (error) {
    console.error("Error subscribing user:", error);
    return res
      .status(500)
      .json({ message: error.message || "Error subscribing user" });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookService,
  listService,
  cancelBooking,
  verifyUser,
  resendVerification,
  forgotPassword,
  verifyResetToken,
  resetPassword,
};
