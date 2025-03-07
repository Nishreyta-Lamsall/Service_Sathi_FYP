import React, { useEffect, useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const AllBookings = () => {
  const { aToken, bookings, getAllBookings, cancelBooking, backendUrl } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  // State to track which booking is being updated
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});

  // Fetch bookings when aToken changes
  useEffect(() => {
    if (aToken) {
      getAllBookings();
    }
  }, [aToken]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    // Immediately update the local state to reflect the status change
    setStatusUpdates((prev) => ({
      ...prev,
      [bookingId]: newStatus,
    }));

    // Display toast notification for status change
    toast.success(`Status updated to ${newStatus}`);

    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/update-status`,
        { bookingId, orderStatus: newStatus },
        {
          headers: {
            aToken, 
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Status updated successfully");
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      // Log the complete error response to debug
      if (error.response) {
        console.error("Error response from backend:", error.response);
        if (error.response.status === 401) {
          toast.error("Unauthorized. Please check your token.");
        } else {
          toast.error("Failed to update status due to server error.");
        }
      } else {
        toast.error("Error updating status");
      }

      console.error("Status Update Error:", error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <p className="mb-4 text-lg font-medium">All Bookings</p>

      <div className="border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto overflow-x-auto scrollbar-none">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.3fr_0.7fr_0.3fr_1.5fr_0.7fr_1fr_1.7fr_0.6fr_0.7fr] text-center bg-gray-100 border-b border-gray-300">
          <p className="py-3 px-2 border-r">S.N.</p>
          <p className="py-3 px-2 border-r">User</p>
          <p className="py-3 px-2 border-r max-sm:hidden">Age</p>
          <p className="py-3 px-2 border-r">Email</p>
          <p className="py-3 px-2 border-r">Service Name</p>
          <p className="py-3 px-2 border-r">Date & Time</p>
          <p className="py-3 px-2 border-r">Status</p>
          <p className="py-3 px-2 border-r">Price</p>
          <p className="py-3 px-2">Cancel</p>
        </div>

        {/* Table Body */}
        {bookings.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.3fr_0.7fr_0.3fr_1.5fr_0.7fr_1fr_1.7fr_0.6fr_0.7fr] text-center border-b border-gray-300"
          >
            <p className="py-3 px-2 border-r">{index + 1}</p>
            <p className="py-3 px-2 border-r">{item.userData.name}</p>
            <p className="py-3 px-2 border-r max-sm:hidden">
              {calculateAge(item.userData.dob)}
            </p>
            <p className="py-3 px-2 border-r break-words">
              {item.userData.email}
            </p>
            <p className="py-3 px-2 border-r">{item.serviceData.name}</p>
            <p className="py-3 px-2 border-r">
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Status Column */}
            <div className="py-3 px-2 border-r">
              {editingStatus === item._id ? (
                <select
                  className="border p-1 rounded w-full"
                  value={statusUpdates[item._id] || item.orderStatus}
                  onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                >
                  <option value="Booked">Booked</option>
                  <option value="On the Way">On the Way</option>
                  <option value="Completed">Completed</option>
                </select>
              ) : (
                <div className="flex justify-between items-center gap-2">
                  <span>{statusUpdates[item._id] || item.orderStatus}</span>
                  <button
                    onClick={() => setEditingStatus(item._id)}
                    className="text-white text-sm bg-gray-900 p-2 rounded-xl"
                  >
                    Update Status
                  </button>
                </div>
              )}
            </div>

            <p className="py-3 px-2 border-r">
              {currency}
              {item.serviceData.price}
            </p>

            {item.cancelled ? (
              <p className="text-red-400 text-sm font-medium mt-3">Cancelled</p>
            ) : (
              <div className="py-3 px-2 flex justify-center">
                <img
                  onClick={() => cancelBooking(item._id).then(getAllBookings)}
                  className="w-5 cursor-pointer"
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBookings;
