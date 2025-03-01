import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyBookings = () => {
  const { backendUrl, token, getServicesData, currencySymbol } =
    useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [serviceProviders, setServiceProviders] = useState({});
  const [reviewSubmitted, setReviewSubmitted] = useState({});
  const [khaltiCheckout, setKhaltiCheckout] = useState(null);

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
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 1,
    comment: "",
    serviceProviderId: "",
  });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitReview = async () => {
    // Prevent submitting if a review already exists for this bookingId
    if (reviewSubmitted[reviewData.bookingId]) {
      toast.error("You have already submitted a review for this booking.");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/addreview/${reviewData.serviceProviderId}`,
        {
          rating: reviewData.rating,
          comment: reviewData.comment,
          bookingId: reviewData.bookingId,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setReviewModalOpen(false);
        setReviewSubmitted((prev) => ({
          ...prev,
          [reviewData.bookingId]: true,
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error submitting review");
      console.error(error);
    }
  };

  const fetchServiceProvider = async (serviceId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/service/service-provider/${serviceId}`
      );
      if (data) {
        setServiceProviders((prevProviders) => ({
          ...prevProviders,
          [serviceId]: { id: data._id, name: data.name },
        }));
      }
    } catch (error) {
      console.error("Error fetching provider:", error);
    }
  };

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("/");
    return `${dateArray[0]} ${months[Number(dateArray[1])]} ${dateArray[2]}`;
  };

  const getDiscountedPrice = (originalPrice, subscriptionPlan) => {
    let discount = 0;
    if (originalPrice <= 2000) {
      if (subscriptionPlan === "6-month") {
        discount = 0.05;
      } else if (subscriptionPlan === "12-month") {
        discount = 0.1;
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

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.17.0.0.0/khalti-checkout.iffe.js";
    script.onload = () => {
      const checkout = new window.KhaltiCheckout({
        publicKey: import.meta.env.VITE_KHALTI_PUBLIC_KEY,
        productIdentity: "your-product-identity",
        productName: "Service Booking",
        productUrl: window.location.href,
        eventHandler: {
          onSuccess(payload) {
            handleKhaltiSuccess(payload);
          },
          onError(error) {
            console.error("Khalti Payment Error:", error);
            toast.error("Payment failed. Please try again.");
          },
          onClose() {
            console.log("Khalti widget closed");
          },
        },
      });
      setKhaltiCheckout(checkout);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleKhaltiSuccess = async (payload) => {
    try {
      const bookingId = payload.purchaseOrderId; // Retrieve from Khalti

      const { data } = await axios.post(
        `${backendUrl}/api/payment/verify-khalti`,
        {
          token: payload.token,
          amount: payload.amount / 100,
          bookingId: payload.purchaseOrderId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Payment successful!");
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking._id === bookingId ? { ...booking, payment: true } : booking
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const handlePayOnline = (bookingId, originalAmount, discountedPrice) => {
    if (!khaltiCheckout) {
      toast.error("Payment gateway is not ready. Please try again later.");
      return;
    }

    const finalAmount = discountedPrice ? discountedPrice : originalAmount;
    khaltiCheckout.show({
      amount: finalAmount * 100,
      purchaseOrderId: bookingId,
    });
  };

  useEffect(() => {
    if (token) {
      getUserBookings();
      getServicesData();
    }
  }, [token]);

  useEffect(() => {
    bookings.forEach((booking) => {
      if (booking.serviceData && !serviceProviders[booking.serviceData._id]) {
        fetchServiceProvider(booking.serviceData._id);
      }
    });
  }, [bookings, serviceProviders]);

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1 mx-16">
        <p className="pb-4 mt-10 text-2xl font-semibold text-black border-b">
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
                const user = item.userData;
                const discountedPrice =
                  user && user.isSubscribed
                    ? getDiscountedPrice(item.amount, user.subscriptionPlan)
                    : null;

                const serviceProvider = serviceProviders[item.serviceData._id];

                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center bg-white shadow-lg rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-36 h-36 object-cover rounded-lg"
                        src={item.serviceData.image}
                        alt="Service"
                      />
                    </div>

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

                      <p className="mt-2 text-sm">
                        <span className="font-medium text-gray-800">
                          Service Provider:{" "}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {serviceProvider
                            ? serviceProvider.name
                            : "Loading..."}
                        </span>
                      </p>

                      <p className="mt-1 text-sm">
                        <span className="font-medium text-gray-800">
                          Amount:{" "}
                        </span>
                        {currencySymbol}
                        {item.amount}
                        {discountedPrice && item.amount <= 2000 && (
                          <div className="mt-1 text-sm text-gray-500">
                            <span className="line-through text-blue-800">
                              {currencySymbol}
                              {item.amount}
                            </span>
                            <span className="ml-2 font-medium text-gray-600">
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

                    <div className="flex flex-col gap-2 sm:items-end sm:ml-auto mt-4 sm:mt-0">
                      <button
                        onClick={() =>
                          handlePayOnline(
                            item._id,
                            item.amount,
                            discountedPrice
                          )
                        }
                        className="text-sm font-medium text-gray-700 border border-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
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

        {bookings.filter((item) => item.orderStatus === "Completed").length >
          0 && (
          <div className="mt-12">
            <p className="pb-4 text-2xl font-semibold text-black border-b">
              Completed Bookings
            </p>
            <div className="mt-6 space-y-4">
              {bookings
                .filter(
                  (item) =>
                    item.orderStatus === "Completed" &&
                    !reviewSubmitted[item._id]
                )
                .map((item, index) => {
                  const serviceProvider =
                    serviceProviders[item.serviceData._id];

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-center bg-gray-100 shadow-lg rounded-lg p-4 border border-gray-300"
                    >
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
                          <span className="font-semibold text-blue-600">
                            Completed
                          </span>
                        </p>

                        <p className="mt-2 text-sm">
                          <span className="font-medium text-gray-800">
                            Service Provider:{" "}
                          </span>
                          <span className="font-semibold text-gray-800">
                            {serviceProvider
                              ? serviceProvider.name
                              : "Loading..."}
                          </span>
                        </p>
                      </div>

                      <div className="ml-auto mt-4 sm:mt-0">
                        <button
                          onClick={() => {
                            setReviewData({
                              ...reviewData,
                              serviceProviderId: serviceProvider.id,
                            });
                            setReviewModalOpen(true);
                          }}
                          className="text-sm font-medium text-gray-700 border border-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
                        >
                          Leave Review
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-1/3">
            <h3 className="text-lg font-semibold text-gray-800">
              Leave a Review
            </h3>
            <div className="mt-4">
              <label htmlFor="rating" className="block text-sm text-gray-600">
                Rating:
              </label>
              <select
                id="rating"
                name="rating"
                value={reviewData.rating}
                onChange={handleReviewChange}
                className="mt-1 w-full p-2 border rounded"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="comment" className="block text-sm text-gray-600">
                Comment:
              </label>
              <textarea
                id="comment"
                name="comment"
                value={reviewData.comment}
                onChange={handleReviewChange}
                className="mt-1 w-full p-2 border rounded"
              ></textarea>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={submitReview}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900"
              >
                Submit Review
              </button>
              <button
                onClick={() => setReviewModalOpen(false)}
                className="ml-4 px-4 py-2 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
