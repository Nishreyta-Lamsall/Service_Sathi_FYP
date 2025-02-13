import React from "react";
import home from "../assets/home.png";
import { testimonial } from "../assets/js/testimonials";
import Testimonial from "../components/Testimonial";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
import { CategoryData } from "../assets/assets";

const HomePage = () => {
  const navigate = useNavigate();
  const { Services } = useContext(AppContext);

  return (
    <div className="main">
      {/* Upper Content */}
      <div className="flex items-center justify-center mt-2 h-[40vh] w-[97vw]">
        <div className="border font-primary border-gray-500 h-full w-full flex ml-8">
          {/* First child div */}
          <div className="w-[68%] bg-[#0A1F44] text-white">
            <p className="text-3xl font-extrabold ml-16 mt-10">
              “Your Trusted Partner for Every Home Need”
            </p>
            <p className="text-base font-serif ml-16 mt-6">
              Transform your home into a haven with Service Sathi — your trusted
              partner for reliable, top-notch <br /> household services. From
              meticulous cleaning to expert repairs, we deliver convenience,
              quality, and <br />
              peace of mind tailored to your unique needs. Experience the ease
              of living with professionals who care <br /> as much about your
              home as you do.
            </p>
            <button
              onClick={() => navigate("/about")}
              className="ml-16 mt-5 bg-[#2D64C5] text-white px-3 py-1 rounded-full hover:scale-105 transition-all duration-300"
            >
              Discover How We Do It
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>

          {/* Second child div */}
          <div className="w-[35%] border overflow-hidden">
            <img
              src={home}
              alt="Picture"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-16 mb-20" id="#category">
        <div>
          <p className="ml-16 font-semibold text-2xl">Services Offered</p>
        </div>
        <div className="ml-16 mt-10 flex flex-wrap gap-x-32 gap-y-12">
          {CategoryData.map((item, index) => (
            <Link
              onClick={() => scrollTo(0, 0)}
              key={index}
              to={`/services/${item.category}`}
            >
              <p className="border border-gray-500 bg-[#EFF6FC] text-base px-3 py-2 rounded-full whitespace-nowrap h-[48px] flex items-center justify-center hover:bg-blue-100 hover:translate-y-[-10px] transition-all duration-500">
                {" "}
                {item.category}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 mb-16 flex flex-col items-center gap-4 text-gray-900 md:mx-10">
        <div className="self-start">
          <p className="ml-8 font-semibold text-2xl mb-8">Latest Picks</p>
        </div>
        <div className="w-full ml-[4rem] grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 pt-5 gap-y-8 px-3 sm:px-0 ">
          {Services.slice(0, 10).map((item, index) => (
            <div
              onClick={() => {
                navigate(`/bookings/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 mr-[4rem]"
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
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm">{item.category}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            navigate("/services");
            scrollTo(0, 0);
          }}
          className="mt-5 bg-[#2D64C5] text-white px-8 py-2 rounded-full hover:scale-105 transition-all duration-300"
        >
          All Services
        </button>
      </div>

      <div className="ml-16 mb-16">
        <p className="text-[#A33928] md:text-2xl text-xl font-bold">
          Interested in Our Subscription Plans?
        </p>
        <p className="mt-5 font-sans lg:text-lg sm:text-base">
          {" "}
          Get access to exclusive benefits and regular maintenance tailored to
          your needs. Choose a plan that suits your lifestyle and let us handle
          the rest !
        </p>
        <button
          className="bg-[#0A1F44] text-white p-2 px-4 mt-5 rounded-lg hover:scale-105 transition-all duration-300"
          onClick={() => navigate("/subscriptions")}
        >
          View Plans
        </button>
      </div>

      <div className="ml-16 mb-4">
        <p className="font-bold text-2xl"> Testimonials </p>
      </div>
      <div>
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 overflow-auto ml-[3rem] mb-16">
          {testimonial.map((item, index) => (
            <Testimonial
              key={index}
              name={item.name}
              rating={item.rating}
              comment={item.comment}
              id={item.id}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
