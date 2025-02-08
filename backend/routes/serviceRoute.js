import express from 'express'
import { serviceList } from '../controllers/ServiceController.js'

const serviceRouter = express.Router()

serviceRouter.get('/list', serviceList)

export default serviceRouter