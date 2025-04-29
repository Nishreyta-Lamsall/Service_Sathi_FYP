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
      <div className="flex items-center gap-2 text-xs ml-16">
        <h1 className="text-3xl font-extrabold text-black">ServiceSathi</h1>
        
      </div>
      <button
        onClick={logout}
        className="bg-black text-white text-sm px-10 py-2 rounded-full mr-16"
      >
        Logout
      </button>
    </div>
  );
}

export default NavBar