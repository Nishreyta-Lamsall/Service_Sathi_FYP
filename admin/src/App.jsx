import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AdminContext } from "./context/AdminContext";
import Login from "./pages/Login";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Admin/Dashboard";
import AllBookings from "./pages/Admin/AllBookings";
import AddService from "./pages/Admin/AddService";
import ServicesList from "./pages/Admin/ServicesList";
import AddProvider from "./pages/Admin/AddProvider";
import ProvidersList from "./pages/Admin/ProvidersList";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className="min-h-screen">
      <ToastContainer />
      <NavBar />

      {/* Sidebar + Main Content Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar (Fixed Width & No Shrinking) */}
        <div className="w-56 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content (Takes Remaining Space) */}
        <div className="flex-grow p-5">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-bookings" element={<AllBookings />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="/service-list" element={<ServicesList />} />
            <Route path="/add-provider" element={<AddProvider />} />
            <Route path="/provider-list" element={<ProvidersList />} />
          </Routes>
        </div>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
