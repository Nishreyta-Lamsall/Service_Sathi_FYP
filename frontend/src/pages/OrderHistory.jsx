import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const OrderHistory = () => {
  const { backendUrl, token, getServicesData } = useContext(AppContext);

  const [bookings, setBookings] = useState([]);
  const months = [
    " ",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("/");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserBookings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/bookings", {
        headers: { token },
      });
      if (data.success) {
        setBookings(data.bookings.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserBookings();
      getServicesData();
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1 mx-16">
        <p className="pb-4 mt-10 text-lg font-semibold text-gray-800 border-b">
          Order History
        </p>

        {bookings.filter(
          (item) => item.cancelled || item.orderStatus === "Completed"
        ).length > 0 ? (
          <div className="mt-6 space-y-4">
            {bookings
              .filter(
                (item) => item.cancelled || item.orderStatus === "Completed"
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                >
                  {/* Image Section */}
                  <div className="flex-shrink-0">
                    <img
                      className="w-28 h-28 object-cover rounded-lg"
                      src={item.serviceData.image}
                      alt="Service"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 sm:ml-6 text-sm text-gray-700">
                    <p className="text-base font-semibold text-gray-900">
                      {item.serviceData.name}
                    </p>
                    <p className="text-gray-500">{item.serviceData.category}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium text-gray-800">
                        Order Status:{" "}
                      </span>
                      <span
                        className={`font-semibold ${
                          item.orderStatus === "Booked"
                            ? "text-green-600"
                            : item.orderStatus === "On the Way"
                            ? "text-yellow-600"
                            : item.orderStatus === "Completed"
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.orderStatus}
                      </span>
                    </p>

                    <p className="mt-1 text-sm">
                      <span className="font-medium text-gray-800">
                        Date and Time:{" "}
                      </span>
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 sm:items-end sm:ml-auto mt-4 sm:mt-0">
                    {item.cancelled ? (
                      <button className="text-sm font-medium text-gray-500 border border-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300">
                        Cancelled
                      </button>
                    ) : (
                      <>
                        {/* Add any actions like "Pay" or others for non-cancelled orders */}
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No orders found in history.
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
