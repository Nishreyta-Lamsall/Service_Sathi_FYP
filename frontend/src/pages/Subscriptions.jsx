import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { CheckCircle as CheckCircleIcon } from "lucide-react";
import {useNavigate} from 'react-router-dom'

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
        setSubscriptions(data); // Save the subscriptions to state
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast.error("Failed to load subscriptions.");
    }
  };

  // Fetch subscriptions on component mount
  useEffect(() => {
    {
      getSubscriptions();
    }
  });

    const handleChoosePlan = async (subscription) => {
      if (!token) {
        toast.error("You must be logged in to subscribe to a plan.");
        navigate("/login"); 
        return; 
      }
      const userId = userData._id;
      const subscriptionId = subscription._id;
      const plan = subscription.plan;

      await subscribeUser(userId, subscriptionId, plan);
    };

    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Available Subscriptions</h2>
        <p className="text-gray-600 mb-10 ">
          We offer flexible subscription plans tailored to meet your needs.
          Whether you're looking for short-term access or a long-term
          commitment, we've got you covered. All plans come with amazing
          discounts and perks, so you can choose the one that works best for
          you! Our subscriptions are designed to provide you with exclusive
          benefits, including priority support, scheduled maintenance, and
          access to premium features. With a variety of options available, you
          can select a plan that aligns with your usage and budget. Enjoy peace
          of mind knowing that you're getting the best value with our
          competitively priced plans.
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
                <p className="text-xl font-semibold text-blue-700 mb-4">
                  {subscription.plan === "12-month" ? "Plan B" : "Plan A"}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Get the most out of your membership with exclusive perks and
                  discounts.
                </p>
                <p className="text-xl font-semibold text-red-600 mb-4">
                  {subscription.plan === "12-month" ? "NPR 3500" : "NPR 2500"}
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="text-green-500" />
                    {subscription.plan} subscription
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

                  {subscription.plan === "12-month" && (
                    <li className="flex items-center gap-2">
                      <CheckCircleIcon className="text-green-500" />
                      Free scheduled inspections every 4 months
                    </li>
                  )}
                </ul>
                <button
                  onClick={() => handleChoosePlan(subscription)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300"
                >
                  Choose Plan
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-2">
              No subscriptions available
            </p>
          )}
        </div>
      </div>
    );
};

export default Subscriptions;
