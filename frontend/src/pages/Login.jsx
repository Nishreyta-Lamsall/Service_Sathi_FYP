import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthForm = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [state, setState] = useState(
    location.pathname === "/login" ? "Login" : "Sign Up"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && location.pathname !== "/login") {
      navigate("/");
    }
  }, [token, navigate, location.pathname]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const normalizedEmail = email.toLowerCase();

    const getErrorTranslation = (message) => {
      switch (message) {
        case "User already exists!":
          return t("authForm.userExists");
        case "Enter a strong password":
          return t("authForm.enterStrongPass");
        case "Please verify your email before logging in.":
          return t("authForm.notVerified");
        case "Invalid Credentials!":
          return t("authForm.incorrectCredentials");
        default:
          return t("authForm.serverError");
      }
    };

    try {
      if (state === "Sign Up") {
        if (password !== confirmPassword) {
          toast.error(t("authForm.passwordsDoNotMatch"));
          setLoading(false);
          return;
        }

        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          password,
          email: normalizedEmail,
          confirmPassword,
        });

        if (data?.success) {
          toast.success(t("authForm.userRegistered"));
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setState("Login");
        } else {
          toast.error(getErrorTranslation(data?.message));
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          password,
          email: normalizedEmail,
        });

        if (data?.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success(t("authForm.loginSuccess"));
          setEmail("");
          setPassword("");
          navigate("/");
        } else if (data?.user?.isVerified === false) {
          toast.error(
            getErrorTranslation("Please verify your email before logging in.")
          );
        } else {
          toast.error(getErrorTranslation(data?.message));
        }
      }
    } catch (error) {
      const errorMessage = getErrorTranslation(error.response?.data?.message);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    try {
      setLoading(true);
      await axios.post(backendUrl + "/api/user/resend-verification", { email });
      toast.success(t("authForm.verificationEmailSent"));
    } catch (error) {
      toast.error(t("authForm.failedToResendEmail"));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const switchToSignUp = () => {
    setState("Sign Up");
  };

  const switchToLogin = () => {
    setState("Login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg overflow-hidden flex">
        <div className="hidden md:flex flex-1 bg-[#242424] text-white flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-center">
            {t("authForm.welcome")} <br />
            <span className="text-3xl font-normal">
              {t("authForm.toServiceSathi")}
            </span>
          </h1>
        </div>

        <div className="flex-1 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              {state === "Sign Up" ? t("authForm.signUp") : t("authForm.login")}
            </h2>
          </div>
          <form onSubmit={onSubmitHandler} className="mt-8 space-y-6">
            {state === "Sign Up" && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("authForm.fullName")}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                {t("authForm.email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                {t("authForm.password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            {state === "Sign Up" && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("authForm.confirmPassword")}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-600 focus:border-gray-600"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              {state === "Login" && (
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-900 hover:text-indigo-500"
                >
                  {t("authForm.forgotPassword")}
                </button>
              )}
            </div>
            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 bg-[#242424] hover:bg-white hover:text-black border-black border-2 text-white pl-6 py-2 pr-6 rounded-xl hover:scale-105 transition-all duration-300"
                disabled={loading}
              >
                {state === "Sign Up"
                  ? t("authForm.signUp")
                  : t("authForm.login")}
              </button>
            </div>
          </form>

          {state === "Login" && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {t("authForm.didntReceiveVerification")}{" "}
                <button
                  onClick={resendVerificationEmail}
                  className="font-medium text-blue-900 hover:text-indigo-500 hover:scale-105 transition-all duration-300"
                  disabled={loading}
                >
                  {t("authForm.resendVerificationEmail")}
                </button>
              </p>
            </div>
          )}

          <div className="text-center mt-4">
            {state === "Sign Up" ? (
              <p className="text-sm text-gray-600">
                {t("authForm.alreadyHaveAccount")}{" "}
                <button
                  onClick={switchToLogin}
                  className="font-medium text-blue-900 hover:text-indigo-500 hover:scale-105 transition-all duration-300"
                >
                  {t("authForm.login")}
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                {t("authForm.dontHaveAccount")}{" "}
                <button
                  onClick={switchToSignUp}
                  className="font-medium text-blue-900 hover:text-indigo-500 hover:scale-105 transition-all duration-300"
                >
                  {t("authForm.signUp")}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
