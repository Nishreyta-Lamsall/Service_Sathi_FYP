import { createContext } from "react";
import axios from 'axios';
import { useState } from "react";
import {toast} from 'react-toastify'
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "NPR.";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [Services, setServices] = useState([]);

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
    image: "",
  });

  const getServicesData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/service/list");
      if (data.success) {
        setServices(data.Services);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to subscribe user to a plan
  const subscribeUser = async (userId, subscriptionId, plan) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/subscribe/${userId}`,
        {
          subscriptionId,
          plan,
        },
        {
          headers: { token },
        }
      );
      if (data.message) {
        // Update user data with the new subscription info
        setUserData({
          ...userData,
          isSubscribed: true,
          subscription: data.subscription,
          subscriptionPlan: plan,
        });
        return data; // Return the data for further use if needed
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    Services,
    getServicesData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    subscribeUser,
  };

  useEffect(() => {
    getServicesData();
  });

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
