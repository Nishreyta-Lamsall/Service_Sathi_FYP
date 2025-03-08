import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../context/LanguageContext"; // Import the context
import dropdownIcon from "../assets/dropdown_icon.png";
import { AppContext } from "../context/AppContext";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const { language, handleLanguageChange } = useContext(LanguageContext); // Get language context
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    const confirmLogout = window.confirm(t("logout"));
    if (confirmLogout) {
      setToken(false);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <nav className="sticky top-0 z-20 bg-white shadow-md">
      <div className="flex justify-between items-center h-20 px-6 md:px-11">
        <div className="flex items-center gap-7">
          <Link to="/">
            <h1 className="text-3xl font-bold text-black">ServiceSathi</h1>
          </Link>
        </div>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <ul className="md:flex gap-10 hidden transition-all duration-300 ease-in-out font-normal">
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

        <div className="pr-6 text-sm flex items-center gap-4">
          <div className="relative">
            <button
              className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out py-2 pl-3 pr-1 rounded-full focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={t("languageSwitch")}
            >
              {language} <span className="ml-2">&#9662;</span>
            </button>

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
                    {t("myProfile")}
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
            <button className="text-black py-1.5 pl-3 pr-3 rounded-full border-2 border-black text-sm">
              <Link to="/login">{t("login")}</Link>
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <ul className="md:hidden flex flex-col items-center gap-5 py-4 bg-white shadow-md">
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
