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

  const [editingStatus, setEditingStatus] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const [workflowModal, setWorkflowModal] = useState(null);
  const [workflowMessage, setWorkflowMessage] = useState("");

  useEffect(() => {
    if (aToken) {
      getAllBookings();
    }
  }, [aToken]);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [bookingId]: newStatus,
    }));
    toast.success(`Status updated to ${newStatus}`);

    try {
      const response = await axios.put(
        `${backendUrl}/api/admin/update-status`,
        { bookingId, orderStatus: newStatus },
        { headers: { aToken, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Status updated successfully");
        window.location.reload();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error(
        error.response?.status === 401
          ? "Unauthorized. Please check your token."
          : "Error updating status"
      );
    }
  };

  const handleSendWorkflow = async (bookingId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/send-workflow`,
        { bookingId, workflowMessage },
        { headers: { aToken, "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Workflow sent successfully");
        setWorkflowModal(null);
        setWorkflowMessage("");
        getAllBookings();
      } else {
        toast.error(response.data.message || "Failed to send workflow");
      }
    } catch (error) {
      console.error("Error sending workflow:", error);
      toast.error("Error sending workflow");
    }
  };

  const openWorkflowModal = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setWorkflowModal(bookingId);
    setWorkflowMessage(booking?.workflowMessage?.content || "");
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <p className="mb-6 text-xl font-semibold text-gray-800">All Bookings</p>

      <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200 bg-white text-sm">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.3fr_0.6fr_0.3fr_1.3fr_0.5fr_0.8fr_0.5fr_1fr_0.5fr_0.3fr_0.7fr] text-center bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 font-medium text-gray-700 uppercase tracking-wider">
          <p className="py-4 px-3 border-r">S.N.</p>
          <p className="py-4 px-3 border-r">User</p>
          <p className="py-4 px-3 border-r max-sm:hidden">Age</p>
          <p className="py-4 px-3 border-r">Email</p>
          <p className="py-4 px-3 border-r">Service Name</p>
          <p className="py-4 px-3 border-r">Date & Time</p>
          <p className="py-4 px-3 border-r">Payment Status</p>
          <p className="py-4 px-3 border-r">Status</p>
          <p className="py-4 px-3 border-r">Price</p>
          <p className="py-4 px-3 border-r">Cancel</p>
          <p className="py-4 px-3">Workflow</p>
        </div>

        {/* Table Body */}
        <div className="max-h-[70vh] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {bookings.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[0.3fr_0.6fr_0.3fr_1.3fr_0.5fr_0.8fr_0.5fr_1fr_0.5fr_0.4fr_0.7fr] text-center border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
            >
              <p className="py-4 px-3 border-r text-gray-600">{index + 1}</p>
              <p className="py-4 px-3 border-r text-gray-800 font-medium">
                {item.userData.name}
              </p>
              <p className="py-4 px-3 border-r text-gray-600 max-sm:hidden">
                {calculateAge(item.userData.dob)}
              </p>
              <p className="py-4 px-3 border-r text-gray-600 break-words">
                {item.userData.email}
              </p>
              <p className="py-4 px-3 border-r text-gray-800 font-medium">
                {item.serviceData.name?.en ||
                  item.serviceData.name?.np ||
                  "N/A"}
              </p>
              <p className="py-4 px-3 border-r text-gray-600">
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              {/* Payment Status Column */}
              <p
                className={`py-4 px-3 border-r font-medium ${
                  item.paymentStatus === "Completed"
                    ? "text-green-600"
                    : item.paymentStatus === "Pending"
                    ? "text-yellow-600"
                    : item.paymentStatus === "Failed"
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {item.paymentStatus || "N/A"}
              </p>

              {/* Status Column */}
              <div className="py-4 px-3 border-r flex items-center justify-center">
                {editingStatus === item._id ? (
                  <select
                    className="border border-gray-300 p-1 rounded-md w-full text-gray-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    value={statusUpdates[item._id] || item.orderStatus}
                    onChange={(e) =>
                      handleUpdateStatus(item._id, e.target.value)
                    }
                  >
                    <option value="Booked">Booked</option>
                    <option value="On the Way">On the Way</option>
                    <option value="Completed">Completed</option>
                  </select>
                ) : (
                  <div className="flex justify-between items-center gap-3 w-full">
                    <span
                      className={`font-semibold ${
                        (statusUpdates[item._id] || item.orderStatus) ===
                        "Booked"
                          ? "text-blue-600"
                          : (statusUpdates[item._id] || item.orderStatus) ===
                            "On the Way"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {statusUpdates[item._id] || item.orderStatus}
                    </span>
                    <button
                      onClick={() => setEditingStatus(item._id)}
                      className="text-white text-sm bg-gray-800 hover:bg-gray-900 p-2 rounded-lg transition-colors duration-200"
                    >
                      Update Status
                    </button>
                  </div>
                )}
              </div>

              <p className="py-4 px-3 border-r text-gray-700 font-medium">
                {currency}
                {item.serviceData.price.en}
              </p>

              {item.cancelled ? (
                <p className="py-4 px-3 text-red-500 text-sm font-medium">
                  Cancelled
                </p>
              ) : (
                <div className="py-4 px-3 border-r flex justify-center items-center">
                  <img
                    onClick={() => cancelBooking(item._id).then(getAllBookings)}
                    className="w-5 cursor-pointer hover:opacity-75 transition-opacity duration-200"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                </div>
              )}

              {/* Workflow Column */}
              <div className="py-4 px-3 flex justify-center">
                <button
                  onClick={() => openWorkflowModal(item._id)}
                  className="text-white text-sm bg-gray-800 hover:bg-gray-900 p-2 rounded-lg transition-colors duration-200"
                >
                  Send Milestone
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Modal */}
      {workflowModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Send Milestone</h3>
            <textarea
              className="w-full p-2 border rounded mb-4"
              rows="6"
              value={workflowMessage}
              onChange={(e) => setWorkflowMessage(e.target.value)}
              placeholder="Enter milestone details..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleSendWorkflow(workflowModal)}
                className="bg-white text-black px-4 py-2 rounded hover:bg-black hover:text-white border-black border-2"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setWorkflowModal(null);
                  setWorkflowMessage("");
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
