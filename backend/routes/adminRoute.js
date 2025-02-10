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
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/ServiceController.js";
import { changeProviderAvailability } from "../controllers/serviceProviderController.js";

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
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-services", authAdmin, allServices);
adminRouter.post("/all-serviceProviders", authAdmin, allServiceProviders);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.post("/change-provider-availability", authAdmin, changeProviderAvailability);
adminRouter.get("/bookings", authAdmin, bookingsAdmin);
adminRouter.post("/cancel-booking", authAdmin, bookingCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter;
