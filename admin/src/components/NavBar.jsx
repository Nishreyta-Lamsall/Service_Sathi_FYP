import React from 'react'
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import {useNavigate} from 'react-router-dom';

const NavBar = () => {

    const {aToken, setAToken} = useContext(AdminContext)

    const navigate = useNavigate()

    const logout = () => {
        navigate('/')
        aToken && setAToken('')
        aToken && localStorage.removeItem('aToken')
    }

  return (
    <div className="flex justify-between items-center px-4 sm:px-1 py-3 sticky top-0 z-10 bg-white shadow-md">
      {/* Left Side */}
      <div className="flex items-center gap-2 text-xs ml-16">
        <h1 className="text-3xl font-extrabold text-[#2D64C5]">ServiceSathi</h1>
        <p className="mt-2 border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken && "Admin"}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-blue-900 text-white text-sm px-10 py-2 rounded-full mr-16"
      >
        Logout
      </button>
    </div>
  );
}

export default NavBar