import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { useTranslation } from "react-i18next";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      setIsLoadingToken(true);
      try {
        console.log("Verifying token:", resetToken);
        const response = await axios.get(
          `${backendUrl}/api/user/reset-password/${resetToken}`
        );

        if (response.data.success) {
          setTokenValid(true);
        } else {
          toast.error(response.data.message);
          navigate("/forgot-password");
        }
      } catch (error) {
        console.error("Error during token verification:", error);
        toast.error("Invalid or expired token");
        navigate("/forgot-password");
      } finally {
        setIsLoadingToken(false);
      }
    };

    if (resetToken) {
      verifyToken();
    } else {
      toast.error("No reset token provided");
      navigate("/forgot-password");
    }
  }, [resetToken, backendUrl, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!tokenValid) {
      toast.error("Token is not valid");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/reset-password/${resetToken}`,
        { newPassword: password }
      );
      if (response.data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Verifying token...</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">
          Invalid or expired token. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Reset Password
        </h2>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
