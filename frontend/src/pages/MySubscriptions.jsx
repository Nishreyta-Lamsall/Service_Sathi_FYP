import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const MySubscriptions = () => {
  const { t } = useTranslation();
  const { backendUrl, token, userData } = useContext(AppContext);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!token || !userData?.isSubscribed || !userData?.subscription) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${backendUrl}/api/admin/get-subscriptions`,
          {
            headers: { token },
          }
        );
        if (response.data) {
          setSubscriptions(response.data);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [backendUrl, token, userData]);

  const userSubscription = subscriptions.find(
    (sub) => sub._id === userData?.subscription
  );
  const userDetails = userSubscription?.users.find(
    (user) => user.userId === userData?._id
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white py-6 px-6 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("mySubscriptions.title")}
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-700">
                {t("mySubscriptions.loading")}
              </p>
            </div>
          ) : userData?.isSubscribed && userSubscription && userDetails ? (
            <div className="space-y-8">
              {/* User Info Card */}
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userData.name}
                  </h2>
                </div>

                {/* Subscription Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.email")}
                    </h3>
                    <p className="text-lg">{userData.email}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.plan")}
                    </h3>
                    <p className="text-lg capitalize">
                      {userSubscription.plan}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.pidx")}
                    </h3>
                    <p className="text-lg">{userDetails.pidx || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.transactionId")}
                    </h3>
                    <p className="text-lg">
                      {userDetails.transactionId || "N/A"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.startDate")}
                    </h3>
                    <p className="text-lg">
                      {new Date(userDetails.startDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.endDate")}
                    </h3>
                    <p className="text-lg">
                      {new Date(userDetails.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {t("mySubscriptions.status")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          userDetails.status === "active"
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      ></span>
                      <span className="text-lg capitalize">
                        {userDetails.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <p className="text-lg text-gray-700">
                {t("mySubscriptions.noSubscription")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MySubscriptions;
