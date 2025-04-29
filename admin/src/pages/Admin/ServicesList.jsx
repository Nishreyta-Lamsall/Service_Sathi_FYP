import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2"; 

const ServicesList = () => {
  const { services, aToken, getAllServices, changeAvailability, backendUrl } =
    useContext(AdminContext);
  const [serviceProviders, setServiceProviders] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllServices();
      fetchServiceProviders();
    }
    console.log("Services data:", services); 
  }, [aToken]);

  const fetchServiceProviders = async () => {
    const providers = {};
    for (const service of services) {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/service/service-provider/${service._id}`
        );
        if (data) {
          providers[service._id] = data.name;
        }
      } catch (error) {
        console.error(
          `Error fetching provider for ${service.name?.en || "unknown"}:`,
          error
        );
      }
    }
    setServiceProviders(providers);
  };

  const handleDelete = async (serviceId) => {
    Swal.fire({
      title: "Delete Service",
      text: "Are you sure you want to delete this service? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${backendUrl}/api/admin/delete-service/${serviceId}`, {
            headers: { aToken },
          })
          .then(({ data }) => {
            if (data.success) {
              toast.success("Service deleted successfully!");
              getAllServices();
            } else {
              toast.error(data.message);
            }
          })
          .catch((error) => {
            toast.error("Failed to delete service. Please try again.");
          });
      }
    });
  };

  return (
    <div className="m-5 ml-16 max-h-[90vh] overflow-y-auto scrollbar-none">
      <h1 className="text-lg font-medium">All Services</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {services.map((item, index) => (
          <div
            key={index}
            className="border border-indigo-200 rounded-xl w-56 min-h-[22rem] overflow-hidden shadow-md hover:shadow-lg transition flex flex-col"
          >
            <img
              src={item.image}
              alt="Service"
              className="w-full h-40 object-cover"
            />
            <div className="p-3 flex flex-col flex-grow">
              <p className="font-semibold text-gray-800 line-clamp-2 h-[3rem]">
                {item.name?.en || "Unnamed Service"} 
              </p>
              <p className="text-sm text-gray-600">
                {item.category?.en || "Uncategorized"} 
              </p>
              <p className="text-sm text-gray-600">
                Price: {item.price || "N/A"}
              </p>
              <p className="text-sm font-medium text-indigo-600 mt-2">
                Provider: {serviceProviders[item._id] || "Loading..."}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={item.available ?? true} 
                  onChange={() => changeAvailability(item._id)}
                  className="w-4 h-4 accent-blue-600"
                />
                <p className="text-sm">Available</p>
              </div>
              <div className="flex mt-3 gap-3">
                <button
                  onClick={() => navigate(`/edit-service/${item._id}`)}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesList;
