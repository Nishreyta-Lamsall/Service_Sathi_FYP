import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import serviceModel from "../models/serviceModel.js";
import bookingModel from "../models/bookingModel.js";
import subscriptionModel from "../models/subscriptionModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import twilio from 'twilio'
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
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p><a href="${verificationLink}">Verify Email by clicking on this link.</a>`,
    };

    transporter.sendMail(mailOptions).catch((err) => {
      console.error("Email sending failed:", err);
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
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

    // Redirect to the frontend login page
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
      // Set the token expiration to 30 days
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30d", // Token will expire in 30 days
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
      from: process.env.EMAIL,
      to: email,
      subject: "Resend Verification Email",
      html: `<p>Click the link below to verify your email:</p><a href="${verificationLink}">Verify Email by clicking on this link.</a>`,
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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Point to frontend route
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 1 hour.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password reset email sent",
      resetToken, // Optional, for debugging
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Backend: Verify the reset token
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

    // If the token is valid, return a success response
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

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined; // Clear the reset token
    user.resetPasswordExpires = undefined; // Clear the expiration time

    await user.save(); // Save the updated user

    // Respond with a success message after resetting the password
    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//API to get user profile data
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

    // Update user profile
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
      // Construct the full image URL
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        imageFile.filename
      }`;

      // Update the image in the user model
      await userModel.findByIdAndUpdate(userId, { image: imageUrl });

      // Update the userData in all related bookings
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

    // Checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Service Provider not available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    // Check if the user has provided a phone number, dob and address
    if (!userData.phone || userData.phone === "0000000000") {
      return res.json({
        success: false,
        message:
          "Please provide a valid phone number in your profile before booking.",
      });
    }

    // Check if the user has provided a dob
    if (!userData.dob) {
      return res.json({
        success: false,
        message:
          "Please provide a valid date of birth in your profile before booking.",
      });
    }

    // Check if address line1 or line2 are empty
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

    const userPhone = userData.phone; // User's phone number

    delete serviceData.slots_booked;

    const bookingData = {
      userId,
      serviceId,
      userData,
      serviceData,
      amount: serviceData.price,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newBooking = new bookingModel(bookingData);
    await newBooking.save();

    // Save new Slots Data in serviceData
    await serviceModel.findByIdAndUpdate(serviceId, { slots_booked });

    // Fetch service provider details
    const serviceProvider = await serviceProviderModel.findOne({
      "services.serviceId": serviceId,
    });

    if (!serviceProvider) {
      return res.json({
        success: false,
        message: "Service Provider not found",
      });
    }

    // Send a message to the service provider
    const message = `Hello ${serviceProvider.name}, you have a new booking for your service (${serviceData.name}) on ${slotDate} at ${slotTime}. The user's phone number is ${userPhone}. Please be available.`;

    const phoneNumber = serviceProvider.phone_number.startsWith("+977")
      ? serviceProvider.phone_number
      : `+977${serviceProvider.phone_number}`;

    await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber, // Service provider's phone number
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

//Api to get user appointments for my-bookings page
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
  resetPassword
};
