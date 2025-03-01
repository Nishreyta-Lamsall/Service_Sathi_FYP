import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import aboutusimg from "../assets/aboutus.jpg";
import aboutus from "../assets/aboutuss.jpg";
import expertteam from "../assets/expertteam.png";
import customercentric from "../assets/customercentric.png";
import reliable from "../assets/reliable.png";


const AboutUs = () => {
  const [openFaq, setOpenFaq] = useState(null); // State to track open FAQ

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index); // Toggle between open and close
  };

  const [count, setCount] = useState(1);
  const stats = [
    { label: "Services Provided", value: 20 },
    { label: "Service Providers", value: 10 },
    { label: "Active Users", value: 25 },
    { label: "Happy Customers", value: 25 },
  ];

  useEffect(() => {
    stats.forEach((stat) => {
      let counter = 0;
      const interval = setInterval(() => {
        if (counter < stat.value) {
          counter++;
          setCount(counter);
        } else {
          clearInterval(interval);
        }
      }, 50); 
    });
  }, []);

  const faqs = [
    {
      question: "What types of services does Service Sathi offer?",
      answer:
        "We offer a wide range of household services including plumbing, electrical services, maintenance, and more to cater to all your needs.",
    },
    {
      question: "How do I book a service with Service Sathi?",
      answer:
        "To book a service with Service Sathi, browse through the available services, select the service you need, and schedule an appointment based on your preferred time.",
    },
    {
      question: "Are your professionals qualified and reliable?",
      answer:
        "Yes, all our professionals are handpicked, trained, and thoroughly vetted to ensure high-quality and reliable service.",
    },
    {
      question: "What areas do you currently serve?",
      answer:
        "We currently serve only the Kathmandu Metropolitan City; however, we plan to expand our services to other areas in the future.",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Wrapper to control max width */}
      <div className="max-w-screen-2xl mx-auto">
        {/* Hero Section */}
        <div className="relative w-full h-[90vh]">
          <img src={aboutus} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-65"></div>
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <h1 className="text-5xl font-semibold">ABOUT US</h1>
          </div>
        </div>

        {/* Image + Text Section */}
        <div className="relative flex justify-center items-center mt-16 ml-52">
          <div className="relative">
            <img
              src={aboutusimg}
              alt="About Us"
              className="w-[80vh] h-[90vh] object-cover"
            />
          </div>

          <div className="absolute left-10 md:left-9 -mt-10 bg-white w-[300px] h-[55vh] md:w-[480px] p-10 shadow-2xl">
            <p className="text-blue-950 uppercase text-base font-semibold">
              Welcome to Service Sathi
            </p>
            <h2 className="text-4xl font-medium text-black leading-tight mt-6">
              HOUSEHOLD SERVICES, <br /> EXPERTLY DELIVERED
            </h2>
            <p className="text-gray-600 mt-6 font-sans">
              At Service Sathi, we make home management effortless with
              seamless, dependable household services. Our skilled professionals
              handle everything from cleaning to repairs with precision and
              care, so you can focus on what matters most.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start mt-14 gap-16 mx-auto max-w-7xl bg-gray-50 p-8 rounded-xl shadow-md">
          {/* Left Section - Text */}
          <div className="w-full sm:w-1/2 mt-28 ml-10">
            <p className="text-4xl font-semibold mb-4">
              What Makes Us Different?
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              Discover what sets us apart from the rest — <br />
              our commitment to excellence, customer-first <br />
              approach, and a team you can trust.
            </p>
          </div>

          {/* Right Section - Cards */}
          <div className="w-full sm:w-[400px] flex flex-col gap-6">
            {[
              {
                img: (
                  <img
                    src={expertteam}
                    alt="expertteam"
                    className="w-14 h-14 bg-[#F0F4FF] p-2 rounded-full"
                  />
                ),
                title: "Expert Team",
                description:
                  "Handpicked, trained professionals delivering precise, high-quality work.",
              },
              {
                img: (
                  <img
                    src={customercentric}
                    alt="customercentric"
                    className="w-14 h-14 bg-[#F0F4FF] p-2 rounded-full"
                  />
                ),
                title: "Customer-Centric",
                description:
                  "Services tailored to your unique needs, prioritizing your satisfaction.",
              },
              {
                img: (
                  <img
                    src={reliable}
                    alt="reliable"
                    className="w-14 h-14 bg-[#F0F4FF] p-2 rounded-full"
                  />
                ),
                title: "Reliable & Trusted",
                description:
                  "Your home is in safe, skilled hands with Service Sathi.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white border border-gray-200 shadow-lg p-5 flex items-center gap-4 rounded-lg transition-all duration-300 hover:scale-105

                ${index === 0 ? "ml-[-20px]" : ""}
                ${index === 1 ? "ml-[20px]" : ""}
                ${index === 2 ? "ml-[-20px]" : ""}
              `}
              >
                <div className="flex-shrink-0">{item.img}</div>
                <div>
                  <p className="text-lg font-semibold text-black">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-16 p-8 rounded-lg mx-auto bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg max-w-screen-2xl">
          <p className="text-3xl font-semibold mb-8 text-center animate-fade-in">
            Our Stats
          </p>
          <div className="flex gap-40 overflow-x-auto mt-16 ml-28">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="w-auto text-center flex flex-col items-center mb-6 transform transition-all hover:scale-95"
              >
                <p className="text-2xl font-semibold text-blue-900 animate-count-up">
                  {count}+
                </p>
                <hr className="w-20 my-4 border-t-2 border-blue-300 rounded-full" />
                <p className="text-lg text-black font-semibold uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 mx-auto max-w-5xl">
          <p className="text-3xl font-semibold mb-6 text-center">FAQ</p>
          <div className="space-y-5">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border p-3 rounded-lg transition-all duration-500 ease-in-out ${
                  openFaq === index ? "bg-gray-100" : "bg-gray-50"
                }`}
              >
                <div
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between cursor-pointer"
                >
                  <p className="text-lg font-base">{faq.question}</p>
                  <span
                    className={`text-blue-900 transform transition-transform duration-300 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  >
                    &#9660;
                  </span>
                </div>
                <div
                  className={`grid transition-all duration-500 ease-in-out overflow-hidden ${
                    openFaq === index
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="text-sm text-gray-700 mt-3 overflow-hidden">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Our Family Section */}
        <div className="w-full mt-16 p-8 rounded-lg mx-auto bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg max-w-screen-2xl text-center">
          <p className="text-3xl font-semibold">Join Our Family</p>
          <p className="mt-6 text-base text-gray-600 max-w-2xl mx-auto">
            Discover why thousands of customers trust{" "}
            <span className="font-bold ">Service Sathi</span> for their
            household needs. Let’s make your life easier, one service at a time.
          </p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="mt-5 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-3.5 pr-6 rounded-xl hover:scale-105 transition-all duration-300 z-10"
          >
            Get Started Today →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
