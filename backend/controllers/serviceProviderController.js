import serviceProviderModel from "../models/serviceProviderModel.js";

const changeProviderAvailability = async (req, res) => {
  try {
    const { serviceProviderId } = req.body;
    const serviceProviderData = await serviceProviderModel.findById(serviceProviderId);
    await serviceProviderModel.findByIdAndUpdate(serviceProviderId, {
      available: !serviceProviderData.available,
    });
    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {changeProviderAvailability}
