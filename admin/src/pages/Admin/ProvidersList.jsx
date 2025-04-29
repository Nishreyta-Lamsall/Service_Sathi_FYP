import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";

const ProvidersList = () => {
  const {
    serviceProviders,
    aToken,
    getAllServiceProviders,
    changeProviderAvailability,
    backendUrl,
  } = useContext(AdminContext);

  const navigate = useNavigate();

  const [expandedServices, setExpandedServices] = useState({});
  const [expandedDetails, setExpandedDetails] = useState({});
  const [deleting, setDeleting] = useState(null); 

  useEffect(() => {
    if (aToken) {
      getAllServiceProviders();
    }
  }, [aToken]);


  const toggleServices = (index) => {
    setExpandedServices((prev) => ({ ...prev, [index]: !prev[index] }));
  };


  const toggleDetails = (index) => {
    setExpandedDetails((prev) => ({ ...prev, [index]: !prev[index] }));
  };


  const handleDelete = async (Id) => {
    if (
      !window.confirm("Are you sure you want to delete this service provider?")
    ) {
      return;
    }

    setDeleting(Id); 

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-serviceprovider/${Id}`,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success("Service provider deleted successfully!");
        getAllServiceProviders(); 
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to delete service provider. Please try again.");
    } finally {
      setDeleting(null); 
    }
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
                  <span className="text-black">Phone number:</span>{" "}
                  {item.phone_number}
                </p>

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

                <div className="mt-2">
                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-blue-600 text-sm font-medium block w-full text-left"
                  >
                    {expandedDetails[index] ? "Hide Details" : "Show Details"}
                  </button>
                </div>

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
                  <input
                    onChange={() => changeProviderAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
                    className="mr-2"
                  />
                  <p className="text-sm text-gray-800">Available</p>
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/edit-provider/${item._id}`)}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition"
                >
                  Edit
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(item._id)}
                  className={`px-3 py-1 text-xs font-medium text-white ${
                    deleting === item._id
                      ? "bg-gray-500 cursor-not-allowed"
                      : " bg-red-500 hover:bg-red-600 rounded transition"
                  }`}
                  disabled={deleting === item._id}
                >
                  {deleting === item._id ? "Deleting..." : "Delete"}
                </button>
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
