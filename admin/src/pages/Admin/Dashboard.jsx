import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
  import { Link } from "react-router-dom";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const { aToken, getDashData, cancelBooking, dashData } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  const handleCancelBooking = (bookingId) => {
    cancelBooking(bookingId).then(() => {
      getDashData();
    });
  };

  const userData = [
    { name: "Subscribed", value: dashData?.subscribedUsers || 0 },
    { name: "Regular", value: dashData?.regularUsers || 0 },
  ];

  const COLORS = ["#0088FE", "#00C49F"]; 

  return (
    dashData && (
      <div className="p-6 bg-gray-50 max-h-[90vh] overflow-y-auto scrollbar-none">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-white">
                  {dashData.services}
                </p>
                <p className="text-sm text-blue-100 mt-2">Total Services</p>
              </div>
              <img
                src={assets.service_icon}
                alt="Services"
                className="w-16 h-16 opacity-90"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-400 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-white">
                  {dashData.bookings}
                </p>
                <p className="text-sm text-green-100 mt-2">Total Bookings</p>
              </div>
              <img
                src={assets.booking_icon}
                alt="Bookings"
                className="w-16 h-16 opacity-90"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-white">
                  {dashData.subscribedUsers}
                </p>
                <p className="text-sm text-purple-100 mt-2">Subscribed Users</p>
              </div>
              <img
                src={assets.user_icon}
                alt="Users"
                className="w-16 h-16 opacity-90"
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-400 p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-5xl font-bold text-white">
                  {dashData.serviceProviders}
                </p>
                <p className="text-sm text-orange-100 mt-2">
                  Service Providers
                </p>
              </div>
              <img
                src={assets.provider_icon}
                alt="Providers"
                className="w-16 h-16 opacity-90"
              />
            </div>
          </div>
        </div>
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              User Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {userData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Bookings
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashData.latestBookings.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={item.serviceData.image}
                            alt="Service"
                            className="w-10 h-10 rounded-full"
                          />
                          <p className="ml-4 text-sm text-gray-900">
                            {typeof item.serviceData.name === "string"
                              ? item.serviceData.name
                              : item.serviceData.name?.en ||
                                item.serviceData.name?.np ||
                                "N/A"}
                          </p>
                        </div>
                      </td>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.slotDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.cancelled ? (
                        <span className="px-2 py-1 text-xs text-red-600 bg-red-100 rounded-full">
                          Cancelled
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs text-green-600 bg-green-100 rounded-full">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!item.cancelled && (
                        <button
                          onClick={() => handleCancelBooking(item._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <img
                            src={assets.cancel_icon}
                            alt="Cancel"
                            className="w-5 h-5"
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Dashboard Navigation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/add-service"
              className="text-black border-black bg-white hover:bg-black hover:text-white border-2 px-6 py-3 hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm rounded-lg"
            >
              Add Service
            </Link>
            <Link
              to="/add-provider"
              className="text-black border-black bg-white hover:bg-black hover:text-white border-2 px-6 py-3 hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm rounded-lg"
            >
              Add Provider
            </Link>
            <Link
              to="/service-list"
              className="text-black border-black bg-white hover:bg-black hover:text-white border-2 px-6 py-3 hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm rounded-lg"
            >
              Service List
            </Link>
            <Link
              to="/provider-list"
              className="text-black border-black bg-white hover:bg-black hover:text-white border-2 px-6 py-3 hover:scale-105 transition-all duration-300 flex items-center justify-center text-sm rounded-lg"
            >
              Provider List
            </Link>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
