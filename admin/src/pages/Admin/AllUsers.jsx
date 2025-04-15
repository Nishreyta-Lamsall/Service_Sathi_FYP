import React, { useContext, useEffect, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const AllUsers = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchAllUsers = async () => {
    if (!aToken) {
      toast.error("Admin not authenticated");
      setLoading(false);
      return;
    }

    try {
      console.log("Fetching all users with aToken:", aToken);
      const response = await axios.get(`${backendUrl}/api/admin/all-users`, {
        headers: { aToken },
      });
      console.log("All users response:", response.data);

      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, [backendUrl, aToken]);

  // Delete a user
  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${userName || "this user"}?`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${backendUrl}/api/admin/delete-user/${userId}`,
        {
          headers: { aToken },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User deleted successfully");
        await fetchAllUsers(); // Refresh the user list
      } else {
        toast.error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Error deleting user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[97vh] p-8 overflow-y-auto bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-black text-white py-6 px-6 sm:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All Users
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg text-gray-700">Loading...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-8">
              {/* Users Table */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  User List
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user, index) => (
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
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {user.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() =>
                                handleDeleteUser(user.userId, user.name)
                              }
                              className="text-red-600 hover:text-red-800 font-medium"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <p className="text-lg text-gray-700">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
