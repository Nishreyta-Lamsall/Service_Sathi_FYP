import serviceModel from "../models/serviceModel.js";
import jwt from "jsonwebtoken";
import bookingModel from "../models/bookingModel.js";
import userModel from "../models/userModel.js";
import serviceProviderModel from "../models/serviceProviderModel.js";
import mongoose from "mongoose";
import subscriptionModel from "../models/subscriptionModel.js";
import twilio from "twilio";
import Contact from "../models/contactModel.js";

const addService = async (req, res) => {
  try {
    const { nameEn, nameNp, categoryEn, categoryNp, aboutEn, aboutNp, price } =
      req.body;
    const imageFile = req.file;

    if (
      !nameEn ||
      !nameNp ||
      !categoryEn ||
      !categoryNp ||
      !aboutEn ||
      !aboutNp ||
      !price
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is required" });
    }

    const formattedPrice = parseFloat(price).toFixed(2);
    if (!/^[0-9]+(\.[0-9]{2})?$/.test(formattedPrice)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number with exactly 2 decimal places",
      });
    }

    const existingService = await serviceModel.findOne({
      $or: [{ "name.en": nameEn }, { "name.np": nameNp }],
    });
    if (existingService) {
      return res
        .status(400)
        .json({ success: false, message: "Service name must be unique" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      imageFile.filename
    }`;

    const serviceData = {
      name: { en: nameEn, np: nameNp },
      category: { en: categoryEn, np: categoryNp },
      about: { en: aboutEn, np: aboutNp },
      price: formattedPrice,
      image: imageUrl,
    };

    const newService = new serviceModel(serviceData);
    await newService.save();

    res.json({
      success: true,
      message: "Service Added Successfully",
      data: newService,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      nameEn,
      nameNp,
      categoryEn,
      categoryNp,
      aboutEn,
      aboutNp,
      price,
      available,
    } = req.body;
    const imageFile = req.file;

    if (!mongoose.Types.ObjectId.isValid(serviceId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid service ID format" });
    }

    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    let imageUrl = service.image;
    if (imageFile) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        imageFile.filename
      }`;
    }

    let formattedPrice = service.price;
    if (price !== undefined) {
      formattedPrice = parseFloat(price).toFixed(2);
      if (!/^[0-9]+(\.[0-9]{2})?$/.test(formattedPrice)) {
        return res.status(400).json({
          success: false,
          message: "Price must be a number with exactly 2 decimal places",
        });
      }
    }

    service.name.en = nameEn || service.name.en;
    service.name.np = nameNp || service.name.np;
    service.category.en = categoryEn || service.category.en;
    service.category.np = categoryNp || service.category.np;
    service.about.en = aboutEn || service.about.en;
    service.about.np = aboutNp || service.about.np;
    service.price = formattedPrice;
    service.available = available !== undefined ? available : service.available;
    service.image = imageUrl;

    if (nameEn || nameNp) {
      const existingService = await serviceModel.findOne({
        $and: [
          { _id: { $ne: serviceId } },
          {
            $or: [
              { "name.en": nameEn || service.name.en },
              { "name.np": nameNp || service.name.np },
            ],
          },
        ],
      });
      if (existingService) {
        return res
          .status(400)
          .json({ success: false, message: "Service name must be unique" });
      }
    }

    await service.save();

    res.json({
      success: true,
      message: "Service updated successfully",
      updatedService: service,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default updateService;

const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await serviceModel.findById(serviceId);
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

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

    const parsedAddress = address
      ? JSON.parse(address)
      : { line1: "", line2: "" };

    if (!name) {
      return res.json({ success: false, message: "Name missing" });
    }
    if (!email) {
      return res.json({ success: false, message: "Email missing" });
    }
    if (!category) {
      return res.json({ success: false, message: "Category missing" });
    }
    if (!phone_number || phone_number.trim() === "") {
      return res.json({
        success: false,
        message: "Phone number missing or invalid",
      });
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

    const existingEmail = await serviceProviderModel.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Service provider with this email already exists",
        });
    }

    const existingCitizenship = await serviceProviderModel.findOne({
      citizenship_number,
    });
    if (existingCitizenship) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Service provider with this citizenship number already exists",
        });
    }

    let imageUrl = "";
    if (imageFile) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        imageFile.filename
      }`;
    }

    const serviceProviderData = {
      name,
      email,
      phone_number,
      citizenship_number,
      experience,
      address: parsedAddress,
      services: parsedServices,
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

    const serviceProvider = await serviceProviderModel.findById(id);
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    }

    const parsedServices = services
      ? JSON.parse(services)
      : serviceProvider.services;
    const parsedAddress = address
      ? JSON.parse(address)
      : serviceProvider.address;

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

    let imageUrl = serviceProvider.image;
    if (imageFile) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        imageFile.filename
      }`;
    }

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

    const serviceProvider = await serviceProviderModel.findById(id);
    if (!serviceProvider) {
      return res
        .status(404)
        .json({ success: false, message: "Service provider not found" });
    }

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
    res.json({ success: false, message: error.message });
  }
};

const allServices = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    res.json({ success: true, services });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const allServiceProviders = async (req, res) => {
  try {
    const serviceProviders = await serviceProviderModel.find({});
    res.json({ success: true, serviceProviders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const bookingsAdmin = async (req, res) => {
  try {
    const bookings = await bookingModel.find({});
    res.json({ success: true, bookings });
  } catch (error) {
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

    const userData = await userModel.findById(booking.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const serviceData = await serviceModel.findById(booking.serviceId);
    if (!serviceData) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    const messageForUser = `Hello ${userData.name}, your booking for ${serviceData.name} is ${orderStatus}.`;

    const phoneNumberForUser = userData.phone.startsWith("+977")
      ? userData.phone
      : `+977${userData.phone}`;

    try {
      const userMessage = await client.messages.create({
        body: messageForUser,
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumberForUser,
      });
    } catch (twilioError) {}

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully and user notified",
      booking,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const sendWorkflow = async (req, res) => {
  try {
    const { bookingId, workflowMessage } = req.body;

    if (!bookingId || !workflowMessage) {
      return res.status(400).json({
        success: false,
        message: "Missing bookingId or workflowMessage",
      });
    }

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.workflowMessage = {
      content: workflowMessage,
      sentAt: new Date(),
      sentBy: req.user?.id || "admin",
    };
    await booking.save();

    const servicesData = await serviceModel.findById(booking.serviceId);
    if (!servicesData) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    const userData = await userModel.findById(booking.userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const messageForUser = `A milestone has been sent to your booking page for service ${servicesData.name} on this date ${booking.slotDate}.`;

    const phoneNumberForUser = userData.phone.startsWith("+977")
      ? userData.phone
      : `+977${userData.phone}`;

    try {
      const userMessage = await client.messages.create({
        body: messageForUser,
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumberForUser,
      });
      console.log(
        "SMS sent to user:",
        phoneNumberForUser,
        "SID:",
        userMessage.sid
      );
    } catch (twilioError) {
      console.error("Failed to send SMS to user:", {
        message: twilioError.message,
        code: twilioError.code,
        status: twilioError.status,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Workflow message saved and notification sent to user successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const markWorkflowAsRead = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.workflowMessage) {
      booking.workflowMessage.isRead = true;
      await booking.save();
    }

    return res.status(200).json({
      success: true,
      message: "Workflow marked as read",
      booking,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await serviceModel.findById(serviceId);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const services = await serviceModel.find({});
    const users = await userModel.find({});
    const bookings = await bookingModel.find({});
    const serviceProviders = await serviceProviderModel.find({});

    const subscribedUsers = users.filter((user) => user.isSubscribed);
    const regularUsers = users.filter((user) => !user.isSubscribed);

    const dashData = {
      services: services.length,
      bookings: bookings.length,
      users: users.length,
      subscribedUsers: subscribedUsers.length,
      regularUsers: regularUsers.length,
      serviceProviders: serviceProviders.length,
      latestBookings: bookings.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionModel.find({});

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ message: "No subscriptions available" });
    }

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getcontact = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching contact messages" });
  }
};

const postContact = async (req, res) => {
  const { firstName, email, phone, message } = req.body;

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
    res.status(500).json({ message: "Error occurred. Please try again." });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    const user = await userModel.findById(userId).select("name email phone");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      name: user.name || "Unknown User",
      email: user.email || "N/A",
      phone: user.phone || "N/A",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or empty userIds array" });
    }

    const invalidIds = userIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid user IDs: ${invalidIds.join(", ")}`,
      });
    }

    const users = await userModel
      .find({ _id: { $in: userIds } })
      .select("name email phone");

    const userMap = users.reduce((map, user) => {
      map[user._id.toString()] = {
        name: user.name || "Unknown User",
        email: user.email || "N/A",
        phone: user.phone || "N/A",
      };
      return map;
    }, {});

    res.json({ success: true, users: userMap });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("name email phone");

    const userList = users.map((user) => ({
      userId: user._id.toString(),
      name: user.name || "Unknown User",
      email: user.email || "N/A",
      phone: user.phone || "N/A",
    }));

    res.json({ success: true, users: userList });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await userModel.findByIdAndDelete(userId);

    await subscriptionModel.updateMany(
      { "users.userId": userId },
      { $pull: { users: { userId } } }
    );

    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
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
  postContact,
  markWorkflowAsRead,
  sendWorkflow,
  getUserById,
  getUsers,
  getAllUsers,
  deleteUser,
};
