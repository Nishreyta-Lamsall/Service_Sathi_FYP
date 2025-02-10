import serviceProviderModel from "../models/serviceProviderModel.js";
import serviceModel from "../models/serviceModel.js"; // Import the service model

const changeProviderAvailability = async (req, res) => {
  try {
    const { serviceProviderId } = req.body;

    // Find the service provider
    const serviceProviderData = await serviceProviderModel.findById(
      serviceProviderId
    );
    if (!serviceProviderData) {
      return res
        .status(404)
        .json({ success: false, message: "Service Provider not found" });
    }

    // Toggle provider's availability
    const newAvailability = !serviceProviderData.available;
    await serviceProviderModel.findByIdAndUpdate(serviceProviderId, {
      available: newAvailability,
    });

    // Update all linked services to match provider's availability
    await serviceModel.updateMany(
      {
        _id: {
          $in: serviceProviderData.services.map((service) => service.serviceId),
        },
      },
      { available: newAvailability }
    );

    res.json({
      success: true,
      message: "Availability Changed for Provider and Services",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { changeProviderAvailability };
