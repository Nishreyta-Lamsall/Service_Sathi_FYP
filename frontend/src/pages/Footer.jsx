import React, { useContext } from "react";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import twitter from "../assets/twitter.png";
import linkedin from "../assets/linkedin.png";
import { useTranslation } from "react-i18next";
import { HashLink } from "react-router-hash-link";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-[#1b1b1b] text-white py-8 px-4">
      {/* Container for all the contents */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-8 sm:space-y-0">
        {/* Left Section */}
        <div className="text-center sm:text-left">
          <p className="text-3xl font-bold">Service Sathi</p>
        </div>

        {/* Middle Section */}
        <div className="text-center sm:text-left">
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:underline">
                {t("footer.home")}
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline">
                {t("footer.aboutUs")}
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline">
                {t("footer.contactUs")}
              </a>
            </li>
            <li>
               <HashLink
                          to="/contact#testimonial" // Navigate to the Contact Us page and scroll to the testimonial section
                          smooth
                        >
              <a href="/contact" className="hover:underline">
                {t("home.hero.tetsimonialButton")}
              </a>
              </HashLink>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="text-center sm:text-left">
          <ul className="space-y-2">
            <li>{t("footer.contactNumber")}</li>
            <li>{t("footer.address")}</li>
            <li>{t("footer.country")}</li>
          </ul>
        </div>

        {/* Social Media Icons Section */}
        <div className="flex justify-center sm:justify-start space-x-6 mt-4 sm:mt-0">
          <img
            src={instagram}
            alt="Instagram"
            className="w-6 h-6 cursor-pointer hover:opacity-80"
          />
          <img
            src={facebook}
            alt="Facebook"
            className="w-6 h-6 cursor-pointer hover:opacity-80"
          />
          <img
            src={twitter}
            alt="Twitter"
            className="w-6 h-6 cursor-pointer hover:opacity-80"
          />
          <img
            src={linkedin}
            alt="LinkedIn"
            className="w-6 h-6 cursor-pointer hover:opacity-80"
          />
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 text-center">
        <hr className="border-t-1 border-white" />
        <p className="mt-4 text-sm font-light">{t("footer.copyright")}</p>
      </div>
    </div>
  );
};

export default Footer;
