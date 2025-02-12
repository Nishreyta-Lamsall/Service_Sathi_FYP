import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios'
import {toast} from 'react-toastify'

const MyBookings = () => {
  const { backendUrl, token, getServicesData, currencySymbol } =
    useContext(AppContext);

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

  // Get user's subscription discount based on subscription plan
  const getDiscountedPrice = (originalPrice, subscriptionPlan) => {
    let discount = 0;
    if (originalPrice <= 2000) {
      if (subscriptionPlan === "6-month") {
        discount = 0.05; // 5% off for 6-month plan
      } else if (subscriptionPlan === "12-month") {
        discount = 0.1; // 10% off for 12-month plan
      }
    }
    return originalPrice - originalPrice * discount;
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

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-booking",
        { bookingId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handlePayment = async (bookingId, totalPrice) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/payment/initialize-esewa`,
        {
          bookingId,
          totalPrice,
        },
        {
          headers: { token },
        }
      );

      if (data.success) {
        // Handle redirection to payment gateway or success message
        console.log("Payment initialized successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error initializing payment.");
      console.log(error);
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
          My Bookings
        </p>

        {bookings.filter(
          (item) => !item.cancelled && item.orderStatus !== "Completed"
        ).length > 0 ? (
          <div className="mt-6 space-y-4">
            {bookings
              .filter(
                (item) => !item.cancelled && item.orderStatus !== "Completed"
              )
              .map((item, index) => {
                // Assuming subscription data is available for the current user
                const user = item.userData; // If the booking has the user data
                const discountedPrice =
                  user && user.isSubscribed
                    ? getDiscountedPrice(item.amount, user.subscriptionPlan)
                    : null;

                return (
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
                      <p className="text-gray-500">
                        {item.serviceData.category}
                      </p>
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
                          Amount:{" "}
                        </span>
                        {currencySymbol}
                        {item.amount}

                        {/* Show discounted price for subscribed users */}
                        {discountedPrice && item.amount <= 2000 && (
                          <div className="mt-1 text-sm text-gray-500">
                            <span className="line-through text-red-500">
                              {currencySymbol}
                              {item.amount}
                            </span>
                            <span className="ml-2 font-medium text-green-600">
                              {currencySymbol}
                              {discountedPrice.toFixed(2)}
                            </span>
                          </div>
                        )}
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
                      <button
                        onClick={() => handlePayment(item._id, item.amount)}
                        className="text-sm font-medium text-blue-600 border border-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                      <button
                        onClick={() => cancelBooking(item._id)}
                        className="text-sm font-medium text-red-600 border border-red-600 px-4 py-1.5 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No bookings available.
          </p>
        )}
      </div>
    </div>
  );
}

export default MyBookings