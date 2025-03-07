import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Login from './pages/Login';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import MyProfile from './pages/MyProfile';
import MyBookings from './pages/MyBookings';
import Bookings from './pages/Bookings';
import NavBar from './components/NavBar';
import Footer from './pages/Footer';
import Services from './pages/Services';
import { ToastContainer, toast } from "react-toastify";
import OrderHistory from './pages/OrderHistory';
import Subscriptions from './pages/Subscriptions';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PaymentVerify from './pages/PaymentVerify';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:category" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/bookings/:serviceId" element={<Bookings />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route
          path="/subscription-payment-verify"
          element={<PaymentVerify />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App