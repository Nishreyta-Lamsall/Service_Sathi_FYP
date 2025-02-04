import React, { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userData, setUserData] = useState({
    name: "Ray Shrestha",
    image: assets.profile_pic,
    email: "rayshrestha@gmail.com",
    phone: "+977 9876782766",
    address: {
      line1: "Boharatar, Balaju Height",
      line2: "Kathmandu",
    },
    gender: "Female",
    dob: "2000-02-22",
  });

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="flex gap-8 p-8 bg-gradient-to-br from-gray-50 to-gray-200 shadow-xl rounded-xl max-w-3xl mx-auto mt-16 mb-16">
      {/* Left Section - Image */}
      <div className="w-1/3 flex justify-center">
        <img
          className="w-40 h-40 object-cover rounded-full border-4 border-gray-400 shadow-md"
          src={userData.image}
          alt="Profile"
        />
      </div>

      {/* Right Section - Form */}
      <div className="w-2/3">
        {/* Name Field */}
        {isEdit ? (
          <input
            className="bg-gray-50 text-3xl font-semibold w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-semibold text-3xl text-neutral-800">
            {userData.name}
          </p>
        )}

        <hr className="my-4 border-gray-300" />

        {/* Contact Information */}
        <p className="font-bold text-lg text-blue-900 mb-2">
          CONTACT INFORMATION
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 font-medium">Email ID:</p>
            <p className="font-medium text-blue-600">{userData.email}</p>
          </div>

          <div>
            <p className="text-gray-600 font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="font-medium text-gray-800">{userData.phone}</p>
            )}
          </div>

          {/* Address Fields */}
          <div className="col-span-2">
            <p className="text-gray-600 font-medium">Address:</p>
            {isEdit ? (
              <>
                <input
                  className="border p-3 w-full rounded-lg mb-2 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                  type="text"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </>
            ) : (
              <p className="font-medium text-gray-800">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        {/* Other Information */}
        <p className="font-bold text-lg text-blue-900 mt-6 mb-2">
          OTHER INFORMATION
        </p>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="font-medium text-gray-800">{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="text-gray-600 font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
                type="date"
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
                value={userData.dob}
              />
            ) : (
              <p className="font-medium text-gray-800">{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-6 flex justify-start">
          {isEdit ? (
            <button
              className="bg-blue-500 text-white px-5 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
              onClick={() => setIsEdit(false)}
            >
              Save Information
            </button>
          ) : (
            <button
              className="bg-gray-700 text-white px-5 py-3 rounded-lg shadow-md hover:bg-gray-800 transition duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
