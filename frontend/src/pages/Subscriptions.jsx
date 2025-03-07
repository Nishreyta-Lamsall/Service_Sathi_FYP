import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle as CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const { backendUrl, token, userData, subscribeUser } = useContext(AppContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();

  // Get all subscriptions
  const getSubscriptions = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/admin/get-subscriptions"
      );
      if (data) {
        const filteredSubscriptions = data.filter(
          (sub) => sub.plan === "12-month"
        );
        setSubscriptions(filteredSubscriptions);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions.");
    }
  };

  // Fetch subscriptions on component mount
  useEffect(() => {
    getSubscriptions();
  }, []);

const handleChoosePlan = async (subscription) => {
  if (!token) {
    toast.error("You must be logged in to subscribe to a plan.");
    navigate("/login");
    return;
  }

  console.log("Token:", token); // Check if the token is valid

  try {
    const response = await fetch(
      `${backendUrl}/api/subscription/initiate-payment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token, // Pass token as a custom header
        },
        body: JSON.stringify({
          subscriptionId: subscription._id, // Ensure subscriptionId is passed here
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.payment_url) {
      window.location.href = data.payment_url; // Redirect the user to the payment page
    } else {
      toast.error(data.message || "Payment initiation failed");
    }
  } catch (error) {
    console.error("Payment error:", error);
    toast.error("Error initiating payment");
  }
};

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Subscriptions</h2>
      <p className="text-gray-600 mb-10">
        We offer flexible subscription plans tailored to meet your needs. Our
        12-month plan provides exclusive benefits, including priority support,
        scheduled maintenance, and access to premium features.
      </p>
      <p className="text-center text-red-600 font-medium mb-10">
        Enjoy exclusive benefits like scheduled inspections, exclusive
        discounts, and more!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div
              key={subscription._id}
              className="border p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition-all"
            >
              <p className="text-xl font-semibold text-blue-700 mb-4">Plan B</p>
              <p className="text-sm text-gray-500 mb-3">
                Get the most out of your membership with exclusive perks and
                discounts.
              </p>
              <p className="text-xl font-semibold text-red-600 mb-4">
                NPR 3500
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="text-green-500" />
                  12-month subscription
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="text-green-500" />
                  {subscription.discount}% discount on selected services
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircleIcon className="text-green-500 w-6 h-6 flex-shrink-0" />
                  <div>
                    <span className="text-base text-black">
                      Services included:
                    </span>
                    <br />
                    Carpet and Upholstery Cleaning, Window Cleaning, Light
                    Installation, Power Outlet Installation, Ceiling Fan
                    Installation, Electrical Safety Inspections, Inverter
                    Installation.
                  </div>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircleIcon className="text-green-500" />
                  Free scheduled inspections every 4 months
                </li>
              </ul>
              {userData?.isSubscribed ? (
                <p className="text-green-600 font-semibold">
                  You are subscribed!
                </p>
              ) : (
                <button
                  onClick={() => handleChoosePlan(subscription)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                >
                  Choose Plan
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-2">
            No 12-month subscriptions available
          </p>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
