import serviceModel from "../models/serviceModel.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import serviceProviderModel from "../models/serviceProviderModel.js";
import mongoose from "mongoose";
import subscriptionModel from "../models/subscriptionModel.js";
import twilio from "twilio";
import Contact from "../models/contactModel.js";

//API for adding services
const addService = async (req, res) => {
  try {
    const { name, category, about, price } = req.body;
    const imageFile = req.file;

    //checking for all data to add srevice
    if (!name || !category || !about || !price) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (!imageFile) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const existingService = await serviceModel.findOne({ name });
    if (existingService) {
      return res
        .status(400)
        .json({ success: false, message: "Service name must be unique" });
    }

    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const serviceData = {
      name,
      image: imageUrl,
      category,
      about,
      price,
    };

    const newService = new serviceModel(serviceData);
    await newService.save();

    res.json({ success: true, message: "Service Added" });

    // Proceed with saving the service to the database here
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, category, about, price, available } = req.body;
    const imageFile = req.file;

    console.log("Received serviceId:", serviceId);
    console.log("Update request body:", req.body);

    // Validate serviceId format
    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid service ID format" });
    }

    // Fetch service from DB
    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Handle image upload if a new image is provided
    let imageUrl = service.image;
    if (imageFile) {
      // Delete old image from Cloudinary if it exists
      if (service.image) {
        const publicId = service.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // Update service fields
    service.name = name || service.name;
    service.category = category || service.category;
    service.about = about || service.about;
    service.price = price !== undefined ? price : service.price;
    service.available = available !== undefined ? available : service.available;
    service.image = imageUrl;

    console.log("Updated service before saving:", service);

    await service.save();

    console.log("Service successfully updated:", service);

    res.json({
      success: true,
      message: "Service updated successfully",
      updatedService: service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Check if service exists
    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    // Delete image from Cloudinary if exists
    if (service.image) {
      const publicId = service.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Delete service from database
    await serviceModel.deleteOne({ _id: serviceId });

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const addServiceProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      phone_number,
      citizenship_number,
      experience,
      address,
      services,
      category,
    } = req.body;
    const imageFile = req.file;

    const parsedServices = services ? JSON.parse(services) : [];

    // Address needs to be parsed as it is sent as a JSON string
    const parsedAddress = address
      ? JSON.parse(address)
      : { line1: "", line2: "" };

    // Checking if all required fields are provided
    if (!name) {
      return res.json({ success: false, message: "Name missing" });
    }
    if (!email) {
      return res.json({ success: false, message: "Email missing" });
    }
    if (!category) {
      return res.json({ success: false, message: "Category missing" });
    }
    if (!phone_number) {
      return res.json({ success: false, message: "Phone number missing" });
    }
    if (!citizenship_number) {
      return res.json({
        success: false,
        message: "Citizenship number missing",
      });
    }
    if (!experience) {
      return res.json({ success: false, message: "Experience missing" });
    }
    if (!address) {
      return res.json({ success: false, message: "Address missing" });
    }
    if (!services || services.length === 0) {
      return res.json({ success: false, message: "Services missing" });
    }

    // Checking if the email already exists in the database
    const existingEmail = await serviceProviderModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Service provider with this email already exists",
      });
    }

    // Checking if the citizenship number already exists in the database
    const existingCitizenship = await serviceProviderModel.findOne({
      citizenship_number,
    });
    if (existingCitizenship) {
      return res.status(400).json({
        success: false,
        message: "Service provider with this citizenship number already exists",
      });
    }

    // Image upload to cloudinary (if provided)
    let imageUrl = "";
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // Create the new service provider data
    const serviceProviderData = {
      name,
      email,
      phone_number,
      citizenship_number,
      experience,
      address: parsedAddress, // The address object will be parsed here
      services: parsedServices, // Ensure services are an array of strings
      category,
      image: imageUrl,
    };

    const newServiceProvider = new serviceProviderModel(serviceProviderData);
    await newServiceProvider.save();

    res.json({ success: true, message: "Service provider added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateServiceProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone_number,
      citizenship_number,
      experience,
      address,
      services,
      category,
    } = req.body;
    const imageFile = req.file;

    // Check if the service provider exists
    const serviceProvider = await serviceProviderModel.findById(id);
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    }

    // Initialize parsedServices and parsedAddress with existing values if not provided
    const parsedServices = services
      ? JSON.parse(services)
      : serviceProvider.services;
    const parsedAddress = address
      ? JSON.parse(address)
      : serviceProvider.address;

    // Validate email and citizenship number if provided
    if (email && email !== serviceProvider.email) {
      const existingEmail = await serviceProviderModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another provider",
        });
      }
    }

    if (
      citizenship_number &&
      citizenship_number !== serviceProvider.citizenship_number
    ) {
      const existingCitizenship = await serviceProviderModel.findOne({
        citizenship_number,
      });
      if (existingCitizenship) {
        return res.status(400).json({
          success: false,
          message: "Citizenship number is already in use by another provider",
        });
      }
    }

    // Handle image upload if a new image is provided
    let imageUrl = serviceProvider.image;
    if (imageFile) {
      // Delete the old image from Cloudinary
      if (serviceProvider.image) {
        const publicId = serviceProvider.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Upload the new image
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      imageUrl = imageUpload.secure_url;
    }

    // Update the service provider data
    serviceProvider.name = name || serviceProvider.name;
    serviceProvider.email = email || serviceProvider.email;
    serviceProvider.phone_number = phone_number || serviceProvider.phone_number;
    serviceProvider.citizenship_number =
      citizenship_number || serviceProvider.citizenship_number;
    serviceProvider.experience = experience || serviceProvider.experience;
    serviceProvider.address = parsedAddress;
    serviceProvider.services = parsedServices;
    serviceProvider.category = category || serviceProvider.category;
    serviceProvider.image = imageUrl;

    await serviceProvider.save();

    res.json({
      success: true,
      message: "Service provider updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteServiceProvider = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the service provider exists
    const serviceProvider = await serviceProviderModel.findById(id);
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    }

    // Delete the service provider document
    await serviceProviderModel.deleteOne({ _id: id });

    res.json({
      success: true,
      message: "Service provider deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getServiceProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceProvider = await serviceProviderModel.findById(id);

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: "Service provider not found",
      });
    }

    res.json({
      success: true,
      serviceProvider,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//API for admin login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get all services list for admin panel
const allServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    res.json({ success: true, services });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get all serviceproviders list for admin panel
const allServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await serviceProviderModel.find({});
    res.json({ success: true, serviceProviders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//API to get bookings list
const bookingsAdmin = async (req, res) => {
  try {
    const bookings = await bookingModel.find({});
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const { TWILIO_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;
const client = new twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const bookingCancel = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingData = await bookingModel.findById(bookingId);

    if (!bookingData) {
      return res.json({ success: false, message: "Booking not found!" });
    }

    await bookingModel.findByIdAndUpdate(bookingId, {
      cancelled: true,
      cancelledByAdmin: true,
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

    const messageForProvider = `Hello ${serviceProvider.name}, your booking for the service (${servicesData.name}) has been cancelled by the admin for the time slot ${slotTime} on ${slotDate}.`;

    const phoneNumberForProvider = serviceProvider.phone_number.startsWith(
      "+977"
    )
      ? serviceProvider.phone_number
      : `+977${serviceProvider.phone_number}`;

    await client.messages.create({
      body: messageForProvider,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumberForProvider,
    });

    const userData = await userModel.findById(bookingData.userId);
    if (!userData) {
      return res.json({
        success: false,
        message: "User not found!",
      });
    }

    const messageForUser = `Hello ${userData.name}, your booking for the service (${servicesData.name}) has been cancelled by the admin for the time slot ${slotTime} on ${slotDate}.`;

    const phoneNumberForUser = userData.phone.startsWith("+977")
      ? userData.phone
      : `+977${userData.phone}`;

    await client.messages.create({
      body: messageForUser,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumberForUser,
    });

    res.json({
      success: true,
      message: "Booking Cancelled by Admin, Service Provider and User Notified",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { bookingId, orderStatus } = req.body;

    const allowedStatuses = ["Booked", "On the Way", "Completed"];

    if (!bookingId || !orderStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Missing bookingId or orderStatus" });
    }

    if (!allowedStatuses.includes(orderStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid order status" });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.orderStatus = orderStatus;
    await booking.save();

    // Fetch the user data to send SMS
    const userData = await userModel.findById(booking.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const messageForUser = `Hello ${userData.name}, your service is ${orderStatus}.`;

    const phoneNumberForUser = userData.phone.startsWith("+977")
      ? userData.phone
      : `+977${userData.phone}`;

    // Send SMS using Twilio
    await client.messages.create({
      body: messageForUser,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumberForUser,
    });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully and user notified",
      booking,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    // Find service by ID
    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    const users = await userModel.find({});
    const bookings = await bookingModel.find({});
    const serviceProviders = await serviceProviderModel.find({});

    // Separate users into subscribed and regular
    const subscribedUsers = users.filter((user) => user.isSubscribed);
    const regularUsers = users.filter((user) => !user.isSubscribed);

    const dashData = {
      services: services.length,
      bookings: bookings.length,
      users: users.length, // Total users
      subscribedUsers: subscribedUsers.length, // Number of subscribed users
      regularUsers: regularUsers.length, // Number of regular users
      serviceProviders: serviceProviders.length,
      latestBookings: bookings.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.find({});

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ message: "No subscriptions available" });
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getcontact = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 }); // Fetch messages in descending order
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contact messages" });
  }
};

const postContact = async (req, res) => {
  const {firstName, email, phone, message } = req.body;

  if (!firstName || !email || !phone || !message) {
    return res
      .status(400)
      .json({ message: "Email, Phone, and Message are required" });
  }

  try {
    const newMessage = new Contact({
      firstName,
      lastName: req.body.lastName || "", 
      email,
      phone,
      message,
    });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ message: "Error occurred. Please try again." });
  }
};


export {
  addService,
  loginAdmin,
  allServices,
  bookingsAdmin,
  bookingCancel,
  adminDashboard,
  addServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  allServiceProviders,
  updateService,
  deleteService,
  getServiceById,
  getServiceProviderById,
  updateStatus,
  getSubscriptions,
  getcontact,
  postContact
};
