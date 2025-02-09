import express from 'express'
import { addService, allServices, loginAdmin, bookingsAdmin, bookingCancel, adminDashboard} from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailability } from '../controllers/ServiceController.js'

const adminRouter = express.Router()

adminRouter.post('/add-service',authAdmin,upload.single('image'), addService)
adminRouter.post('/login', loginAdmin);
adminRouter.post("/all-services",authAdmin, allServices);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/bookings", authAdmin,bookingsAdmin)
adminRouter.post("/cancel-booking", authAdmin, bookingCancel);
adminRouter.get("/dashboard", authAdmin, adminDashboard);


export default adminRouter