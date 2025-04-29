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

  const calculateInspectionDates = (startDate) => {
    if (!startDate) return [];
    const dates = [];
    const intervals = [4, 8, 12]; 
    intervals.forEach((month) => {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + month);
      dates.push(date.toLocaleDateString());
    });
    return dates;
  };

  const calculateEndDate = (startDate) => {
    if (!startDate) return "N/A";
    const start = new Date(startDate);
    start.setMonth(start.getMonth() + 12);
    return start.toLocaleDateString();
  };

  const getConfirmationMessage = () => {
    if (!userSubscription || !userDetails) return null;

    const inspectionDates = calculateInspectionDates(userDetails.startDate);
    const houseSize =
      userSubscription.plan === "12-month"
        ? t("home.hero.B")
        : t("home.hero.A");

    return `${t("inspections")} ${houseSize}. ${t(
      "inspectionDates"
    )} ${inspectionDates.join(", ")}.`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-black text-white py-6 px-6 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t("mySubscriptions.title")}
          </h1>
        </div>

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
              <div className="border border-green-200 bg-green-50 rounded-lg p-6 text-center">
                <p className="text-lg text-green-800 font-medium">
                  {getConfirmationMessage()}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userData.name}
                  </h2>
                </div>

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
                      (
                      {userSubscription.plan === "6-month"
                        ? "2000 sq.ft or less houses"
                        : "2000 sq.ft and above houses"}
                      )
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
                      {calculateEndDate(userDetails.startDate)}
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
