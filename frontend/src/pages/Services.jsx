import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const Services = () => {
  const { category } = useParams();
  const [filterService, setFilterService] = useState([]);
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate();

  const { Services } = useContext(AppContext);

  const applyFilter = () => {
    if (category) {
      setFilterService(
        Services.filter((Services) => Services.category === category)
      );
    } else {
      setFilterService(Services);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [Services, category]);

  return (
    <div className="ml-10 mt-10">
      <p className="text-gray-600">Discover the right service for you.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`p-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-blue-900 text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>
        <div
          className={`w-[17vw] flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          <p
            onClick={() =>
              category === "House Cleaning Services"
                ? navigate("/services")
                : navigate("/services/House Cleaning Services")
            }
            className={`sm:w-auto pl-3 py-1.5 pr-10 border border-gray-300 rounded transition-all cursor-pointer  ${
              category === "House Cleaning Services"
                ? "bg-[#2D64C5] text-white"
                : " "
            }`}
          >
            House Cleaning Services
          </p>
          <p
            onClick={() =>
              category === "Electrical Services"
                ? navigate("/services")
                : navigate("/services/Electrical Services")
            }
            className={`sm:w-auto pl-3 py-1.5 pr-10 border border-gray-300 rounded transition-all cursor-pointer  ${
              category === "Electrical Services"
                ? "bg-[#2D64C5] text-white"
                : " "
            }`}
          >
            Electrical Services
          </p>
          <p
            onClick={() =>
              category === "Carpentry Services"
                ? navigate("/services")
                : navigate("/services/Carpentry Services")
            }
            className={`sm:w-auto pl-3 py-1.5 pr-10 border border-gray-300 rounded transition-all cursor-pointer  ${
              category === "Carpentry Services"
                ? "bg-[#2D64C5] text-white"
                : " "
            }`}
          >
            Carpentry Services
          </p>
          <p
            onClick={() =>
              category === "Gardening Services"
                ? navigate("/services")
                : navigate("/services/Gardening Services")
            }
            className={`sm:w-auto pl-3 py-1.5 pr-10 border border-gray-300 rounded transition-all cursor-pointer  ${
              category === "Gardening Services"
                ? "bg-[#2D64C5] text-white"
                : " "
            }`}
          >
            Gardening Services
          </p>
          <p
            onClick={() =>
              category === "Plumbing Services"
                ? navigate("/services")
                : navigate("/services/Plumbing Services")
            }
            className={`sm:w-auto pl-3 py-1.5 pr-10 border border-gray-300 rounded transition-all cursor-pointer  ${
              category === "Plumbing Services" ? "bg-[#2D64C5] text-white" : " "
            }`}
          >
            Plumbing Services
          </p>
        </div>
        <div className="w-full max-w-[calc(100%-4rem)] mr-[2rem] ml-[3rem] grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 pt-5 gap-y-8 px-3 sm:px-0 mb-16">
          {filterService.map((item, index) => (
            <div
              onClick={() => navigate(`/bookings/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mr-[2rem]"
              key={index}
            >
              <img
                className="w-full h-40 object-cover bg-blue-50"
                src={item.image}
                alt=""
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.available ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></p>
                  <p>{item.available ? "Available" : "Not Available"}</p>
                </div>

                <p className="text-gray-900 text-base font-medium">
                  {" "}
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
