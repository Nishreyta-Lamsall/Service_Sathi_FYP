import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { assets } from "../assets/assets";
import RelatedServices from "../components/RelatedServices";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Bookings = () => {
  const { serviceId } = useParams();
  const {
    Services,
    currencySymbol,
    backendUrl,
    token,
    getServicesData,
    userData,
  } = useContext(AppContext);
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language === "Nepali" ? "np" : "en";

  const [serviceProvider, setServiceProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [serviceInfo, setServiceInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // User-selected date
  const [availableTimes, setAvailableTimes] = useState([]); // Available time slots for selected date
  const [slotTime, setSlotTime] = useState(""); // Selected time slot

  const navigate = useNavigate();

  const fetchServiceInfo = async () => {
    const serviceInfo = Services.find((service) => service._id === serviceId);
    setServiceInfo(serviceInfo);
  };

  const fetchServiceProvider = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/service/service-provider/${serviceId}`
      );
      if (data) {
        setServiceProvider({ id: data._id, name: data.name });
      }
    } catch (error) {
      setServiceProvider({ id: "N/A", name: "Not Available" });
    }
  };

  const fetchReviews = async () => {
    if (!serviceProvider?.id) return;
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/user/getreviews/${serviceProvider.id}`
      );
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Generate available time slots for the selected date with 30-minute intervals
  const getAvailableSlots = () => {
    if (!serviceInfo || !selectedDate) {
      setAvailableTimes([]);
      return;
    }

    const date = new Date(selectedDate);
    const today = new Date(); // Current date and time
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const startHour = 9; // 9 AM
    const endHour = 16; // 4 PM
    const intervalMinutes = 30; // 30-minute intervals
    let timeSlots = [];

    // Loop through the time range with 30-minute increments
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += intervalMinutes) {
        // Stop at 4 PM (16:00)
        if (hour === endHour && minutes > 0) break;

        const slotDate = new Date(date);
        slotDate.setHours(hour, minutes, 0, 0);

        // If today, skip slots before the current time
        if (isToday && slotDate <= today) continue;

        const formattedTime = slotDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const day = slotDate.getDate();
        const month = slotDate.getMonth() + 1;
        const year = slotDate.getFullYear();
        const slotDateStr = `${day}/${month}/${year}`;

        const isSlotAvailable =
          serviceInfo.slots_booked[slotDateStr] &&
          serviceInfo.slots_booked[slotDateStr].includes(formattedTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: slotDate,
            time: formattedTime,
          });
        }
      }
    }
    setAvailableTimes(timeSlots);
  };

const bookService = async () => {
  if (!token) {
    toast.warning(t("toastMessage.loginToBook"));
    return navigate("/login");
  }
  if (!selectedDate || !slotTime) {
    toast.warning(t("toastMessage.selectDateAndTime"));
    return;
  }
  if (!serviceInfo.available) {
    toast.error(t("serviceNotAvailable")); // New translation key
    return;
  }
  if (!userData?.phone || !userData?.address) {
    toast.error(t("enterContactDetails")); // New translation key
    return;
  }

  try {
    const date = new Date(selectedDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const slotDate = `${day}/${month}/${year}`;

    const { data } = await axios.post(
      `${backendUrl}/api/user/book-service`,
      { serviceId, slotDate, slotTime },
      { headers: { token } }
    );
    if (data.success) {
      toast.success(t("serviceBookSuccess"));
      getServicesData();
      navigate("/my-bookings");
    } else {
      toast.error(t("serviceBookFailed"));
    }
  } catch (error) {
    toast.error(t("serviceBookError"));
  }
};

  const deleteReview = async (reviewId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/user/delete-review/${reviewId}`,
        {
          headers: { token },
          data: { userId: userData._id },
        }
      );
      if (data.success) {
        toast.success(t("toastMessage.reviewDeleted"));
        setReviews((prev) => prev.filter((review) => review._id !== reviewId));
      } else {
        toast.error(t("reviewDeleteFailed"));
      }
    } catch (error) {
      toast.error(t("toastMessage.reviewDeleteError"));
    }
  };

  useEffect(() => {
    fetchServiceInfo();
  }, [Services, serviceId]);

  useEffect(() => {
    getAvailableSlots();
  }, [serviceInfo, selectedDate]);

  useEffect(() => {
    fetchServiceProvider();
  }, [serviceId]);

  useEffect(() => {
    if (serviceProvider?.id) fetchReviews();
  }, [serviceProvider]);

  return (
    serviceInfo && (
      <div className="mr-16 mt-12 mb-16">
        <div className="flex flex-col sm:flex-row gap-4 ml-16">
          <div>
            <img
              className="w-96 h-72 object-cover rounded-lg"
              src={serviceInfo.image}
              alt={serviceInfo.name[currentLang]}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {serviceInfo.name[currentLang]}
            </p>
            <div>
              <p className="text-sm mt-1">
                {serviceInfo.category[currentLang]}
              </p>
              {serviceProvider ? (
                <p className="text-sm font-medium text-blue-900 mt-2">
                  {t("footer.provider")} {serviceProvider.name}
                </p>
              ) : (
                <p>Loading provider...</p>
              )}
            </div>
            <div>
              <p className="flex items-center gap-1 font-medium text-gray-900 mt-3">
                {t("toastMessage.aboutService")}{" "}
                <img className="w-[1.2vw] ml-1" src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[800px] mt-1">
                {serviceInfo.about[currentLang]}
              </p>
            </div>
            <p className="font-medium mt-4">
              {t("toastMessage.fee")}{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {serviceInfo.price.en}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-[28rem] sm:pl-4 mt-9 font-medium text-gray-700">
          <p>{t("toastMessage.bookingSlots")}</p>
          <div className="mt-4">
            <label htmlFor="date-picker" className="mr-2">
              {t("toastMessage.selectDate")}:
            </label>
            <input
              type="date"
              id="date-picker"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // Restrict to today or future
              className="border border-gray-300 rounded p-2"
            />
          </div>

          {selectedDate && (
            <div className="flex items-center gap-3 mt-4 overflow-x-scroll scrollbar-hidden">
              {availableTimes.length > 0 ? (
                availableTimes.map((item, index) => (
                  <p
                    key={index}
                    onClick={() => setSlotTime(item.time)}
                    className={`text-sm font-light flex-shrink-0 py-2 rounded-full cursor-pointer px-7 ${
                      item.time === slotTime
                        ? "bg-[#313131] text-white"
                        : "text-gray-400 border border-gray-100"
                    }`}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))
              ) : (
                <p className="text-gray-500">
                  {t("toastMessage.noSlotsAvailable")}
                </p>
              )}
            </div>
          )}

          <button
            onClick={bookService}
            className="bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 pr-6 rounded-xl hover:scale-105 transition-all duration-300 py-3 px-16 my-6 mt-8"
          >
            {t("toastMessage.bookAService")}
          </button>
        </div>

        <div className="reviews-section mt-8 mx-4 sm:mx-8 md:mx-12 lg:mx-16">
          <h3 className="text-xl font-semibold text-gray-900">
            {t("toastMessage.reviewsFor")}{" "}
            {serviceProvider?.name || "Loading..."}
          </h3>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-5 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">
                      {review.user?.name || "Anonymous"}
                    </p>
                    <div className="flex items-center">
                      <span className="text-yellow-500">
                        {"★".repeat(review.rating)}
                      </span>
                      <span className="text-gray-500 ml-2">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                  {userData && userData._id === review.user?._id && (
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="text-red-500 mt-2"
                    >
                      {t("toastMessage.delete")}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">
              {t("toastMessage.noReviewsYet")}
            </p>
          )}
        </div>

        <RelatedServices
          serviceId={serviceId}
          category={serviceInfo.category[currentLang]}
        />
      </div>
    )
  );
};

export default Bookings;
