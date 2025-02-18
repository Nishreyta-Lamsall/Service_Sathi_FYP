import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { assets } from "../assets/assets";
import RelatedServices from "../components/RelatedServices";
import { toast } from "react-toastify";
import axios from "axios";

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
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [serviceProvider, setServiceProvider] = useState(null);
  const [reviews, setReviews] = useState([]);

  const navigate = useNavigate();

  const [serviceInfo, setServiceInfo] = useState(null);
  const [serviceSlots, setServiceSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchserviceInfo = async () => {
    const serviceInfo = Services.find((service) => service._id === serviceId);
    setServiceInfo(serviceInfo);
  };

  const fetchServiceProvider = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/service/service-provider/${serviceId}`
      );

      console.log("Full API Response:", data); // Log entire response

      if (data) {
        setServiceProvider({ id: data._id, name: data.name });
      }
    } catch (error) {
      console.error("Error fetching provider:", error);
      setServiceProvider({ id: "N/A", name: "Not Available" });
    }
  };

  const fetchReviews = async () => {
    try {
      if (!serviceProvider?.id) {
        console.log("No service provider ID, skipping reviews fetch");
        return; // Ensure we have the ID
      }

      const { data } = await axios.get(
        `${backendUrl}/api/user/getreviews/${serviceProvider.id}`
      );

      console.log("Reviews:", data);
      setReviews(data); // Store the reviews in state
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchServiceProvider();
  }, [serviceId]);

  const getAvailableSlots = async () => {
    if (!serviceInfo) {
      console.log("Service info is not loaded yet.");
      return;
    }
    setServiceSlots([]);

    let today = new Date();

    const startHour = 9;
    const startMinute = 0;
    const interval = 3;

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(16, 0, 0, 0);

      let timeSlots = [];

      if (i === 0 && today.getHours() >= 16) {
        continue;
      }

      for (let hour = startHour; hour <= 16; hour += interval) {
        let slotDate = new Date(currentDate);
        slotDate.setHours(hour, startMinute, 0, 0);

        // Skip past slots for today
        if (i === 0 && slotDate < today) {
          continue;
        }

        let formattedTime = slotDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = slotDate.getDate();
        let month = slotDate.getMonth() + 1;
        let year = slotDate.getFullYear();

        const slotDateStr = `${day}/${month}/${year}`;
        const slotTime = formattedTime;

        const isSlotAvailable =
          serviceInfo.slots_booked[slotDateStr] &&
          serviceInfo.slots_booked[slotDateStr].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: slotDate,
            time: formattedTime,
          });
        }
      }

      setServiceSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookService = async () => {
    if (!token) {
      toast.warning("Login to book a service");
      return navigate("/login");
    }

    try {
      const date = serviceSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "/" + month + "/" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-service",
        { serviceId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getServicesData();
        navigate("/my-bookings");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
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
        toast.success("Review deleted successfully");
        setReviews((prevReviews) =>
          prevReviews.filter((review) => review._id !== reviewId)
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Delete Review Error:", error);
      toast.error("Error deleting review");
    }
  };

  useEffect(() => {
    fetchserviceInfo();
  }, [Services, serviceId]);

  useEffect(() => {
    getAvailableSlots();
  }, [serviceInfo]);

  useEffect(() => {
    console.log(serviceSlots);
  }, [serviceSlots]);

  useEffect(() => {
    if (serviceProvider?.id) {
      fetchReviews();
    }
  }, [serviceProvider]);

  return (
    serviceInfo && (
      <div className="ml-16 mr-16 mt-12 mb-16">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="w-96 h-72 object-cover rounded-lg"
              src={serviceInfo.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {serviceInfo.name}
            </p>
            <div>
              <p className="text-sm mt-1">{serviceInfo.category}</p>
              {serviceProvider ? (
                <p className="text-sm font-medium text-indigo-600 mt-2">
                  Provider: {serviceProvider.name}
                </p>
              ) : (
                <p>Loading provider...</p> // Or a loading spinner
              )}
            </div>
            <div>
              <p className="flex items-center gap-1 font-medium text-gray-900 mt-3">
                About{" "}
                <img className="w-[1.2vw] ml-1" src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[800px] mt-1">
                {serviceInfo.about}
              </p>
            </div>
            <p className="font-medium mt-4">
              Service fee:{" "}
              <span className="text-gray-600">
                {currencySymbol}
                {serviceInfo.price}
              </span>
            </p>
          </div>
        </div>
        {/* Booking Slots */}
        <div className="sm:ml-96 sm:pl-4 mt-9 font-medium text-gray-700">
          <p> Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 scrollbar-hidden">
            {serviceSlots.length &&
              serviceSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-[#2D64C5] text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]} </p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-10 w-full overflow-x-scroll mt-8 scrollbar-hidden">
            {serviceSlots.length &&
              serviceSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 py-2 rounded-full cursor-pointer px-7 ${
                    item.time === slotTime
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 border border-gray-100"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>
          <button
            onClick={bookService}
            className="bg-blue-900 text-white text-base font-light py-3 px-16 rounded-full my-6 mt-8"
          >
            Book a service
          </button>
        </div>
        <div className="reviews-section mt-8 ml-[6.5rem]">
          <h3 className="text-xl font-semibold text-gray-900">
            Reviews for {serviceProvider?.name || "Loading..."}
          </h3>
          {/* Display Service Provider Name */}
          {reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
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

                  {/* Check if user is logged in and if they are the reviewer */}
                  {userData && userData._id === review.user?._id && (
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="text-red-500 mt-2"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-4">No reviews yet.</p>
          )}
        </div>

        {/* Related Services */}
        <RelatedServices
          serviceId={serviceId}
          category={serviceInfo.category}
        />
      </div>
    )
  );
};

export default Bookings;
