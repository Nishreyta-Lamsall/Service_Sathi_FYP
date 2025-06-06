import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [services, setServices] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAllServices = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-services",
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

  const getAllServiceProviders = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-serviceProviders",
        {},
        { headers: { aToken } }
      );
      if (data.success) {
        setServiceProviders(data.serviceProviders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeAvailability = async (serviceId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { serviceId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllServices();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getServiceById = async (serviceId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/get-service/${serviceId}`,
        { headers: { aToken } }
      );

      if (data.success) {
        return data.service;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const getServiceProviderById = async (providerId) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/admin/get-serviceprovider/${providerId}`,
        { headers: { aToken } }
      );

      if (data.success) {
        return data.serviceProvider;
      } else {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      toast.error(error.message);
      return null;
    }
  };

  const changeProviderAvailability = async (serviceProviderId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-provider-availability",
        { serviceProviderId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllServiceProviders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/bookings", {
        headers: { aToken },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-booking",
        { bookingId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    services,
    getAllServices,
    changeAvailability,
    changeProviderAvailability,
    bookings,
    setBookings,
    getAllBookings,
    cancelBooking,
    dashData,
    getDashData,
    serviceProviders,
    getAllServiceProviders,
    getServiceById,
    getServiceProviderById
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
