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
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [number, setNumber] = useState("");
  const [citizen, setCitizen] = useState("");
  const [experience, setExperience] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/admin/all-services`,
          {},
          { headers: { aToken } }
        );
        if (data.success) {
          setServices(data.services);
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
    const selectedService = services.find((service) => service._id === value);

    if (checked) {
      setSelectedServices((prev) => [
        ...prev,
        {
          serviceId: selectedService._id,
          serviceName: selectedService.name.en,
        },
      ]);
    } else {
      setSelectedServices((prev) =>
        prev.filter((service) => service.serviceId !== value)
      );
    }
  };

  const validatePhoneNumber = (phone) => {
    const regex = /^(97|98)[0-9]{7,8}$/;
    return regex.test(phone);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!providerImg) {
        return toast.error("Image not selected");
      }

      if (!validatePhoneNumber(number)) {
        return toast.error(
          "Please enter a valid Nepali phone number (e.g., 9812345678)"
        );
      }

      const formData = new FormData();
      formData.append("image", providerImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("category", category);
      formData.append("phone_number", number);
      formData.append("citizenship_number", citizen);
      formData.append("experience", experience);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );
      formData.append("services", JSON.stringify(selectedServices));

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-serviceprovider`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
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
    <div className="flex justify-center items-center h-[97vh]">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-[700px] h-[85vh] overflow-y-auto p-6 rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-700 text-center">
          Add Service Provider
        </h2>

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
              placeholder="9812345678"
              type="text"
              required
              className="w-full p-2 bg-gray-100 rounded-md focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

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
              <option value="Select a Category">Select a category</option>
              <option value="House Cleaning Services">
                House Cleaning Services
              </option>
              <option value="Electrical Services">Electrical Services</option>
              <option value="Carpentry Services">Carpentry Services</option>
              <option value="Gardening Services">Gardening Services</option>
              <option value="Plumbing Services">Plumbing Services</option>
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

        <div>
          <label className="block text-sm font-medium text-gray-600">
            Services
          </label>
          <div className="space-y-2">
            {services.map((service) => (
              <div key={service._id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={service._id}
                  onChange={handleServiceChange}
                  checked={selectedServices.some(
                    (selectedService) =>
                      selectedService.serviceId === service._id
                  )}
                  className="w-4 h-4"
                />
                <label>{service.name.en}</label>
              </div>
            ))}
          </div>
        </div>

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

        <div className="text-center">
          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-md font-medium transition"
          >
            Add Provider
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProvider;
