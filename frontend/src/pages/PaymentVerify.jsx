import { useLocation } from "react-router-dom"; // Import useLocation
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const PaymentVerify = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const pidx = queryParams.get("pidx");
  const status = queryParams.get("status");
  const transactionId = queryParams.get("transaction_id");

  useEffect(() => {
    if (status === "Completed") {
      toast.success("Payment Successful!");
    } else {
      toast.error("Payment Failed. Please try again.");
    }
  }, [status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Payment Verification
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Payment Status:</span>
            <span
              className={`font-medium ${
                status === "Completed" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Transaction ID:</span>
            <span className="text-gray-600">{transactionId}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Payment ID:</span>
            <span className="text-gray-600">{pidx}</span>
          </div>
        </div>

        <div className="mt-6">
          {status === "Completed" ? (
            <p className="text-center text-green-600 font-semibold">
              Your payment was successful! 🎉
            </p>
          ) : (
            <p className="text-center text-red-600 font-semibold">
              Something went wrong. Please try again.
            </p>
          )}
        </div>

        <Link
          to="/"
          className="mt-8 bg-[#242424] text-white px-6 py-3 rounded-xl text-center block w-full hover:bg-white hover:text-black border-2 border-[#242424] transition-all duration-300 transform hover:scale-105"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentVerify;
