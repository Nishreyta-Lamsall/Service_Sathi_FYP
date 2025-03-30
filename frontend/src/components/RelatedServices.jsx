import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RelatedServices = ({ category, serviceId }) => {
  const { Services } = useContext(AppContext);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Dynamically determine current language
  const currentLang = i18n.language === "Nepali" ? "np" : "en";
  console.log(
    "Current Language in RelatedServices:",
    i18n.language,
    "Using:",
    currentLang
  );

  const [relServices, setRelServices] = useState([]);

  useEffect(() => {
    if (Services.length > 0 && category) {
      const ServicesData = Services.filter(
        (service) =>
          service.category[currentLang] === category &&
          service._id !== serviceId
      );
      console.log("Filtered Related Services:", ServicesData); // Debug filtered data
      setRelServices(ServicesData);
    }
  }, [Services, category, serviceId, currentLang]); // Add currentLang as dependency

  return (
    <div className="flex flex-col gap-4 my-16 text-gray-900 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20">
      <h1 className="text-xl font-semibold">{t("footer.similarServices")}</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-5 gap-y-8">
        {relServices.slice(0, 7).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/bookings/${item._id}`);
              window.scrollTo(0, 0); // Use window.scrollTo for clarity
            }}
            className="border border-blue-200 rounded-lg overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img
              className="w-full h-40 object-cover bg-blue-50"
              src={item.image}
              alt={item.name[currentLang] || "Service Image"}
            />
            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  item.available ? "text-blue-500" : "text-red-500"
                }`}
              >
                <p
                  className={`w-2 h-2 rounded-full ${
                    item.available ? "bg-blue-500" : "bg-red-500"
                  }`}
                ></p>
                <p>
                  {item.available
                    ? t("service.availability.available")
                    : t("service.availability.notAvailable")}
                </p>
              </div>
              <p className="text-gray-900 text-base font-medium">
                {item.name[currentLang]}
              </p>
              <p className="text-gray-600 text-sm">
                {item.category[currentLang]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedServices;
