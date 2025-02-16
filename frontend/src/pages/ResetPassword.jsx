import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

useEffect(() => {
  const verifyToken = async () => {
    setIsLoadingToken(true);
    try {
      console.log("Frontend Token:", resetToken);
      const response = await axios.get(
        `${backendUrl}/api/user/reset-password/${resetToken}`
      );

      if (response.data.success) {
        setTokenValid(true);
        navigate("/reset-password/:resetToken"); 
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
      toast.error("Token is not valid.");
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
    return <div>Verifying token...</div>;
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <div>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
