import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext"; // Import the context
import dropdownIcon from "../assets/dropdown_icon.png";
import { AppContext } from "../context/AppContext";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

const NavBar = () => {
  const { t } = useTranslation();
  const { language, handleLanguageChange } = useContext(LanguageContext);
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

const logout = () => {
  Swal.fire({
    title: t("logout"),
    text: t("logout_confirmation"),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: t("yes_logout"),
    cancelButtonText: t("cancel"),
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      setToken(false);
      localStorage.removeItem("token");
      navigate("/");
    }
  });
};

  return (
    <nav className="sticky top-0 z-20 bg-white shadow-md">
      <div className="flex justify-between items-center h-20 px-6 sm:px-6 md:px-11 ml-3">
        <Link to="/">
          <h1 className="text-xl sm:text-3xl font-bold text-black">
            ServiceSathi
          </h1>
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <ul className="hidden md:flex gap-6 lg:gap-10 text-sm lg:text-base">
          <li>
            <NavLink to="/">{t("navbarHome")}</NavLink>
          </li>
          <li>
            <NavLink to="/about">{t("about")}</NavLink>
          </li>
          <li>
            <NavLink to="/services">{t("services")}</NavLink>
          </li>
          <li>
            <NavLink to="/contact">{t("contact")}</NavLink>
          </li>
        </ul>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <button
              className="bg-white text-black border border-black hover:bg-black hover:text-white transition-all py-1 px-2 sm:py-2 sm:px-3 rounded-full text-xs sm:text-sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={t("languageSwitch")}
            >
              {language} <span className="ml-1 sm:ml-2">&#9662;</span>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-24 sm:w-28 bg-white shadow-md rounded-md z-10">
                <ul className="text-black text-xs sm:text-sm">
                  <li
                    className="pl-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLanguageChange("English")}
                  >
                    English
                  </li>
                  <li
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLanguageChange("Nepali")}
                  >
                    नेपाली
                  </li>
                </ul>
              </div>
            )}
          </div>

          {token && userData ? (
            <div className="flex items-center gap-3 group relative cursor-pointer">
              <img
                src={userData.image}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover transition-transform duration-300 transform group-hover:scale-110"
              />
              <img
                src={dropdownIcon}
                alt="Dropdown"
                className="w-2.5 h-4 transition-transform duration-300 transform group-hover:rotate-180"
              />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block ">
                <div className="min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="hover:text-black transition-colors duration-300"
                  >
                    {t("myProfilee")}
                  </p>
                  <p
                    onClick={() => navigate("my-bookings")}
                    className="hover:text-black transition-colors duration-300"
                  >
                    {t("myBookings")}
                  </p>
                  <p
                    onClick={() => navigate("order-history")}
                    className="hover:text-black transition-colors duration-300"
                  >
                    {t("orderHistory")}
                  </p>
                  {userData?.isSubscribed && (
                    <p
                      onClick={() => navigate("my-subscription")}
                      className="hover:text-black transition-colors duration-300"
                    >
                      {t("mySubscription")}
                    </p>
                  )}
                  <p
                    className="hover:text-black transition-colors duration-300"
                    onClick={logout}
                  >
                    {t("logout")}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button className="text-black border border-black px-3 py-1.5 rounded-full text-xs sm:text-sm">
              <Link to="/login">{t("login")}</Link>
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center gap-3 py-4 bg-white shadow-md">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              {t("navbarHome")}
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              {t("about")}
            </Link>
          </li>
          <li>
            <Link to="/services" onClick={() => setMenuOpen(false)}>
              {t("services")}
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              {t("contact")}
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
