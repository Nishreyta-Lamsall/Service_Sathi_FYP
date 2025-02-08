import serviceModel from "../models/serviceModel.js";

const changeAvailability = async (req,res) => {
    try {
        const {serviceId} = req.body
        const serviceData = await serviceModel.findById(serviceId)
        await serviceModel.findByIdAndUpdate(serviceId, {available: !serviceData.available})
        res.json({success:true, message:'Availability Changed'})
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }

}

const serviceList = async (req,res) => {
    try{
        const Services = await serviceModel.find({})

        res.json({success:true,Services})
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
}
}
export {changeAvailability, serviceList}