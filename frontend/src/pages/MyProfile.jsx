import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const { t } = useTranslation();
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(t("profileUpdateSuccess"));
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(t("profileUpdateFailed"));
      }
    } catch (error) {
      console.log(error);
      toast.error(t("profileUpdateError"));
    }
  };

  return (
    userData && (
      <div className="flex flex-col md:flex-row gap-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl rounded-2xl max-w-4xl mx-auto mt-16 mb-16">
        {/* Left Section - Image */}
        <div className="w-full md:w-1/3 flex justify-center items-center">
          {isEdit ? (
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img
                  className="w-36 rounded opacity-75"
                  src={image ? URL.createObjectURL(image) : userData.image}
                  alt=""
                />
                <img
                  className="w-10 absolute bottom-12 right-12 opacity-35"
                  src={image ? "" : assets.upload_icon}
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
              alt="Profile"
            />
          )}
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-2/3 space-y-6">
          {/* Name Field */}
          {isEdit ? (
            <input
              className="bg-white text-3xl font-semibold w-full border p-3 rounded-lg shadow-sm focus:ring-1 focus:ring-gray-600 outline-none transition-all duration-300"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="text-3xl font-semibold text-black mb-6">
              {userData.name}
            </p>
          )}

          <hr className="my-4 border-gray-300" />

          {/* Contact Information */}
          <p className="font-medium text-lg text-black mb-2">
            {t("myProfile.contactInformation")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Email */}
            <div className="col-span-1">
              <p className="text-gray-900">{t("myProfile.emailId")}</p>
              <p className="text-blue-700 transition-all duration-300">
                {userData.email}
              </p>
            </div>

            {/* Phone Number */}
            <div className="col-span-1">
              <p className="text-gray-900">{t("myProfile.phone")}</p>
              {isEdit ? (
                <input
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-1 focus:ring-gray-600 outline-none transition-all duration-300"
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              ) : (
                <p className="text-gray-500 hover:text-gray-800 transition-all duration-300">
                  {userData.phone}
                </p>
              )}
            </div>
          </div>
          <hr className="my-4 border-gray-300" />

          {/* Address Fields */}
          <div className="col-span-2">
            <p className="text-gray-900">{t("myProfile.address")}</p>
            {isEdit ? (
              <>
                <input
                  className="border p-3 w-full rounded-lg mb-2 shadow-sm focus:ring-1 focus:ring-gray-600 outline-none transition-all duration-300"
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
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-1 focus:ring-gray-600 outline-none transition-all duration-300"
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
              <p className="text-gray-500 hover:text-gray-800 transition-all duration-300">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
          <hr className="my-4 border-gray-300" />

          {/* Other Information */}
          <p className="font-medium text-lg text-black mt-6 mb-2">
            {t("myProfile.otherInformation")}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-900">{t("myProfile.gender")}</p>
              {isEdit ? (
                <select
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-1 focus:ring-gray-600 outline-none transition-all duration-300"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                >
                  <option value="Male">{t("myProfile.male")}</option>
                  <option value="Female">{t("myProfile.female")}</option>
                </select>
              ) : (
                <p className="text-gray-500 hover:text-gray-800 transition-all duration-300">
                  {userData.gender}
                </p>
              )}
            </div>

            <div>
              <p className="text-gray-900">{t("myProfile.birthday")}</p>
              {isEdit ? (
                <input
                  className="border p-3 w-full rounded-lg shadow-sm focus:ring-1 focus:ring-gray-600 outline-none transition-all duration-300"
                  type="date"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  value={userData.dob}
                />
              ) : (
                <p className="text-gray-500 hover:text-gray-800 transition-all duration-300">
                  {userData.dob}
                </p>
              )}
            </div>
          </div>
          <hr className="my-4 border-gray-300" />

          {/* Edit Button */}
          <div className="mt-6 flex justify-start">
            {isEdit ? (
              <button
                className="bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-2.5 pr-6 rounded-xl hover:scale-105 transition-all duration-300"
                onClick={updateUserProfileData}
              >
                {t("myProfile.saveInformation")}
              </button>
            ) : (
              <button
                className="bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-2.5 pr-6 rounded-xl hover:scale-105 transition-all duration-300"
                onClick={() => setIsEdit(true)}
              >
                {t("myProfile.edit")}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default MyProfile;
