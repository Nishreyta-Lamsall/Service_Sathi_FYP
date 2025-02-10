import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddProvider = () => {
  const [providerImg, setProviderImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Select a Category");
  const [services, setServices] = useState([]); // State to store available services
  const [selectedServices, setSelectedServices] = useState([]); // State to store selected services
  const [number, setNumber] = useState("");
  const [citizen, setCitizen] = useState("");
  const [experience, setExperience] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  useEffect(() => {
    // Fetch available services on component mount
    const fetchServices = async () => {
      try {
        const { data } = await axios.post(
          backendUrl + "/api/admin/all-services",
          {},
          {
            headers: { aToken },
          }
        );

        if (data.success) {
          setServices(data.services); // Assuming response is an array of service categories
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchServices();
  }, [backendUrl, aToken]);

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;

    // Find the selected service from the services array using the serviceId
    const selectedService = services.find((service) => service._id === value);

    if (checked) {
      // If the checkbox is checked, add the service with both `serviceId` and `serviceName`
      setSelectedServices((prev) => [
        ...prev,
        { serviceId: selectedService._id, serviceName: selectedService.name },
      ]);
    } else {
      // If the checkbox is unchecked, remove the service
      setSelectedServices((prev) =>
        prev.filter((service) => service.serviceId !== value)
      );
    }
  };

const onSubmitHandler = async (event) => {
  event.preventDefault();

  try {
    if (!providerImg) {
      return toast.error("Image not selected");
    }

    const formData = new FormData();
    formData.append("image", providerImg);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("category", category);
    formData.append("phone_number", JSON.stringify(number));
    formData.append("citizenship_number", citizen);
    formData.append("experience", experience);
    formData.append(
      "address",
      JSON.stringify({ line1: address1, line2: address2 })
    );

    // Append the entire services array as a JSON string
    formData.append("services", JSON.stringify(selectedServices));

    const { data } = await axios.post(
      backendUrl + "/api/admin/add-serviceprovider",
      formData,
      { headers: { aToken } }
    );

    if (data.success) {
      toast.success(data.message);
      // Reset form fields
      setProviderImg(null);
      setName("");
      setEmail("");
      setNumber("");
      setCitizen("");
      setExperience("");
      setAddress1("");
      setAddress2("");
      setSelectedServices([]);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-[700px] max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Add Service Provider
        </h2>

        {/* Upload Section */}
        <div className="flex flex-col items-center space-y-4">
          <label htmlFor="service-img" className="cursor-pointer">
            <img
              src={
                providerImg
                  ? URL.createObjectURL(providerImg)
                  : assets.upload_area
              }
              alt="Upload"
              className="w-32 h-32 object-cover border-2 border-dashed border-gray-300 rounded-md p-2 hover:border-blue-500 transition"
            />
          </label>
          <input
            onChange={(e) => setProviderImg(e.target.files[0])}
            type="file"
            id="service-img"
            hidden
          />
          <p className="text-gray-600">Upload Provider Picture</p>
        </div>

        {/* Input Fields (Two-Column Layout) */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Provider Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Name"
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Provider Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email"
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Experience
            </label>
            <input
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              type="text"
              placeholder="Experience"
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone Number
            </label>
            <input
              onChange={(e) => setNumber(e.target.value)}
              value={number}
              placeholder="Phone No."
              type="text"
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

        {/* Category & Citizenship */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            >
              <option>Select a category</option>
              <option>House Cleaning Services</option>
              <option>Electrical Services</option>
              <option>Carpentry Services</option>
              <option>Gardening Services</option>
              <option>Plumbing Services</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Citizenship Number
            </label>
            <input
              onChange={(e) => setCitizen(e.target.value)}
              value={citizen}
              type="text"
              placeholder="Citizenship No."
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Services
          </label>
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={service._id} // Store the serviceId as value
                  onChange={handleServiceChange}
                  checked={selectedServices.some(
                    (selectedService) =>
                      selectedService.serviceId === service._id
                  )}
                  className="w-4 h-4"
                />
                <label>{service.name}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-600">
            Address
          </label>
          <input
            onChange={(e) => setAddress1(e.target.value)}
            value={address1}
            type="text"
            placeholder="Address 1"
            required
            className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none mb-3"
          />
          <input
            onChange={(e) => setAddress2(e.target.value)}
            value={address2}
            type="text"
            placeholder="Address 2"
            required
            className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-blue-900 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Add Provider
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProvider;
