import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllBookings = () => {
  const { aToken, bookings, getAllBookings, cancelBooking } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  // Fetch bookings when aToken changes or when the bookings are updated
  useEffect(() => {
    if (aToken) {
      getAllBookings();
    }
  }, [aToken]);

  // Function to handle cancel booking and force a re-fetch
  const handleCancelBooking = (bookingId) => {
    cancelBooking(bookingId).then(() => {
      // After canceling, force re-fetch of all bookings
      getAllBookings();
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      <p className="mb-4 text-lg font-medium">All Bookings</p>

      <div className="border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-auto overflow-x-auto scrollbar-none">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.3fr_0.7fr_0.5fr_2fr_1.5fr_1fr_0.7fr_0.7fr] text-center bg-gray-100 border-b border-gray-300">
          <p className="py-3 px-2 border-r">S.N.</p>
          <p className="py-3 px-2 border-r">User</p>
          <p className="py-3 px-2 border-r max-sm:hidden">Age</p>
          <p className="py-3 px-2 border-r">Email</p>
          <p className="py-3 px-2 border-r">Service Name</p>
          <p className="py-3 px-2 border-r">Date & Time</p>
          <p className="py-3 px-2 border-r">Price</p>
          <p className="py-3 px-2">Cancel</p>
        </div>

        {/* Table Body */}
        {bookings.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[0.3fr_0.7fr_0.5fr_2fr_1.5fr_1fr_0.7fr_0.7fr] text-center border-b border-gray-300"
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
            <p className="py-3 px-2 border-r">
              {currency}
              {item.serviceData.price}
            </p>
            {item.cancelled ? (
              <p className="text-red-400 text-sm font-medium mt-3">Cancelled</p>
            ) : (
              <div className="py-3 px-2 flex justify-center">
                <img
                  onClick={() => handleCancelBooking(item._id)}
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
