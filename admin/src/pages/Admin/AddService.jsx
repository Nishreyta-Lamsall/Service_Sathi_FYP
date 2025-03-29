import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddService = () => {
  const [serviceImg, setServiceImg] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("House Cleaning Services");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!serviceImg) {
      return toast.error("Image not selected");
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", serviceImg);
      formData.append("price", Number(price));
      formData.append("about", about);
      formData.append("category", category);

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-service",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setServiceImg(false);
        setName("");
        setPrice("");
        setAbout("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            "Something went wrong. Please try again."
        );
      } else if (error.request) {
        toast.error(
          "No response from the server. Please check your internet connection."
        );
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-[700px] mx-auto bg-white p-8 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Add Service
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="service-img" className="cursor-pointer">
          <img
            src={
              serviceImg ? URL.createObjectURL(serviceImg) : assets.upload_area
            }
            alt=""
            className="w-32 h-32 object-cover border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-blue-500 transition"
          />
        </label>
        <input
          onChange={(e) => setServiceImg(e.target.files[0])}
          type="file"
          id="service-img"
          hidden
        />
        <p className="text-gray-600">Upload service image</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Service Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter name"
              required
              className="mt-1 w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Service Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
              className="mt-1 w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option value="House Cleaning Services">
                House Cleaning Services
              </option>
              <option value="Electrical Services">Electrical Services</option>
              <option value="Carpentry Services">Carpentry Services</option>
              <option value="Gardening Services">Gardening Services</option>
              <option value="Plumbing Services">Plumbing Services</option>
            </select>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="Enter price"
              required
              className="mt-1 w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              About Service
            </label>
            <textarea
              onChange={(e) => setAbout(e.target.value)}
              value={about}
              placeholder="Write about service"
              rows="5"
              required
              className="mt-1 w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          className={`w-full py-3 rounded-md font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white "
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Service"}
        </button>
      </div>
    </form>
  );
};

export default AddService;
