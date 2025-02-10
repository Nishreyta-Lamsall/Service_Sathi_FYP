import React, { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";

const ServicesList = () => {
  const { services, aToken, getAllServices, changeAvailability } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllServices();
    }
  }, [aToken]);

  return (
    <div className="m-5 ml-16 max-h-[90vh] overflow-y-auto scrollbar-none">
      <h1 className="text-lg font-medium">All Services</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {services.map((item, index) => {
          return (
            <div
              className="border border-indigo-200 rounded-xl w-56 h-72 overflow-hidden cursor-pointer flex flex-col"
              key={index}
            >
              {/* Image */}
              <img
                src={item.image}
                alt=""
                className="w-full h-40 object-cover"
              />

              {/* Card Content */}
              <div className="p-3 flex flex-col justify-between flex-grow">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">{item.category}</p>

                {/* Availability */}
                <div className="flex items-center gap-2 mt-auto">
                  <input
                    onChange={() => changeAvailability(item._id)}
                    type="checkbox"
                    checked={item.available}
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
