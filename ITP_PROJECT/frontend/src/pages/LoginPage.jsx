// frontend/src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHash,
  FiArrowLeft,
  FiRefreshCcw,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import Navbar from "../components/routes/Navbar";
import Footer from "../components/routes/Footer";

const API = "http://localhost:5000/api/auth";

export default function Login() {
  const [step, setStep] = useState("login"); // 'login' | 'otp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [justResent, setJustResent] = useState(false);

  const navigate = useNavigate();

  // Countdown for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  const extractError = (err, fallback) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.error) return err.response.data.error;
    if (err.message) return err.message;
    return fallback;
  };

  const startResendCountdown = () => {
    setResendTimer(60);
    setJustResent(true);
    setTimeout(() => setJustResent(false), 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setMsg("");
    try {
      await axios.post(`${API}/signin`, { email, password });
      setStep("otp");
      setMsg("OTP sent to your email.");
      startResendCountdown();
    } catch (err) {
      setError(extractError(err, "Login failed. Check your credentials."));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setMsg("");
    try {
      const res = await axios.post(`${API}/verify-otp`, {
        email,
        code: otp,
      });
      setMsg(res.data.message || "Login successful!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.user && res.data.user.name) {
        localStorage.setItem("userName", res.data.user.name);
        localStorage.setItem("email", res.data.user.email);
      } else {
        localStorage.setItem("userName", res.data.name || "User");
        localStorage.setItem("email", res.data.email || email);
      }

      window.dispatchEvent(new Event("auth:update"));

      if (res.data.role === "HRmanager") {
        navigate("/dashboard/hr");
      } else if (res.data.role === "shopowner") {
        navigate("/dashboard/shopowner");
      } else if (res.data.role === "financialmanager") {
        navigate("/financedashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(extractError(err, "OTP verification failed."));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;
    setLoading(true);
    setError("");
    setMsg("");
    try {
      await axios.post(`${API}/resend-otp`, { email });
      setMsg("New OTP sent to your email.");
      startResendCountdown();
    } catch (err) {
      setError(extractError(err, "Could not resend OTP."));
    } finally {
      setLoading(false);
    }
  };

  const resetToLogin = () => {
    setStep("login");
    setOtp("");
    setMsg("");
    setError("");
    setResendTimer(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full flex min-h-screen">
        {/* LEFT ILLUSTRATION */}
        <div className="hidden lg:flex w-1/2 bg-white items-center justify-center relative overflow-hidden">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-50" />
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-50" />
          <div className="relative z-10 p-8 select-none">
            <h1 className="mt-20 text-8xl font-bold text-blue-700 tracking-wide">
              Welcome Back
            </h1>
            <p className="mt-4 text-gray-500 max-w-sm leading-relaxed">
              Sign in once with your email & password, then confirm with your
              secure one-time code.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Blue background) */}
        <div className="w-full lg:w-1/2 bg-blue-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
            <div className="w-96 h-96 rounded-full border border-white/20" />
            <div className="w-72 h-72 rounded-full border border-white/10 absolute top-12 left-12" />
          </div>

          {/* CARD */}
          <div className="relative z-50 w-full max-w-sm bg-white rounded-xl shadow-xl px-10 py-9">
            <div className="mb-6">
              {step === "otp" && (
                <button
                  type="button"
                  onClick={resetToLogin}
                  className="mb-4 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  <FiArrowLeft size={14} /> Back to Login
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {step === "login" ? "Hello!" : "Enter OTP"}
              </h2>
              <p className="text-sm text-gray-600">
                {step === "login"
                  ? "Sign in to get started"
                  : `Code sent to ${email}`}
              </p>
            </div>

            {error && (
              <div className="mb-4 text-sm rounded-md bg-red-50 border border-red-200 text-red-600 px-4 py-3">
                {error}
              </div>
            )}
            {msg && (
              <div
                className={`mb-4 text-sm rounded-md border px-4 py-3 ${
                  justResent
                    ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}
              >
                {msg}
              </div>
            )}

            {/* STEP 1: EMAIL + PASSWORD (shown only once) */}
            {step === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 pointer-events-none">
                    <FiMail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-400 text-sm transition"
                  />
                </div>

                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 pointer-events-none">
                    <FiLock size={18} />
                  </span>
                  <input
                    type={showPw ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    className="w-full pl-12 pr-11 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-400 text-sm transition"
                  />
                  <button
                    type="button"
                    aria-label="Toggle password visibility"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPw ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full py-3 text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Sending OTP..." : "Login"}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password
                  </Link>
                  <span className="text-gray-400 select-none mx-2">•</span>
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              </form>
            )}

            {/* STEP 2: OTP */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-5">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-5 text-gray-400 pointer-events-none">
                    <FiHash size={18} />
                  </span>
                  <input
                    type="text"
                    name="otp"
                    placeholder="6 Digit OTP"
                    value={otp}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(v);
                    }}
                    required
                    inputMode="numeric"
                    maxLength={6}
                    className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white placeholder-gray-400 text-center tracking-widest font-medium text-sm transition"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    className={`flex items-center gap-1 font-medium transition ${
                      resendTimer > 0 || loading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    <FiRefreshCcw size={14} />
                    {resendTimer > 0
                      ? `Resend in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                  <button
                    type="button"
                    onClick={resetToLogin}
                    className="text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Change Email
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-full py-3 text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Secure Two-Factor Authentication
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
