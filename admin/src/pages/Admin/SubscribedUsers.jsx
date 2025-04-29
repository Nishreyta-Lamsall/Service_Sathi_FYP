import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const SubscribedUsers = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [subscribedUsers, setSubscribedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribedUsers = async () => {
      if (!aToken) {
        toast.error("Admin not authenticated");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching subscriptions with aToken:", aToken);
        const response = await axios.get(
          `${backendUrl}/api/admin/get-subscriptions`,
          {
            headers: { aToken },
          }
        );
        console.log("Subscriptions response:", response.data);

        const subscriptions = Array.isArray(response.data) ? response.data : [];
        if (subscriptions.length > 0) {
          const usersWithDetails = [];
          console.log("Processing subscriptions:", subscriptions);

          for (const subscription of subscriptions) {
            const users = Array.isArray(subscription.users)
              ? subscription.users
              : [];
            console.log(`Subscription ${subscription._id} users:`, users);

            for (const user of users) {
              try {
                console.log(`Fetching user ${user.userId}`);
                const userResponse = await axios.get(
                  `${backendUrl}/api/admin/get-user/${user.userId}`,
                  { headers: { aToken } }
                );
                console.log(`User ${user.userId} response:`, userResponse.data);

                // Only include users that exist (success: true)
                if (userResponse.data.success) {
                  usersWithDetails.push({
                    userId: user.userId,
                    name: userResponse.data.name || "N/A",
                    phone: userResponse.data.phone || "N/A", // Add phone number
                    subscriptionPlan: subscription.plan || "Unknown Plan",
                    startDate: user.startDate,
                  });
                } else {
                  console.log(`User ${user.userId} not found in database`);
                }
              } catch (userError) {
                console.error(
                  `Error fetching user ${user.userId}:`,
                  userError.response?.data || userError.message
                );
                // Skip users that fail to fetch (no "Unknown User" placeholder)
              }
            }
          }
          console.log("Final usersWithDetails:", usersWithDetails);
          setSubscribedUsers(usersWithDetails);

          if (usersWithDetails.length === 0) {
            toast.error("No valid subscribed users found");
          }
        } else {
          toast.error("No subscriptions found");
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast.error(
          error.response?.data?.message || "Error fetching subscriptions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribedUsers();
  }, [backendUrl, aToken]);

  // Calculate inspection dates (4, 8, 12 months)
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

  // Get house size based on plan
  const getHouseSize = (plan) =>
    plan === "12-month"
      ? "2000 sq.ft and above houses"
      : "2000 sq.ft and less houses";

  return (
    <div className="h-[97vh] p-8 overflow-y-auto bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white py-6 px-6 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Subscribed Users
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-700">Loading...</p>
            </div>
          ) : subscribedUsers.length > 0 ? (
            <div className="space-y-8">
              {/* Users Table */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Active Subscribers
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Inspection Dates
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {subscribedUsers.map((user, index) => {
                        const inspectionDates = calculateInspectionDates(
                          user.startDate
                        );
                        const houseSize = getHouseSize(user.subscriptionPlan);
                        return (
                          <tr key={`${user.userId}-${index}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {user.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {houseSize}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {inspectionDates.length > 0
                                ? inspectionDates.join(", ")
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <p className="text-lg text-gray-700">No subscribed users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscribedUsers;
