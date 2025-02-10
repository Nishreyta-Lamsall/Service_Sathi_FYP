import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";

const ProvidersList = () => {
  const { serviceProviders, aToken, getAllServiceProviders, changeProviderAvailability } =
    useContext(AdminContext);

  // State to track visibility of services & details
  const [expandedServices, setExpandedServices] = useState({});
  const [expandedDetails, setExpandedDetails] = useState({});

  useEffect(() => {
    if (aToken) {
      getAllServiceProviders();
    }
  }, [aToken]);

  // Toggle function for services
  const toggleServices = (index) => {
    setExpandedServices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Toggle function for details
  const toggleDetails = (index) => {
    setExpandedDetails((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="m-5 ml-16 max-h-[90vh] overflow-y-auto scrollbar-none">
      <h1 className="text-lg font-semibold text-gray-800">
        All Service Providers
      </h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {serviceProviders.length > 0 ? (
          serviceProviders.map((item, index) => (
            <div
              className="p-5 border border-indigo-300 rounded-xl w-56 overflow-hidden cursor-pointer flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
              key={index}
            >
              <div className="rounded-xl w-56 pr-14 overflow-hidden cursor-pointer flex justify-center items-center">
                <img
                  src={item.image}
                  alt=""
                  className="w-full h-32 object-contain"
                />
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-gray-900 text-lg font-semibold">
                  {item.name}
                </p>
                <p className="text-indigo-600 text-sm font-medium">
                  {item.category}
                </p>
                <p className="text-gray-500 text-sm">
                  <span className="text-black">Phone number:</span>
                  {item.phone_number}
                </p>

                {/* Toggle Services Button */}
                <div className="mt-2">
                  <button
                    onClick={() => toggleServices(index)}
                    className="text-blue-600 text-sm font-medium block w-full text-left"
                  >
                    {expandedServices[index]
                      ? "Hide Services"
                      : "Show Services"}
                  </button>
                </div>

                {/* Services List (Hidden by Default) */}
                {expandedServices[index] && (
                  <ul className="mt-2 space-y-1 text-gray-700 text-sm bg-gray-100 p-2 rounded-md">
                    {item.services.length > 0 ? (
                      item.services.map((service, i) => (
                        <li key={i} className="flex items-center gap-2">
                          🔹 {service.serviceName}
                        </li>
                      ))
                    ) : (
                      <li>No services listed</li>
                    )}
                  </ul>
                )}

                {/* Toggle Details Button */}
                <div className="mt-2">
                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-blue-600 text-sm font-medium block w-full text-left"
                  >
                    {expandedDetails[index] ? "Hide Details" : "Show Details"}
                  </button>
                </div>

                {/* Additional Details (Hidden by Default) */}
                {expandedDetails[index] && (
                  <div className="mt-2 space-y-1 text-gray-700 text-sm bg-gray-100 p-2 rounded-md">
                    <p>Email: {item.email}</p>
                    <p>Citizenship No: {item.citizenship_number}</p>
                    <p>Experience: {item.experience}</p>
                    <p>
                      Address: {item.address.line1}
                      {item.address.line2 && `, ${item.address.line2}`}
                    </p>
                  </div>
                )}

                {/* Availability */}
                <div className="flex items-center mt-2">
                  <input onChange={()=> changeProviderAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="mr-2"
                  />
                  <p className="text-sm text-gray-800">Available</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center w-full">
            No service providers found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProvidersList;
