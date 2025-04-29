import serviceModel from "../models/serviceModel.js";
import serviceProviderModel from "../models/serviceProviderModel.js";
import mongoose from "mongoose";

const changeAvailability = async (req,res) => {
    try {
        const {serviceId} = req.body
        const serviceData = await serviceModel.findById(serviceId)
        await serviceModel.findByIdAndUpdate(serviceId, {available: !serviceData.available})
        res.json({success:true, message:'Availability Changed'})
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
}

const serviceList = async (req,res) => {
    try{
        const Services = await serviceModel.find({})

        res.json({success:true,Services})
    } catch (error) {
      res.json({ success: false, message: error.message });
}
}

const getServiceProviderByService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const objectId = new mongoose.Types.ObjectId(serviceId);

    const provider = await serviceProviderModel.findOne({
      "services.serviceId": objectId,
    });

    if (!provider) {
      return res.status(404).json({ message: "Service Provider not found" });
    }

    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export {changeAvailability, serviceList, getServiceProviderByService}