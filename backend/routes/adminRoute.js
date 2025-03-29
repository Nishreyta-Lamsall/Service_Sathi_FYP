import express from "express";
import {
  addService,
  allServices,
  loginAdmin,
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
  sendWorkflow,
  markWorkflowAsRead,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/ServiceController.js";
import { changeProviderAvailability } from "../controllers/serviceProviderController.js";
import { createSubscription, getUserSubscription } from "../controllers/subscriptionController.js";
import { deleteTestimonial, getAllTestimonials, getApprovedTestimonials, toggleApproval } from "../controllers/testimonialController.js";

const adminRouter = express.Router();

adminRouter.post("/add-service", authAdmin, upload.single("image"), addService);
adminRouter.post(
  "/add-serviceprovider",
  authAdmin,
  upload.single("image"),
  addServiceProvider
);
adminRouter.put(
  "/update-serviceprovider/:id",
  authAdmin,
  upload.single("image"),
  updateServiceProvider
);
adminRouter.delete(
  "/delete-serviceprovider/:id",
  authAdmin,
  upload.single("image"),
  deleteServiceProvider
);
adminRouter.get("/get-serviceprovider/:id", authAdmin, getServiceProviderById);
adminRouter.get("/get-service/:serviceId", authAdmin, getServiceById);
adminRouter.put(
  "/update-service/:serviceId",
  authAdmin,
  upload.single("image"),
  updateService
);
adminRouter.delete(
  "/delete-service/:serviceId",
  authAdmin,
  upload.single("image"),
  deleteService
);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-services", authAdmin, allServices);
adminRouter.post("/all-serviceProviders", authAdmin, allServiceProviders);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/change-provider-availability", authAdmin, changeProviderAvailability);
adminRouter.get("/bookings", authAdmin, bookingsAdmin);
adminRouter.post("/cancel-booking", authAdmin, bookingCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.put("/update-status", authAdmin,updateStatus);
adminRouter.post("/create-subscription",authAdmin, createSubscription);
adminRouter.get("/get-subscription/:userId",authAdmin, getUserSubscription); 
adminRouter.get("/get-subscriptions",getSubscriptions); 
adminRouter.get("/contact", getcontact);
adminRouter.post("/contact", postContact);
adminRouter.get("/all-testimonials", authAdmin, getAllTestimonials);
adminRouter.delete("/delete-testimonial/:testimonialId", authAdmin, deleteTestimonial);
adminRouter.patch("/toggle-approval/:testimonialId", authAdmin, toggleApproval);
adminRouter.get("/approved-testimonial", getApprovedTestimonials);
adminRouter.post("/send-workflow", authAdmin, sendWorkflow);
adminRouter.put(
  "/:bookingId/mark-workflow-read",
  authAdmin,
  markWorkflowAsRead
);

export default adminRouter;
