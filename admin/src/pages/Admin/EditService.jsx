import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const EditService = () => {
  const { serviceId } = useParams();
  const { getServiceById, backendUrl, aToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const [serviceImg, setServiceImg] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("House Cleaning Services");
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      const data = await getServiceById(serviceId);
      if (data) {
        setName(data.name);
        setCategory(data.category);
        setAbout(data.about);
        setPrice(data.price);
        setAvailable(data.available);
        setServiceImg(data.image);
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
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("about", about);
      formData.append("price", price);
      formData.append("available", available);
      if (serviceImg instanceof File) {
        formData.append("image", serviceImg);
      }

      const { data } = await axios.put(
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
      toast.error("Error updating service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[700px] mx-auto overflow-y-auto bg-white p-8 rounded-lg shadow-lg space-y-6"
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
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              About Service
            </label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
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
