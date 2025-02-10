import express from 'express'
import { getServiceProviderByService, serviceList } from '../controllers/ServiceController.js'

const serviceRouter = express.Router()

serviceRouter.get('/list', serviceList)

serviceRouter.get("/service-provider/:serviceId", getServiceProviderByService);

export default serviceRouter