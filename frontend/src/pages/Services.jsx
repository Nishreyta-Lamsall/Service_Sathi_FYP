import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { category } = useParams();
  const [filterService, setFilterService] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { Services } = useContext(AppContext);

  const currentLang = i18n.language === "Nepali" ? "np" : "en";
  console.log("Current Language:", i18n.language, "Using:", currentLang);

  const applyFilter = () => {
    console.log("Services Data:", Services);
    let filtered = category
      ? Services.filter((service) => {
          const serviceCategorySlug = (service.category.en || "")
            .toLowerCase()
            .replace(/\s+/g, "-"); // Match URL slug format
          console.log(
            "Comparing category:",
            category,
            "with",
            serviceCategorySlug
          );
          return serviceCategorySlug === category;
        })
      : Services;

    if (searchQuery.trim()) {
      filtered = filtered.filter((service) => {
        const serviceName = service.name[currentLang];
        return serviceName?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    console.log("Filtered Services:", filtered);
    setFilterService(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [Services, category, searchQuery, currentLang]);

  // Categories must match DB values exactly
  const serviceCategories = [
    { en: "House Cleaning Services", np: "घर सफाई सेवाहरू" },
    { en: "Electrical Services", np: "विद्युतीय सेवाहरू" },
    { en: "Carpentry Services", np: "काठको काम सेवाहरू" },
    { en: "Gardening Services", np: "बगैंचा सेवाहरू" },
    { en: "Plumbing Services", np: "प्लम्बिंग सेवाहरू" },
  ];

  return (
    <div className="ml-16 mt-10">
      <p className="text-gray-600">{t("service.discover")}</p>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="text"
          placeholder={t("service.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-300 p-2 rounded w-64"
        />
        <button
          onClick={applyFilter}
          className="bg-[#242424] hover:bg-white hover:text-black rounded-md border-black border-2 text-white pl-4 py-1.5 pr-4 z-10 hover:scale-105 transition-all duration-300"
        >
          {t("service.searchButton")}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-2.5 px-6 border rounded text-sm transition-all ${
            showFilter
              ? "text-black rounded-md border-black border-2 hover:scale-105 transition-all duration-300"
              : "bg-white text-black rounded-md border-black border-2 hover:scale-105 transition-all duration-300"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {t("service.filters")}
        </button>

        <div
          className={`w-[17vw] flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden"
          }`}
        >
          {serviceCategories.map((service) => (
            <p
              key={service.en}
              onClick={() => {
                const slug = (service.en || "")
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                navigate(category === slug ? "/services" : `/services/${slug}`);
              }}
              className={`pl-3 py-1.5 md:pr-10 pr-20 border border-gray-300 rounded-lg transition-all cursor-pointer ${
                category ===
                (service.en || "").toLowerCase().replace(/\s+/g, "-")
                  ? "bg-black text-white"
                  : ""
              }`}
            >
              {service[currentLang]}
            </p>
          ))}
        </div>

        <div className="w-full max-w-[calc(100%-4rem)] mr-[2rem] ml-[3rem] pt-5 px-3 sm:px-0 mb-16">
          {filterService.length > 0 ? (
            <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 gap-y-8">
              {filterService.map((item, index) => (
                <div
                  onClick={() => navigate(`/bookings/${item._id}`)}
                  className="border border-blue-200 overflow-hidden cursor-pointer rounded-md hover:translate-y-[-10px] transition-all duration-500 mr-[2rem]"
                  key={index}
                >
                  <img
                    className="w-full h-40 object-cover bg-blue-50"
                    src={item.image}
                    alt={item.name[currentLang]}
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
          ) : (
            <p className="text-gray-600 text-center text-lg mb-48">
              {t("service.noServices")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Services;
