import express from 'express'
import { addService, loginAdmin } from '../controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'

const adminRouter = express.Router()

adminRouter.post('/add-service',authAdmin,upload.single('image'), addService)
adminRouter.post('/login', loginAdmin);

export default adminRouter