import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from "react-toastify";
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import {Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllBookings from './pages/Admin/AllBookings';
import AddService from './pages/Admin/AddService';
import ServicesList from './pages/Admin/ServicesList';

const App = () => {

  const {aToken} = useContext(AdminContext)
  return aToken ? (
    <div>
      <ToastContainer />
      <NavBar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-bookings" element={<AllBookings />} />
          <Route path="/add-service" element={<AddService />} />
          <Route path="/service-list" element={<ServicesList />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
}

export default App