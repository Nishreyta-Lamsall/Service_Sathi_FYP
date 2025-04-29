import { useEffect, useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const Testimonials = () => {
  const { aToken, backendUrl } = useContext(AdminContext);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/admin/all-testimonials`,
          {
            headers: { aToken },
          }
        );

        if (data.success) {
          setTestimonials(data.testimonials); 
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchTestimonials();
  }, [aToken, backendUrl]);

  if (!Array.isArray(testimonials)) {
    return <div>No testimonials found</div>;
  }

  const deleteTestimonial = async (testimonialId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/admin/delete-testimonial/${testimonialId}`,
        {
          headers: { aToken },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setTestimonials((prevTestimonials) =>
          prevTestimonials.filter(
            (testimonial) => testimonial._id !== testimonialId
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleApproval = async (testimonialId, currentStatus) => {
    try {
      const { data } = await axios.patch(
        `${backendUrl}/api/admin/toggle-approval/${testimonialId}`,
        { approved: !currentStatus }, 
        {
          headers: { aToken },
        }
      );

      if (data.success) {
        toast.success("Testimonial approval status updated");
        setTestimonials((prevTestimonials) =>
          prevTestimonials.map((testimonial) =>
            testimonial._id === testimonialId
              ? { ...testimonial, approved: !currentStatus }
              : testimonial
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="testimonial-container py-8 bg-gray-50 max-h-[90vh] overflow-y-auto scrollbar-none">
      <p className="text-3xl font-semibold text-center text-gray-800 mb-8">
        User Testimonials
      </p>
      {testimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="testimonial-card bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={testimonial.image}
                alt="testimonial"
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <div className="testimonial-content">
                <p className="text-sm mb-2">
                  "{testimonial.message}"
                </p>
                <p className="text-base text-gray-600">
                  Rating: {testimonial.rating}
                </p>
                <p className="text-base text-gray-500 mt-2">
                  - {testimonial.name}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() =>
                    toggleApproval(testimonial._id, testimonial.approved)
                  }
                  className={`${
                    testimonial.approved
                      ? "bg-blue-900 hover:bg-blue-600"
                      : "bg-green-900 hover:bg-green-800"
                  } py-2 px-4 text-white rounded-full transition-colors duration-300`}
                >
                  {testimonial.approved ? "Approved" : "Approve"}
                </button>
                <button
                  onClick={() => deleteTestimonial(testimonial._id)}
                  className="delete-button py-2 px-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500">
          No testimonials available at the moment.
        </p>
      )}
    </div>
  );
};

export default Testimonials;
