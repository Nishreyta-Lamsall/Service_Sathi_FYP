import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const OrderHistory = () => {
  const { backendUrl, token, getServicesData } = useContext(AppContext);
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "Nepali" ? "np" : "en";

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
      toast.error(t("failedToLoadBookings"));
    }
  };

  const getDisplayValue = (field) => {
    if (typeof field === "string") {
      if (currentLang === "np") {
        const translations = {
          "Leak Repairs": "लिक मर्मत",
          "Plumbing Services": "प्लम्बिंग सेवाहरू",
        };
        return translations[field] || field; 
      }
      return field; 
    }
    return field?.[currentLang] || "Unknown"; 
  };

  useEffect(() => {
    if (token) {
      getUserBookings();
      getServicesData();
    }
  }, [token]);

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1 mr-8 ml-10">
        <p className="pb-4 mt-10 text-2xl font-semibold text-black border-b">
          {t("orderHistory")}
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
                      className="md:w-28 md:h-28 w-40 h-40 object-cover rounded-lg"
                      src={item.serviceData.image}
                      alt="Service"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 sm:ml-6 text-sm text-gray-700">
                    <p className="text-base font-semibold text-gray-900">
                      {getDisplayValue(item.serviceData.name)}
                    </p>
                    <p className="text-gray-500">
                      {getDisplayValue(item.serviceData.category)}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium text-gray-800">
                        {t("myBookingss.orderStatus")}{" "}
                      </span>
                      <span
                        className={`font-semibold ${
                          item.orderStatus === "Booked"
                            ? "text-blue-600"
                            : item.orderStatus === "On the Way"
                            ? "text-yellow-600"
                            : item.orderStatus === "Completed"
                            ? "text-blue-600"
                            : "text-red-700"
                        }`}
                      >
                        {item.orderStatus}
                      </span>
                    </p>

                    <p className="mt-1 text-sm">
                      <span className="font-medium text-gray-800">
                        {t("myBookingss.dateTime")}{" "}
                      </span>
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 sm:items-end sm:ml-auto mt-4 sm:mt-0">
                    {item.cancelled ? (
                      <button className="text-sm font-medium text-gray-500 border border-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-500 hover:text-white transition-all duration-300">
                        {t("myBookingss.cancelled")}
                      </button>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            {t("myBookingss.noOrder")}
          </p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
