import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const categoryMapping = {
  "House Cleaning Services": {
    en: "House Cleaning Services",
    np: "घर सफाई सेवाहरू",
  },
  "Electrical Services": {
    en: "Electrical Services",
    np: "विद्युतीय सेवाहरू",
  },
  "Carpentry Services": {
    en: "Carpentry Services",
    np: "काठको काम सेवाहरू",
  },
  "Gardening Services": {
    en: "Gardening Services",
    np: "बगैंचा सेवाहरू",
  },
  "Plumbing Services": {
    en: "Plumbing Services",
    np: "प्लम्बिङ सेवाहरू",
  },
};

const AddService = () => {
  const [serviceImg, setServiceImg] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameNp, setNameNp] = useState("");
  const [price, setPrice] = useState("");
  const [aboutEn, setAboutEn] = useState("");
  const [aboutNp, setAboutNp] = useState("");
  const [category, setCategory] = useState("House Cleaning Services");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!serviceImg) {
      return toast.error("Please select an image");
    }

    if (!aToken) {
      return toast.error("Authentication token is missing");
    }

    setLoading(true);

    try {
      const selectedCategory = categoryMapping[category];
      if (!selectedCategory) {
        throw new Error("Invalid category selected");
      }

      const formattedPrice = parseFloat(price || 0).toFixed(2);
      if (!/^[0-9]+(\.[0-9]{2})?$/.test(formattedPrice)) {
        throw new Error("Price must have exactly 2 decimal places");
      }

      const formData = new FormData();
      formData.append("nameEn", nameEn.trim());
      formData.append("nameNp", nameNp.trim());
      formData.append("image", serviceImg);
      formData.append("price", formattedPrice);
      formData.append("aboutEn", aboutEn.trim());
      formData.append("aboutNp", aboutNp.trim());
      formData.append("categoryEn", selectedCategory.en);
      formData.append("categoryNp", selectedCategory.np);

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-service`,
        formData,
        {
          headers: {
            aToken,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setServiceImg(null);
        setNameEn("");
        setNameNp("");
        setPrice("");
        setAboutEn("");
        setAboutNp("");
        setCategory("House Cleaning Services");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error adding service";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="w-[700px] mx-auto bg-white p-8 rounded-lg h-[85vh] overflow-y-auto shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Add Service
      </h2>

      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="service-img" className="cursor-pointer">
          <img
            src={
              serviceImg ? URL.createObjectURL(serviceImg) : assets.upload_area
            }
            alt="Service"
            className="w-32 h-32 object-cover border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-blue-500 transition"
          />
        </label>
        <input
          onChange={(e) => setServiceImg(e.target.files[0])}
          type="file"
          id="service-img"
          accept="image/*"
          hidden
        />
        <p className="text-gray-600">Upload service image</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Service Name (English)
            </label>
            <input
              onChange={(e) => setNameEn(e.target.value)}
              value={nameEn}
              type="text"
              placeholder="Enter name in English"
              required
              className="mt-1 w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Service Name (Nepali)
            </label>
            <input
              onChange={(e) => setNameNp(e.target.value)}
              value={nameNp}
              type="text"
              placeholder="नेपालीमा नाम प्रविष्ट गर्नुहोस्"
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
              {Object.keys(categoryMapping).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              onChange={handlePriceChange}
              value={price}
              type="text"
              placeholder="Enter price (e.g., 2300.00)"
              required
              className="mt-1 w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              About Service (English)
            </label>
            <textarea
              onChange={(e) => setAboutEn(e.target.value)}
              value={aboutEn}
              placeholder="Write about service in English"
              rows="3"
              required
              className="mt-1 w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none resize-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              About Service (Nepali)
            </label>
            <textarea
              onChange={(e) => setAboutNp(e.target.value)}
              value={aboutNp}
              placeholder="सेवाको बारेमा नेपालीमा लेख्नुहोस्"
              rows="3"
              required
              className="mt-1 w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          className={`w-full py-3 rounded-md font-medium transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black text-white"
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
