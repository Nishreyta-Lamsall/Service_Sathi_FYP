import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

const Services = () => {
  const { category } = useParams();
  const [filterService, setFilterService] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { Services } = useContext(AppContext);

  const applyFilter = () => {
    let filtered = category
      ? Services.filter((service) => service.category === category)
      : Services;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((service) =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilterService(filtered);
  };

  useEffect(() => {
    applyFilter();
  }, [Services, category, searchQuery]); // Re-run when searchQuery changes

  return (
    <div className="ml-10 mt-10">
      <p className="text-gray-600"> {t("service.discover")}</p>

      {/* Search Bar */}
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
          className=" bg-[#242424] hover:bg-white hover:text-black rounded-md border-black border-2 text-white pl-4 py-1.5 pr-4 z-10 hover:scale-105 transition-all duration-300"
        >
          {t("service.searchButton")}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-2.5 px-6 border rounded text-sm transition-all ${
            showFilter
              ? "text-black rounded-md border-black border-2  hover:scale-105 transition-all duration-300"
              : "bg-white text-black rounded-md border-black border-2  hover:scale-105 transition-all duration-300"
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          {t("service.filters")}
        </button>

        <div
          className={`w-[17vw] flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden "
          }`}
        >
          {[
            "House Cleaning Services",
            "Electrical Services",
            "Carpentry Services",
            "Gardening Services",
            "Plumbing Services",
          ].map((service) => (
            <p
              key={service}
              onClick={() =>
                category === service
                  ? navigate("/services")
                  : navigate(`/services/${service}`)
              }
              className={`sm:w-auto pl-3 py-1.5 pr-10 border border-gray-300 rounded-lg transition-all cursor-pointer ${
                category === service ? "bg-black text-white" : ""
              }`}
            >
              {service}
            </p>
          ))}
        </div>

        <div className="w-full max-w-[calc(100%-4rem)] mr-[2rem] ml-[3rem] grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 pt-5 gap-y-8 px-3 sm:px-0 mb-16">
          {filterService.map((item, index) => (
            <div
              onClick={() => navigate(`/bookings/${item._id}`)}
              className="border border-blue-200 overflow-hidden cursor-pointer rounded-md hover:translate-y-[-10px] transition-all duration-500 mr-[2rem]"
              key={index}
            >
              <img
                className="w-full h-40 object-cover bg-blue-50"
                src={item.image}
                alt={item.name}
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
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
