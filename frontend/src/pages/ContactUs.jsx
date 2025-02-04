import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-16 px-6">
      <div className="bg-gradient-to-r from-blue-50 to-gray-100 shadow-xl rounded-lg p-8 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Information */}
        <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left lg:-mt-16 lg:ml-12">
          <div className="flex items-center justify-center w-36 h-36 bg-blue-200 rounded-full">
            <i class="fas fa-envelope text-7xl"></i>
          </div>
          <h3 className="text-3xl font-bold mt-6">Contact the Help Team</h3>
          <ul className="mt-6 text-gray-600 space-y-3">
            <li className="flex items-center gap-2">
              <span className="text-blue-600">&#128205;</span>
              Balaju, Kathmandu
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">&#128222;</span>
              +977 9851097545
            </li>
            <li className="flex items-center gap-2">
              <span className="text-blue-600">&#9993;</span>
              servicesathi.business@gmail.com
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <form className="bg-gray-50 p-8 rounded-lg shadow-md space-y-6">
          <h2 className="text-3xl font-bold text-blue-600 text-center">
            Contact Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="First Name*"
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="text"
              placeholder="Last Name*"
              className="border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email*"
            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="tel"
            placeholder="Phone number*"
            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <textarea
            placeholder="Your message..."
            rows="5"
            className="border border-gray-300 rounded-lg w-full p-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
export default ContactUs;
