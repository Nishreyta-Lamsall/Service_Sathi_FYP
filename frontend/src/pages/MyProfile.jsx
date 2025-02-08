import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import {assets} from '../assets/assets'
import axios from "axios";
import {toast} from 'react-toastify'

const MyProfile = () => {
  
  const {userData, setUserData, token, backendUrl, loadUserProfileData} = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false);

  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()
      formData.append('name', userData.name)
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append('image', image)

      const {data} = await axios.post(backendUrl + '/api/user/update-profile', formData, {headers:{token}})

      if(data.success){
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    userData && (
      <div className="flex flex-col md:flex-row gap-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-2xl max-w-4xl mx-auto mt-16 mb-16">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          {isEdit ? (
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img className="w-36 rounded opacity-75"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img className="w-10 absolute bottom-12 right-12 opacity-35"
                  src={image ? '' : assets.upload_icon}
                  alt=""
                />
              </div>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg transform transition-all duration-500 hover:scale-110"
              src={userData.image}
              alt=""
            />
          )}
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Name Field */}
          {isEdit ? (
            <input
              className="bg-white text-3xl font-semibold w-full border p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="font-semibold text-3xl text-gray-800 hover:text-blue-600 transition-all duration-300">
              {userData.name}
            </p>
          )}

          <hr className="my-4 border-gray-300" />

          {/* Contact Information */}
          <p className="font-bold text-lg text-blue-600 mb-2">
            CONTACT INFORMATION
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 font-medium">Email ID:</p>
              <p className="font-medium text-blue-600 hover:text-blue-700 transition-all duration-300">
                {userData.email}
              </p>
            </div>

            <div>
              <p className="text-gray-600 font-medium">Phone:</p>
              {isEdit ? (
                <input
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="font-medium text-gray-800 hover:text-blue-600 transition-all duration-300">
                  {userData.phone}
                </p>
              )}
            </div>

            {/* Address Fields */}
            <div className="col-span-2">
              <p className="text-gray-600 font-medium">Address:</p>
              {isEdit ? (
                <>
                  <input
                    className="border p-3 w-full rounded-lg mb-2 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
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
                    className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
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
                <p className="font-medium text-gray-800 hover:text-blue-600 transition-all duration-300">
                  {userData.address.line1}
                  <br />
                  {userData.address.line2}
                </p>
              )}
            </div>
          </div>

          {/* Other Information */}
          <p className="font-bold text-lg text-blue-600 mt-6 mb-2">
            OTHER INFORMATION
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 font-medium">Gender:</p>
              {isEdit ? (
                <select
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="font-medium text-gray-800 hover:text-blue-600 transition-all duration-300">
                  {userData.gender}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-600 font-medium">Birthday:</p>
              {isEdit ? (
                <input
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300"
                  type="date"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  value={userData.dob}
                />
              ) : (
                <p className="font-medium text-gray-800 hover:text-blue-600 transition-all duration-300">
                  {userData.dob}
                </p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6 flex justify-start">
            {isEdit ? (
              <button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                onClick={updateUserProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
