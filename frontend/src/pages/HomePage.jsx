import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation
import categoryicon from "../assets/categoryicon.png";
import electricalicon from "../assets/electricalicon.png";
import carpentryicon from "../assets/carpentryicon.png";
import bannerimg from "../assets/bannerimg.jpg";
import gardeningicon from "../assets/gardeningicon.png";
import plumbingicon from "../assets/plumbingicon.png";
import { testimonial } from "../assets/js/testimonials";
import Testimonial from "../components/Testimonial";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { CategoryData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle as CheckCircleIcon } from "lucide-react";
import { HashLink } from "react-router-hash-link";

const HomePage = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const { Services } = useContext(AppContext);
  const icons = [
    categoryicon,
    electricalicon,
    carpentryicon,
    gardeningicon,
    plumbingicon,
  ];

  const { backendUrl, token, userData, subscribeUser } = useContext(AppContext);

  const [subscriptions, setSubscriptions] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/approved-testimonial`
        );
        if (response.data.success) {
          setTestimonials(response.data.testimonials);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchApprovedTestimonials();
  }, [backendUrl]);

  // Get all subscriptions
  const getSubscriptions = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/get-subscriptions`
      );
      if (data) {
        const filteredSubscriptions = data.filter(
          (sub) => sub.plan === "12-month"
        );
        setSubscriptions(filteredSubscriptions);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error(t("toastMessage.failedToLoadSubscriptions"));
    }
  };

  // Verify payment after redirect from Khalti
  const verifyPayment = async (pidx) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/subscription/verify-khalti`,
        {
          params: { pidx },
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        // Update user subscription status in context (if subscribeUser updates userData)
        subscribeUser(); // Assuming this refreshes userData in AppContext
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Error verifying payment");
    }
  };

  // Fetch subscriptions and check for payment verification on mount
  useEffect(() => {
    getSubscriptions();

    // Check if redirected back from Khalti with pidx in query params
    const queryParams = new URLSearchParams(location.search);
    const pidx = queryParams.get("pidx");
    if (pidx && token) {
      verifyPayment(pidx);
    }
  }, [location.search, token]);

  const handleChoosePlan = async (subscription) => {
    if (!token) {
      toast.error("You must be logged in to subscribe to a plan.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/subscription/initiate-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token, // Pass token as a custom header
          },
          body: JSON.stringify({
            amount: 350000, // NPR 3500 in paisa (Khalti expects amount in paisa)
            orderId: `SUB-${Date.now()}`,
            orderName: "12-month Subscription",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.payment_url) {
        window.location.href = data.payment_url; // Redirect to Khalti payment page
      } else {
        toast.error(data.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Error initiating payment");
    }
  };

  return (
    <div className="main overflow-x-hidden">
      <div className="flex items-center justify-center min-h-screen -mt-20">
        <div className="w-full h-full flex relative overflow-hidden">
          {/* Hero Section */}
          <div
            className="text-white flex flex-col justify-center p-8 sm:p-12 bg-cover bg-center h-[100vh] w-full relative"
            style={{
              backgroundImage: `url(${bannerimg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-65 z-0"></div>

            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold z-10 mt-20 md:mt-10">
              {t("home.hero.title")}
            </p>

            <p className="text-lg mt-10 leading-relaxed z-10">
              {t("home.hero.description")}
            </p>

            <button
              onClick={() => navigate("/about")}
              className="mt-8 md:mt-12 hover:bg-white hover:text-black border-white border-2 text-white px-6 md:px-8 py-3 md:py-4 w-[160px] md:w-[220px] hover:scale-105 transition-all duration-300 flex items-center justify-between z-10 whitespace-nowrap text-sm md:text-base"
            >
              {t("home.hero.button")}
              <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-10 mb-20 ml-8 lg:ml-0" id="#category">
        <div>
          <p className="text-3xl font-semibold text-black flex justify-center">
            {t("home.services.title")}
          </p>
        </div>
        <div className="mt-10 sm:items-center flex flex-col lg:flex-row lg:flex-wrap lg:justify-center lg:space-x-16 lg:space-y-0 space-y-12">
          {/* Top Row - 3 Services */}
          <div className="flex flex-col lg:flex-row lg:gap-x-40 space-y-12 lg:space-y-0 lg:mb-20">
            {CategoryData.slice(0, 3).map((item, index) => (
              <Link
                onClick={() => scrollTo(0, 0)}
                key={index}
                to={`/services/${item.category}`}
                className="block bg-[#f5f5f9] shadow-lg rounded-2xl p-6 w-80 border border-gray-200 hover:shadow-xl hover:translate-y-[-10px] transition-all duration-500"
              >
                <div className="flex flex-col items-start">
                  <img
                    src={icons[index % icons.length]}
                    alt="Category Icon"
                    className="w-12 h-12 mb-4"
                  />
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {item.category}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {t("home.services.description")}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-black text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Row - 2 Services in the gaps */}
          <div className="flex flex-col lg:flex-row lg:gap-x-56 lg:mt-[-40px] space-y-12 lg:space-y-0">
            {CategoryData.slice(3, 5).map((item, index) => (
              <Link
                onClick={() => scrollTo(0, 0)}
                key={index + 3}
                to={`/services/${item.category}`}
                className="block bg-[#f5f5f9] shadow-lg rounded-2xl p-6 w-80 border border-gray-200 hover:shadow-xl hover:translate-y-[-10px] transition-all duration-500"
              >
                <div className="flex flex-col items-start">
                  <img
                    src={icons[(index + 3) % icons.length]}
                    alt="Category Icon"
                    className="w-12 h-12 mb-4"
                  />
                  <h3 className="text-xl font-bold text-[#333333] mb-2">
                    {item.category}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {t("home.services.description")}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-black text-lg">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Picks Section */}
      <div className="mt-12 mb-16 flex flex-col items-center gap-4 text-gray-900 md:mx-10">
        <div>
          <p className="text-3xl font-semibold text-black flex justify-center mb-5">
            {t("home.latestPicks.title")}
          </p>
        </div>
        <div className="w-full ml-[4rem] grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 pt-5 gap-y-8 px-3 sm:px-0 ">
          {Services.slice(0, 4).map((item, index) => (
            <div
              onClick={() => {
                navigate(`/bookings/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border bg-[#fbfbfb] border-blue-200 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mr-[4rem]"
              key={index}
            >
              <img
                className="w-full h-48 object-cover bg-blue-50"
                src={item.image}
                alt=""
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-blue-500" : "bg-red-500"
                    }`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>
                <p className="text-gray-900 text-base font-medium">
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            navigate("/services");
            scrollTo(0, 0);
          }}
          className="mt-5 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-3.5 pr-6 rounded-xl hover:scale-105 transition-all duration-300 flex items-center z-10"
        >
          {t("home.services.title")}
        </button>
      </div>

      {/* Subscription Plans Section */}
      <div className="mb-16">
        <p className="text-3xl font-semibold text-black flex justify-center mb-6">
          {t("home.subscriptionPlans.title")}
        </p>
        <div className="bg-[#262626] h-[85vh]">
          <div className="p-6 min-w-full mx-auto">
            <div className="grid grid-cols-1 gap-10 md:mt-[70px] mt-4">
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <div
                    key={subscription._id}
                    className="border md:p-6 p-2 rounded-lg shadow-md bg-[#fbfbfb] hover:shadow-lg transition-all"
                  >
                    <p className="text-xl font-semibold text-black mb-4">
                      {t("home.subscriptionPlans.title2")}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {t("home.subscriptionPlans.description")}
                    </p>
                    <p className="text-xl font-semibold text-blue-700 mb-4">
                      {subscription.plan === "12-month"
                        ? "NPR 3500"
                        : "NPR 2500"}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircleIcon className="text-gray-500" />
                        {subscription.plan}{" "}
                        {t("home.subscriptionPlans.subscriptionDuration")}
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircleIcon className="text-gray-500" />
                        {subscription.discount}%{" "}
                        {t("home.subscriptionPlans.discountOffer")}
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircleIcon className="text-gray-500 w-6 h-6 flex-shrink-0" />
                        <div>
                          <span className="text-base text-black">
                            {t("home.subscriptionPlans.servicesIncluded")}
                          </span>
                          <br />
                          {t("home.subscriptionPlans.discountedServices")}
                        </div>
                      </li>

                      {subscription.plan === "12-month" && (
                        <li className="flex items-center gap-2">
                          <CheckCircleIcon className="text-gray-500" />
                          {t("home.subscriptionPlans.freeInspections")}
                        </li>
                      )}
                    </ul>
                    {userData?.isSubscribed ? (
                      <p className="text-green-600 font-semibold mt-6">
                        You are subscribed!
                      </p>
                    ) : (
                      <button
                        onClick={() => handleChoosePlan(subscription)}
                        className="mt-4 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-2.5 pr-6 rounded-xl hover:scale-105 transition-all duration-300 flex items-center z-10"
                      >
                        {t("home.subscriptionPlans.choosePlan")}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 col-span-2">
                  {t("home.subscriptionPlans.noSubscriptions")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mb-10">
        <p className="text-3xl font-semibold text-black flex justify-center mb-8">
          {t("home.testimonials.title")}
        </p>
        <div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 overflow-auto ml-[3rem] mb-7">
            {testimonials.map((item, index) => (
              <Testimonial
                key={index}
                name={item.name}
                rating={item.rating}
                comment={item.message} // Make sure this matches your API response
                id={item._id} // If you have an ID field
                image={item.image}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-center items-center h-20 mb-10">
          <HashLink
            to="/contact#testimonial" // Navigate to the Contact Us page and scroll to the testimonial section
            smooth
          >
            <button className="lg:ml-20 mt-4 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-2.5 pr-6 rounded-xl hover:scale-105 transition-all duration-300 flex items-center z-10">
              {t("home.hero.tetsimonialButton")}
            </button>
          </HashLink>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
