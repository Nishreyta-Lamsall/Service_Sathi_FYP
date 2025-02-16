import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import profilePic from "../assets/profile_picc.png";
import dropdownIcon from "../assets/dropdown_icon.png";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const NavBar = () => {
  const [language, setLanguage] = useState("English"); // Default language is English
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu toggle
  const navigate = useNavigate();

  const {token, setToken, userData} = useContext(AppContext)

  const logout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (confirmLogout) {
      setToken(false);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  // Handle language selection
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsOpen(false); // Close the dropdown after selection
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="sticky top-0 z-10 bg-white shadow-md">
      <div className="flex justify-between items-center h-20 px-6 md:px-11">
        {/* Left Side */}
        <div className="flex items-center gap-7">
          <Link to="/">
            <h1 className="text-3xl font-extrabold text-[#2D64C5]">
              ServiceSathi
            </h1>
          </Link>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <ul
          className={`md:flex gap-10 hidden transition-all duration-300 ease-in-out`}
        >
          <li className="cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/about">About Us</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/services">All Services</Link>
          </li>
          <li className="cursor-pointer">
            <Link to="/contact">Contact Us</Link>
          </li>
        </ul>

        {/* Right Side - Language & Login */}
        <div className="pr-6 text-sm flex items-center gap-4">
          {/* Language Button */}
          <div className="relative">
            <button
              className="bg-white text-black border-2 border-black py-1.5 pl-3 pr-1 rounded-full focus:outline-none"
              onClick={toggleDropdown}
            >
              {language} <span className="ml-2">&#9662;</span>
            </button>

            {/* Dropdown menu */}
            {isOpen && (
              <div className="absolute left-0 mt-2 w-[7rem] bg-white shadow-lg rounded-md z-10">
                <ul className="text-black">
                  <li
                    className="py-2 pl-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLanguageChange("English")}
                  >
                    English
                  </li>
                  <li
                    className="py-2 pl-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLanguageChange("Nepali")}
                  >
                    Nepali
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Login Button */}
          {token && userData ? (
            <div className="flex items-center gap-3 group relative">
              <img
                src={userData.image}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <img src={dropdownIcon} alt="Dropdown" className="w-2.5 h-4" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("my-bookings")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Bookings
                  </p>
                  <p
                    onClick={() => navigate("order-history")}
                    className="hover:text-black cursor-pointer"
                  >
                    Order History
                  </p>
                  <p
                    onClick={logout}
                    className="hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button className="text-black py-1.5 pl-3 pr-3 rounded-full border-2 border-black text-sm">
              <Link to="/login">Login</Link>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center gap-5 py-4 bg-white shadow-md">
          <li>
            <Link to="/" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={toggleMenu}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/services" onClick={toggleMenu}>
              All Services
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={toggleMenu}>
              Contact Us
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
