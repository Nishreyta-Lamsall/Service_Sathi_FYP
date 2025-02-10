import React from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";

const Dashboard = () => {
  const { aToken, getDashData, cancelBooking, dashData } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  // Function to handle cancel booking and force a re-fetch
  const handleCancelBooking = (bookingId) => {
    cancelBooking(bookingId).then(() => {
      getDashData();
    });
  };

  return (
    dashData && (
      <div>
        <div className="flex flex-wrap gap-8 border-3 border-gray-300 p-6 rounded-lg">
          {/* Service Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out rounded-lg flex-1 min-w-[200px]">
            <img
              src={assets.service_icon}
              alt="Service"
              className="w-12 h-12"
            />
            <div>
              <p className="text-4xl font-medium text-red-600">
                {dashData.services}
              </p>
              <hr className="w-14 my-2 border-t-2 border-gray-300" />
              <p className="text-sm font-semibold text-black">Services</p>
            </div>
          </div>

          {/* Booking Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out rounded-lg flex-1 min-w-[200px]">
            <img
              src={assets.booking_icon}
              alt="Booking"
              className="w-12 h-12"
            />
            <div>
              <p className="text-4xl font-medium text-red-600">
                {dashData.bookings}
              </p>
              <hr className="w-14 my-2 border-t-2 border-gray-300" />
              <p className="text-sm font-semibold text-black">Bookings</p>
            </div>
          </div>

          {/* User Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-100 hover:bg-gray-200 hover:scale-105 transition-all duration-300 ease-in-out rounded-lg flex-1 min-w-[200px]">
            <img src={assets.user_icon} alt="User" className="w-12 h-12" />
            <div>
              <p className="text-4xl font-medium text-red-600">
                {dashData.users}
              </p>
              <hr className="w-14 my-2 border-t-2 border-gray-300" />
              <p className="text-sm font-semibold text-black">Users</p>
            </div>
          </div>

          {/* Provider Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-100 hover:bg-gray-200 duration-300 ease-in-out hover:scale-105 transition-all rounded-lg flex-1 min-w-[200px]">
            <img
              src={assets.provider_icon}
              alt="Provider"
              className="w-12 h-12"
            />
            <div>
              <p className="text-4xl font-medium text-red-600">
                {dashData.serviceProviders}
              </p>
              <hr className="w-14 my-2 border-t-2 border-gray-300" />
              <p className="text-sm font-semibold text-black">Providers</p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-3.5 px-4 py-4 mt-10 rounded-t border">
            <p>Recent Bookings</p>
          </div>
          <div>
            {dashData.latestBookings.map((item, index) => {
              return (
                <div
                  className="flex items-center px-6 py-3 gap-3 hover:bg-gray-200 border overflow-y-auto overflow-x-auto scrollbar-none"
                  key={index}
                >
                  <img
                    className="rounded-full w-10"
                    src={item.serviceData.image}
                    alt=""
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-gray-500 font-medium">
                      {item.serviceData.name}
                    </p>
                    <p className="text-gray-500">{item.slotDate}</p>
                  </div>
                  <div>
                    {item.cancelled ? (
                      <p className="text-red-400 text-sm font-medium mt-3">
                        Cancelled
                      </p>
                    ) : (
                      <div className="py-3 px-2 flex justify-center">
                        <img
                          onClick={() => handleCancelBooking(item._id)}
                          className="w-5 cursor-pointer"
                          src={assets.cancel_icon}
                          alt="Cancel"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
