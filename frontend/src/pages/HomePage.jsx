import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import categoryicon from "../assets/categoryicon.png";
import electricalicon from "../assets/electricalicon.png";
import carpentryicon from "../assets/carpentryicon.png";
import bannerimg from "../assets/bannerimg.jpg";
import gardeningicon from "../assets/gardeningicon.png";
import plumbingicon from "../assets/plumbingicon.png";
import Testimonial from "../components/Testimonial";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle as CheckCircleIcon } from "lucide-react";
import { HashLink } from "react-router-hash-link";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "Nepali" ? "np" : "en";
  const { Services, backendUrl, token, userData, subscribeUser } =
    useContext(AppContext);
  const icons = [
    categoryicon,
    electricalicon,
    carpentryicon,
    gardeningicon,
    plumbingicon,
  ];

  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [testimonials, setTestimonials] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (Services && Services.length > 0) {
      const uniqueCategories = [];
      const categoryMap = new Map();
      Services.forEach((service) => {
        const categoryEn = service.category?.en || "Unknown Category";
        const categoryNp = service.category?.np || "Unknown Category";
        const categoryKey = categoryEn;
        if (!categoryMap.has(categoryKey)) {
          categoryMap.set(categoryKey, { en: categoryEn, np: categoryNp });
          uniqueCategories.push({ en: categoryEn, np: categoryNp });
        }
      });
      setCategories(uniqueCategories.slice(0, 5));
    }
  }, [Services]);

  useEffect(() => {
    const fetchApprovedTestimonials = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/approved-testimonial`
        );
        if (response.data.success) {
          setTestimonials(response.data.testimonials);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchApprovedTestimonials();
  }, [backendUrl]);

  const getSubscriptions = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/get-subscriptions`
      );
      if (data) {
        setSubscriptions(data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error(t("toastMessage.failedToLoadSubscriptions"));
    }
  };

const verifyPayment = async (pidx) => {
  if (!token) {
    toast.error("Please log in to verify payment");
    navigate("/login");
    return;
  }

  if (!userData || !userData._id) {
    console.error("User data not available yet:", userData);
    toast.error("User data is loading, please wait...");
    return;
  }

  setIsVerifying(true);
  try {
    console.log("Verifying payment:", { pidx, userId: userData._id });
    const { data } = await axios.post(
      `${backendUrl}/api/subscription/verify-khalti`,
      { userId: userData._id },
      { params: { pidx }, headers: { token } }
    );
    console.log("Verification response:", data);
    if (data.success) {
      toast.success(data.message);
      await subscribeUser(); 
    } else {
    }
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
  } finally {
    setIsVerifying(false);
  }
};

useEffect(() => {
  getSubscriptions();
  const queryParams = new URLSearchParams(location.search);
  const pidx = queryParams.get("pidx");
  console.log("Redirect params:", { pidx });
  if (pidx && token && userData?._id && !isVerifying) {
    verifyPayment(pidx);
  }
}, [location.search, token, userData]); // Add userData to dependencies

const handleChoosePlan = async (subscription) => {
  if (!token) {
    toast.error("You must be logged in to subscribe to a plan.");
    navigate("/login");
    return;
  }

  if (userData?.isSubscribed) {
    toast.error(t("toastMessage.alreadySubscribed"));
    return;
  }

  try {
    const amount = subscription.plan === "6-month" ? 200000 : 350000;
    const response = await fetch(
      `${backendUrl}/api/subscription/initiate-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token,
        },
        body: JSON.stringify({
          userId: userData._id,
          amount,
          orderId: `SUB-${Date.now()}`,
          orderName: `${subscription.plan} Subscription`,
        }),
      }
    );

    const data = await response.json();
    if (response.ok && data.payment_url) {
      window.location.href = data.payment_url;
    } else {
      console.log(data.message);
    }
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Error initiating payment");
  }
};

const isUserSubscribedToPlan = (plan) => {
  if (!userData?.isSubscribed || !userData?.subscription) return false;
  const userSubscription = subscriptions.find(
    (sub) => sub._id === userData.subscription
  );
  return userSubscription?.plan === plan;
};

  return (
    <div className="main overflow-x-hidden">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen -mt-20">
        <div className="w-full h-full flex relative overflow-hidden">
          <div
            className="text-white flex flex-col justify-center p-8 sm:p-12 bg-cover bg-center h-[100vh] w-full relative"
            style={{
              backgroundImage: `url(${bannerimg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black opacity-65 z-0"></div>
            <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold z-10 mt-20 md:mt-10 lg:ml-3">
              {t("home.hero.title")}
            </p>
            <p className="text-lg mt-10 leading-relaxed z-10 lg:ml-3">
              {t("home.hero.description")}
            </p>
            <button
              onClick={() => navigate("/about")}
              className="mt-8 md:mt-12 lg:ml-3 hover:bg-white hover:text-black border-white border-2 text-white px-6 md:px-8 py-3 md:py-4 w-[160px] md:w-[220px] hover:scale-105 transition-all duration-300 flex items-center justify-between z-10 whitespace-nowrap text-sm md:text-base"
            >
              {t("home.hero.button")}{" "}
              <i className="fa-solid fa-arrow-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mt-10 mb-20" id="category">
        <p className="text-3xl font-semibold text-black flex justify-center">
          {t("home.services.title")}
        </p>
        {Services.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">Loading services...</p>
        ) : categories.length > 0 ? (
          <div className="mt-10 ml-16 flex flex-col lg:flex-row lg:flex-wrap lg:items-start lg:justify-start lg:space-x-64 lg:space-y-0 space-y-12">
            <div className="flex flex-col lg:flex-row lg:gap-x-56 space-y-12 lg:space-y-0 lg:mb-20">
              {categories.slice(0, 3).map((item, index) => (
                <div
                  onClick={() =>
                    navigate(
                      `/services/${(item.en || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                      {
                        state: {
                          scrollTo: (item.en || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        },
                      }
                    )
                  }
                  key={index}
                  className="block bg-[#f5f5f9] shadow-lg rounded-2xl p-6 w-80 border border-gray-200 hover:shadow-xl hover:translate-y-[-10px] transition-all duration-500 cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <img
                      src={icons[index % icons.length]}
                      alt="Category Icon"
                      className="w-6 h-6 mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      {item[currentLang] || "Unknown Category"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {t("home.services.description")}
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <span className="text-black text-lg">→</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col lg:flex-row lg:gap-x-56 lg:mt-[-40px] space-y-12 lg:space-y-0">
              {categories.slice(3, 5).map((item, index) => (
                <div
                  onClick={() =>
                    navigate(
                      `/services/${(item.en || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                      {
                        state: {
                          scrollTo: (item.en || "")
                            .toLowerCase()
                            .replace(/\s+/g, "-"),
                        },
                      }
                    )
                  }
                  key={index + 3}
                  className="block bg-[#f5f5f9] shadow-lg rounded-2xl p-6 w-80 border border-gray-200 hover:shadow-xl hover:translate-y-[-10px] transition-all duration-500 cursor-pointer"
                >
                  <div className="flex flex-col items-start">
                    <img
                      src={icons[(index + 3) % icons.length]}
                      alt="Category Icon"
                      className="w-6 h-6 mb-4"
                    />
                    <h3 className="text-xl font-bold text-[#333333] mb-2">
                      {item[currentLang] || "Unknown Category"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {t("home.services.description")}
                    </p>
                  </div>
                  <div className="mt-4 text-right">
                    <span className="text-black text-lg">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            No categories available
          </p>
        )}
      </div>

      {/* Latest Picks Section */}
      <div className="mt-16 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-gray-900">
            {t("home.latestPicks.title")}
          </h2>
        </div>

        {/* Container with mx-16 on large screens only */}
        <div className="lg:ml-16 lg:mr-12 px-4 lg:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-11">
            {Services.slice(0, 8).map((item, index) => (
              <div
                onClick={() => {
                  navigate(`/bookings/${item._id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                key={index}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    className="w-full h-48 object-cover"
                    src={item.image}
                    alt={item.name[currentLang]}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-service.jpg";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        item.available ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    <span
                      className={`text-sm ${
                        item.available ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.available
                        ? t("service.availability.available")
                        : t("service.availability.notAvailable")}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {item.name[currentLang]}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {item.category[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => {
              navigate("/services");
              window.scrollTo(0, 0);
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {t("home.services.title")}
          </button>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div className="mb-16">
        <p className="text-3xl font-semibold text-black flex justify-center mb-8">
          {t("home.subscriptionPlans.title")}
        </p>

        <div className="bg-[#1f1f1f] py-12 rounded-lg ml-16 mr-14">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription) => (
                  <div
                    key={subscription._id}
                    className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <p className="text-2xl font-semibold text-gray-900 mb-3">
                      {subscription.plan} {t("home.subscriptionPlans.title2")}
                    </p>
                    <p className="text-gray-600 mb-4">
                      {t("home.subscriptionPlans.description")}
                    </p>

                    <p className="text-2xl font-bold text-blue-700 mb-5">
                      {subscription.plan === "6-month"
                        ? "NPR 2000"
                        : "NPR 3500"}
                    </p>

                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-center gap-3">
                        <CheckCircleIcon className="text-green-500 w-5 h-5" />
                        {subscription.plan}{" "}
                        {t("home.subscriptionPlans.subscriptionDuration")}
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircleIcon className="text-green-500 w-5 h-5" />
                        {subscription.discount}%{" "}
                        {t("home.subscriptionPlans.discountOffer")}
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircleIcon className="text-green-500 w-6 h-6 flex-shrink-0" />
                        <div>
                          <span className="text-lg font-medium text-gray-900">
                            {t("home.subscriptionPlans.servicesIncluded")}
                          </span>
                          <p className="text-gray-600">
                            {t("home.subscriptionPlans.discountedServices")}
                          </p>
                        </div>
                      </li>
                      {subscription.plan === "12-month" && (
                        <li className="flex items-center gap-3">
                          <CheckCircleIcon className="text-green-500 w-5 h-5" />
                          {t("home.subscriptionPlans.freeInspections")}
                        </li>
                      )}
                    </ul>

                    {isUserSubscribedToPlan(subscription.plan) ? (
                      <p className="text-green-600 font-semibold mt-6">
                        {t("contactUs.issubscribed")}
                      </p>
                    ) : (
                      <button
                        onClick={() => handleChoosePlan(subscription)}
                        className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        {t("home.subscriptionPlans.choosePlan")}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-300 col-span-2 py-12">
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
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 overflow-auto ml-16 mr-12 mb-7">
          {testimonials.map((item, index) => (
            <Testimonial
              key={index}
              name={item.name}
              rating={item.rating}
              comment={item.message}
              id={item._id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
