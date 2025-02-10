import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";

const ServicesList = () => {
  const { services, aToken, getAllServices, changeAvailability, backendUrl } =
    useContext(AdminContext);

  const [serviceProviders, setServiceProviders] = useState({});

  useEffect(() => {
    if (aToken) {
      getAllServices();
      fetchServiceProviders();
    }
  }, [aToken]);

  // Fetch service providers for each service
  const fetchServiceProviders = async () => {
    const providers = {};
    for (const service of services) {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/service/service-provider/${service._id}`
        );
        if (data) {
          providers[service._id] = data.name; // Store provider name
        }
      } catch (error) {
        console.error(`Error fetching provider for ${service.name}:`, error);
      }
    }
    setServiceProviders(providers);
  };

  return (
    <div className="m-5 ml-16 max-h-[90vh] overflow-y-auto scrollbar-none">
      <h1 className="text-lg font-medium">All Services</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {services.map((item, index) => {
          return (
            <div
              className="border border-indigo-200 rounded-xl w-56 min-h-[20rem] overflow-hidden cursor-pointer flex flex-col shadow-md hover:shadow-lg transition"
              key={index}
            >
              {/* Image */}
              <img
                src={item.image}
                alt=""
                className="w-full h-40 object-cover"
              />

              {/* Card Content */}
              <div className="p-3 flex flex-col flex-grow">
                {/* Service Name with fixed height & ellipsis */}
                <p className="font-semibold text-gray-800 line-clamp-2 h-[3rem]">
                  {item.name}
                </p>

                <p className="text-sm text-gray-600">{item.category}</p>

                {/* Service Provider Name */}
                <p className="text-sm font-medium text-indigo-600 mt-2">
                  Provider: {serviceProviders[item._id] || "Loading..."}
                </p>

                {/* Availability - Sticks to Bottom */}
                <div className="flex items-center gap-2 mt-3">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <p className="text-sm">Available</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesList;
