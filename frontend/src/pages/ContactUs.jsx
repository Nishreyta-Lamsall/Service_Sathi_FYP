import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const { t } = useTranslation();
  const [successMessage, setSuccessMessage] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const { backendUrl, token, userData } = useContext(AppContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (event) => {
    setRating(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/admin/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage(t("contactUs.successMessage"));
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setSuccessMessage(t("contactUs.errorMessage.failed"));
      }
    } catch (error) {
      setSuccessMessage(t("contactUs.errorMessage.error"));
    }

    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };

  const handleSubmitTestimonial = async (event) => {
    event.preventDefault();

    if (!userData || !userData.email) {
      toast.error(t("toastMessage.errorSubmittingTestimonial"));
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/user/addtestimonial`,
        {
          message,
          rating,
          userId: userData._id,
        },
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(t("toastMessage.testimonialSuccessful"));
        setRating("");
        setMessage("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
      toast.error(t("toastMessage.testimonialFailure"));
    }
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center py-16 px-6">
      <div className="bg-[#eeeef0] shadow-xl rounded-lg p-8 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left lg:-mt-16 lg:ml-12">
          <div className="flex items-center justify-center w-36 h-36 bg-gray-300 rounded-full">
            <i className="fas fa-envelope text-7xl"></i>
          </div>
          <h3 className="text-3xl font-bold mt-6">
            {t("contactUs.contactHelpTeam")}
          </h3>
          <ul className="mt-6 text-gray-600 space-y-3">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">📍</span>
              {t("contactUs.address")}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">📞</span>
              {t("contactUs.phone")}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">✉</span>
              {t("contactUs.email")}
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6"
        >
          <h2 className="text-3xl font-semibold text-center">
            {t("contactUs.contactus")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t("contactUs.form.firstName")}
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t("contactUs.form.lastName")}
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-1 focus:ring-gray-500"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("contactUs.form.email")}
            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-1 focus:ring-gray-500"
            required
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t("contactUs.form.phone")}
            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-1 focus:ring-gray-500"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t("contactUs.form.message")}
            rows="5"
            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-1 focus:ring-gray-500"
            required
          ></textarea>

          <div className="flex justify-center">
            <button
              type="submit"
              className="mt-5 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300"
            >
              {t("contactUs.form.submitButton")}
            </button>
          </div>

          {successMessage && (
            <p className="text-center text-blue-600 font-semibold mt-4">
              {successMessage}
            </p>
          )}
        </form>

        {/* Horizontal Rule Separator */}
        <hr className="col-span-full border-t-2 border-gray-300 my-8" />

        {/* Testimonial Section */}
        <div
          id="testimonial"
          className="col-span-full p-5 bg-gray-100 rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold text-center mb-4">
            {t("contactUs.submitTestimonial")}
          </h2>
          <form onSubmit={handleSubmitTestimonial} className="space-y-4">
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contactUs.rating")}
              </label>
              <input
                type="number"
                id="rating"
                min="1"
                max="5"
                value={rating}
                onChange={handleRatingChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                {t("contactUs.yourMessage")}
              </label>
              <textarea
                id="message"
                value={message}
                onChange={handleMessageChange}
                className="mt-1 p-2 w-full h-32 border border-gray-300 rounded-md"
                placeholder={t("contactUs.placeholderMessage")}
                required
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="mt-5 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white px-6 py-2.5 rounded-xl hover:scale-105 transition-all duration-300"
              >
                {t("contactUs.submitButton")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
