import React from "react";

const Testimonial = ({ id, name, rating, image, comment }) => {
  return (
    <div className="flex flex-col items-start p-6 w-80 rounded-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-gray-200">
      <div className="flex items-center mb-4">
        <img
          className="rounded-full w-16 h-16 object-cover"
          src={image}
          alt={name}
        />
      </div>

      <div className="flex flex-col items-start">
        <p className="font-semibold text-xl text-gray-800">{name}</p>

        <div className="flex items-center mt-1 text-yellow-500">
          {Array.from({ length: rating }).map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M12 17.7l-6.1 3.2 1.2-7.2-5.2-5.1 7.3-1.1L12 1l3.8 7.5 7.3 1.1-5.2 5.1 1.2 7.2L12 17.7z"
              />
            </svg>
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-2">{comment}</p>
      </div>
    </div>
  );
};

export default Testimonial;
