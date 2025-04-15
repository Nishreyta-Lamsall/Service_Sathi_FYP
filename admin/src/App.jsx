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
import EditService from "./pages/Admin/EditService";
import EditProvider from "./pages/Admin/EditProvider";
import Contact from "./pages/Admin/Contact";
import Testimonials from "./pages/Admin/Testimonial";
import SubscribedUsers from "./pages/Admin/SubscribedUsers";
import AllUsers from "./pages/Admin/AllUsers";

const App = () => {
  const { aToken } = useContext(AdminContext);

  return aToken ? (
    <div className="min-h-screen">
      <ToastContainer />
      <NavBar />

      {/* Sidebar + Main Content Layout */}
      <div className="flex h-screen">
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
            <Route path="/edit-service/:serviceId" element={<EditService />} />
            <Route path="/edit-provider/:id" element={<EditProvider />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonial" element={<Testimonials />} />
            <Route path="/subscribed-users" element={<SubscribedUsers />} />
            <Route path="/all-users" element={<AllUsers />} />
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
