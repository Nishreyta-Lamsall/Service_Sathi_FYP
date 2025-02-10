import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const [openFaq, setOpenFaq] = useState(null); // State to track open FAQ

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index); // Toggle between open and close
  };

  const navigate = useNavigate()

  return (
    <div className="ml-12 mr-12">
      {/* Header Section */}
      <div className="h-[27vh] w-full sm:w-[93vw] bg-[#0A1F44] text-white mb-10 mt-6">
        <p className="text-white text-3xl font-extrabold ml-10 pt-5">
          Welcome to Service Sathi
        </p>
        <p className="text-base font-serif ml-10 mt-6">
          Every home deserves to be a haven of comfort and care. That’s why
          we’re dedicated to providing seamless, dependable household services
          that fit your lifestyle. From sparkling clean spaces to perfectly
          executed repairs, our skilled professionals ensure every job is done
          with precision and care. “Service Sathi” was founded with one goal in
          mind: to take the stress out of managing your home. With our
          personalized approach and unwavering commitment to quality, we strive
          to make your daily life easier, leaving you more time for the things
          that matter most.
        </p>
      </div>

      {/* What Makes Us Different and Stats Section */}
      <div className="flex flex-col sm:flex-row items-start justify-between mx-5 mt-10">
        {/* What Makes Us Different */}
        <div className="w-full sm:w-1/2 mb-6 sm:mb-0">
          <p className="text-3xl font-semibold mb-6">
            What Makes Us Different?
          </p>
          <p className="text-xl text-[#5731A4] font-bold mb-1">Expert Team:</p>
          <p className="text-base text-[#595454] mb-6">
            Handpicked, trained professionals delivering precise, high-quality
            work.
          </p>
          <p className="text-xl text-[#5731A4] font-bold mb-1">
            Customer-Centric:
          </p>
          <p className="text-base text-[#595454] mb-6">
            Services tailored to your unique needs, prioritizing your
            satisfaction.
          </p>
          <p className="text-xl text-[#5731A4] font-bold mb-1">
            Reliable & Trusted:
          </p>
          <p className="text-base text-[#595454] mb-6">
            Your home is in safe, skilled hands with Service Sathi.
          </p>
        </div>

        {/* Divider */}
        <div className="border-l border-gray-600 mx-3 hidden sm:block"></div>

        {/* Stats Section */}
        <div className="w-full sm:w-1/2 border border-gray-400 p-5 rounded-lg sm:ml-10">
          <div className="flex flex-col gap-20">
            {/* Top Row */}
            <div className="flex flex-wrap gap-60">
              {[
                { label: "Services Provided", value: "20+" },
                { label: "Service Providers", value: "10+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="w-1/2 sm:w-1/4 text-center flex flex-col items-center"
                >
                  <p className="text-3xl font-medium text-red-600">
                    {stat.value}
                    {/* Horizontal line between value and label */}
                    <hr className="w-28 my-2 border-t-2 border-gray-300" />
                  </p>
                  <p className="text-sm text-black font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Row */}
            <div className="flex flex-wrap gap-60">
              {[
                { label: "Active Users", value: "25+" },
                { label: "Happy Customers", value: "25+" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="w-1/2 sm:w-1/4 text-center flex flex-col items-center"
                >
                  <p className="text-3xl font-medium text-red-600">
                    {stat.value}
                    {/* Horizontal line between value and label */}
                    <hr className="w-28 my-2 border-t-2 border-gray-300" />
                  </p>
                  <p className="text-sm text-black font-semibold">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12 mx-5">
        <p className="text-3xl font-semibold mb-6">FAQ</p>
        <div className="space-y-4">
          {[
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
          ].map((faq, index) => (
            <div key={index} className="border-b pb-3">
              <div
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center cursor-pointer py-2"
              >
                <p className="text-lg">{faq.question}</p>
                <span
                  className={`text-blue-500 transform transition-transform duration-700 ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                >
                  &#9660;
                </span>
              </div>
              {openFaq === index && (
                <p className="text-sm text-gray-600 mt-2 transition-all duration-300">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Join Our Family Section */}
      <div className="mt-16 mx-5 mb-12">
        <p className="text-3xl font-semibold text-left">Join Our Family</p>
        <p className="mt-4 text-base text-left">
          Discover why thousands of customers trust{" "}
          <span className="font-bold">Service Sathi</span> for their household
          needs. Let’s make your life easier, one service at a time.
        </p>
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-6 bg-[#2D64C5] text-white px-6 py-3 rounded-full shadow hover:bg-blue-600"
        >
          Get Started Today →
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
