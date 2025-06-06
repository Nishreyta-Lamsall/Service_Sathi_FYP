import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";

const EditProvider = () => {
  const { getServiceProviderById, backendUrl, aToken } =
    useContext(AdminContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    citizenship_number: "",
    experience: "",
    category: "",
    services: [],
    address: { line1: "", line2: "" },
    image: null,
  });
  const [allServices, setAllServices] = useState([]); 
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchProviderAndServices = async () => {
      try {

        const provider = await getServiceProviderById(id);
        if (provider) {
          setFormData({
            ...provider,
            address: provider.address || { line1: "", line2: "" },
            services: provider.services || [],
          });
        }

        const { data } = await axios.post(
          `${backendUrl}/api/admin/all-services`,
          {},
          { headers: { aToken } }
        );
        if (data.success) {
          setAllServices(data.services);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchProviderAndServices();
  }, [id, backendUrl, aToken, getServiceProviderById]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "line1" || name === "line2") {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    const selectedService = allServices.find(
      (service) => service._id === value
    );

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        services: [
          ...prev.services,
          {
            serviceId: selectedService._id,
            serviceName: selectedService.name.en, 
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.filter(
          (service) => service.serviceId !== value
        ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "address" || key === "services") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === "image" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const { data } = await axios.put(
        `${backendUrl}/api/admin/update-serviceprovider/${id}`,
        formDataToSend,
        { headers: { aToken, "Content-Type": "multipart/form-data" } }
      );

      if (data.success) {
        toast.success("Service provider updated successfully!");
        navigate("/provider-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] overflow-auto p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">
        Edit Service Provider
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="citizenship_number"
            value={formData.citizenship_number}
            onChange={handleChange}
            placeholder="Citizenship Number"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            required
            className="p-2 border rounded w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="line1"
            value={formData.address.line1}
            onChange={handleChange}
            placeholder="Address Line 1"
            required
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            name="line2"
            value={formData.address.line2}
            onChange={handleChange}
            placeholder="Address Line 2"
            className="p-2 border rounded w-full"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-600">
            Services
          </label>
          <div className="max-h-40 overflow-y-auto border p-2 rounded">
            {allServices.map((service) => (
              <div key={service._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={service._id}
                  onChange={handleServiceChange}
                  checked={formData.services.some(
                    (s) => s.serviceId === service._id
                  )}
                  className="w-4 h-4"
                />
                <label>{service.name.en}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center space-y-3">
          {formData.image && (
            <img
              src={
                formData.image instanceof File
                  ? URL.createObjectURL(formData.image)
                  : formData.image
              }
              alt="Provider"
              className="w-24 h-24 object-cover rounded border"
            />
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="text-center">
          <button
            className={`w-full py-3 rounded-md font-medium transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-900 text-white hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Service Provider"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProvider;
