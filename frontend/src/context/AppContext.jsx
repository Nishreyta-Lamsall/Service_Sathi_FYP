import { createContext } from "react";
import axios from 'axios';
import { useState } from "react";
import {toast} from 'react-toastify'
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = "NPR."

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [Services, setServices] = useState([])

    const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'): false)

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
    try{
      const {data} = await axios.get(backendUrl + '/api/service/list')
      if(data.success){
        setServices(data.Services)
      }else{
         toast.error(data.message)
      }

    } catch (error){
      console.log(error)
      toast.error(error.message)
    }
  }

  const loadUserProfileData = async () => {
    try {
      const {data} = await axios.get(backendUrl + '/api/user/get-profile', {headers:{token}})

      if(data.success){
        setUserData(data.userData)
      } else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

   const value = {
     Services,
     currencySymbol,
     token,
     setToken,
     backendUrl,
     userData,
     setUserData, 
     loadUserProfileData
   };


  useEffect(()=>{
    getServicesData()
  })

  useEffect(() => {
      if(token){
        loadUserProfileData()
      } else{
        setUserData(false)
      }
  }, [token])

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
