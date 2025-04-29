import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

// Category mapping for bilingual support
const categoryMapping = {
  "House Cleaning Services": {
    en: "House Cleaning Services",
    np: "घर सफाई सेवाहरू",
  },
  "Electrical Services": { en: "Electrical Services", np: "विद्युतीय सेवाहरू" },
  "Carpentry Services": { en: "Carpentry Services", np: "काठको काम सेवाहरू" },
  "Gardening Services": { en: "Gardening Services", np: "बगैंचा सेवाहरू" },
  "Plumbing Services": { en: "Plumbing Services", np: "प्लम्बिङ सेवाहरू" },
};

const EditService = () => {
  const { serviceId } = useParams();
  const { getServiceById, backendUrl, aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [serviceImg, setServiceImg] = useState(null);
  const [nameEn, setNameEn] = useState("");
  const [nameNp, setNameNp] = useState("");
  const [price, setPrice] = useState("");
  const [aboutEn, setAboutEn] = useState("");
  const [aboutNp, setAboutNp] = useState("");
  const [category, setCategory] = useState("House Cleaning Services"); // English key for dropdown
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      const data = await getServiceById(serviceId);
      if (data) {
        setNameEn(data.name.en);
        setNameNp(data.name.np);
        setPrice(data.price); // Single price
        setAboutEn(data.about.en);
        setAboutNp(data.about.np);
        setAvailable(data.available);
        setServiceImg(data.image);
        // Find the category key based on English value
        const selectedCategory = Object.keys(categoryMapping).find(
          (key) => categoryMapping[key].en === data.category.en
        );
        setCategory(selectedCategory || "House Cleaning Services");
      }
    };
    fetchService();
  }, [serviceId, getServiceById]);

  const handleFileChange = (e) => {
    setServiceImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedCategory = categoryMapping[category];
      const formData = new FormData();
      formData.append("nameEn", nameEn);
      formData.append("nameNp", nameNp);
      formData.append("categoryEn", selectedCategory.en);
      formData.append("categoryNp", selectedCategory.np);
      formData.append("aboutEn", aboutEn);
      formData.append("aboutNp", aboutNp);
      formData.append("price", Number(price)); // Single price
      formData.append("available", available);
      if (serviceImg instanceof File) {
        formData.append("image", serviceImg);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/admin/update-service/${serviceId}`,
        formData,
        { headers: { aToken, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success("Service updated successfully!");
        navigate("/service-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[700px] mx-auto h-[80vh] overflow-y-auto bg-white p-8 rounded-lg shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700 text-center">
        Edit Service
      </h2>

      {/* Upload Section */}
      <div className="flex flex-col items-center space-y-4">
        <label htmlFor="service-img" className="cursor-pointer">
          <img
            src={
              serviceImg && !(serviceImg instanceof File)
                ? serviceImg
                : serviceImg
                ? URL.createObjectURL(serviceImg)
                : "https://via.placeholder.com/100"
            }
            alt="Service"
            className="w-32 h-32 object-cover border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-blue-500 transition"
          />
        </label>
        <input
          type="file"
          id="service-img"
          onChange={handleFileChange}
          hidden
        />
        <p className="text-gray-600">Upload service image (optional)</p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Service Name (English)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
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
              type="text"
              value={nameNp}
              onChange={(e) => setNameNp(e.target.value)}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
              className="mt-1 w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              About Service (English)
            </label>
            <textarea
              value={aboutEn}
              onChange={(e) => setAboutEn(e.target.value)}
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
              value={aboutNp}
              onChange={(e) => setAboutNp(e.target.value)}
              placeholder="सेवाको बारेमा नेपालीमा लेख्नुहोस्"
              rows="3"
              required
              className="mt-1 w-full p-3 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none resize-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Available
            </label>
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="mt-1 w-4 h-4 accent-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          className={`w-full py-3 rounded-md font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-900 text-white hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Service"}
        </button>
      </div>
    </form>
  );
};

export default EditService;
