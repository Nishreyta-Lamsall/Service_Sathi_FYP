import React, { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import {toast} from 'react-toastify'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(backendUrl + "/api/admin/login", {
        email,
        password,
      });
      console.log(data); 
      if (data.success) {
        localStorage.setItem('aToken',data.token)
        setAToken(data.token); 
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error logging in", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={onSubmitHandler}
        className="max-w-96 w-full p-6 bg-white rounded-lg shadow-lg"
      >
        <div className="text-center mb-6">
          <p className="text-2xl font-semibold text-gray-700">Admin Login</p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-600 font-medium mb-2"
          >
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)} 
            value={email}
            type="email"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-600 font-medium mb-2"
          >
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)} 
            value={password}
            type="password"
            id="password"
            className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
