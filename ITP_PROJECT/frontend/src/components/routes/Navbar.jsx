// //frontend/src/components/routes/Navbar.jsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaHome,
  FaThLarge,
  FaBullseye,
  FaShoppingCart,
  FaChevronDown,
  FaUser,
  FaSignOutAlt,
  FaClipboardList,
  FaEnvelopeOpenText,
  FaDollarSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getDashboardPath } from "../utils/roleRouting";
import axios from "axios";

const backendUrl = "http://localhost:5000";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthed(false);
      setUser({ name: "", email: "", role: "" });
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.user) {
        setUser({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "",
        });
        setIsAuthed(true);

        // Also update localStorage for consistency
        localStorage.setItem("userName", data.user.name || "");
        localStorage.setItem("email", data.user.email || "");
        localStorage.setItem("role", data.user.role || "");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      // If token is invalid, clear auth state
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        setIsAuthed(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load + event listeners
  useEffect(() => {
    fetchUserData();

    const handler = () => fetchUserData();
    window.addEventListener("auth:update", handler);
    window.addEventListener("profile:updated", handler);
    window.addEventListener("storage", handler);

    return () => {
      window.removeEventListener("auth:update", handler);
      window.removeEventListener("profile:updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, [fetchUserData]);

  // Dropdown management
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const signUpDropdownRef = useRef(null);
  const signUpButtonRef = useRef(null);

  // Outside click
  useEffect(() => {
    function outside(e) {
      if (
        userMenuOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserMenuOpen(false);
      }
      if (
        signUpOpen &&
        signUpDropdownRef.current &&
        !signUpDropdownRef.current.contains(e.target) &&
        signUpButtonRef.current &&
        !signUpButtonRef.current.contains(e.target)
      ) {
        setSignUpOpen(false);
      }
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [userMenuOpen, signUpOpen]);

  // ESC key
  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        setSignUpOpen(false);
      }
    }
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, []);

  // Sign out
  const signOut = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/auth/signout", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (_) {
      // ignore
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth:update"));
      navigate("/login");
    }
  };

  const dashboardPath = getDashboardPath(user.role);
  const userInitial = user.name ? user.name[0].toUpperCase() : "U";

  const handleDashboard = () => {
    if (!isAuthed) navigate("/login");
    else navigate(dashboardPath);
  };

  // Show loading state
  if (isLoading) {
    return (
      <nav className="bg-blue-600 px-12 py-3 flex items-center justify-between w-full">
        <div className="flex flex-col items-start cursor-pointer select-none">
          <span className="text-white text-3xl font-bold tracking-widest">
            NEXT
          </span>
          <span
            className="text-white text-xl font-light tracking-widest"
            style={{ letterSpacing: ".1em" }}
          >
            SOURCING
          </span>
        </div>
        <div className="text-white">Loading...</div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 px-12 py-3 flex items-center justify-between w-full">
      {/* Logo */}
      <div
        className="flex flex-col items-start cursor-pointer select-none"
        onClick={() => navigate("/")}
      >
        <span className="text-white text-3xl font-bold tracking-widest">
          NEXT
        </span>
        <span
          className="text-white text-xl font-light tracking-widest"
          style={{ letterSpacing: ".1em" }}
        >
          SOURCING
        </span>
      </div>

      {/* Center navigation */}
      <div className="flex gap-8">
        <button
          className="text-white hover:text-blue-200 flex items-center gap-2 transition"
          onClick={() => navigate("/")}
        >
          <FaHome /> Home
        </button>
        <button
          className="text-white hover:text-blue-200 flex items-center gap-2 transition"
          onClick={() => navigate("/about")}
        >
          <FaThLarge /> About us
        </button>
        <button
          className="text-white hover:text-blue-200 flex items-center gap-2 transition"
          onClick={() => navigate("/orders")}
        >
          <FaShoppingCart /> Orders
        </button>
        <button
          className="text-white hover:text-blue-200 flex items-center gap-2 transition"
          onClick={() => navigate("/contact")}
        >
          <FaEnvelopeOpenText /> Contact us
        </button>
        <button
          className="text-white hover:text-blue-200 flex items-center gap-2 transition"
          onClick={() =>
            isAuthed
              ? navigate(getDashboardPath("financialmanager"))
              : navigate("/login")
          }
        >
          <FaDollarSign /> Finance
        </button>
      </div>

      {/* Right side */}
      {!isAuthed ? (
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 rounded font-semibold border border-white text-white hover:bg-white/10 active:bg-white active:text-blue-600 transition"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <div className="relative">
            <button
              ref={signUpButtonRef}
              onClick={() => {
                setSignUpOpen((o) => !o);
                setUserMenuOpen(false);
              }}
              className="px-4 py-2 rounded font-semibold border border-white text-white hover:bg-white/10 active:bg-white active:text-blue-600 flex items-center gap-2 transition"
            >
              Sign up
              <FaChevronDown
                className={`transition-transform ${
                  signUpOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {signUpOpen && (
              <div
                ref={signUpDropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden"
              >
                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition"
                  onClick={() => {
                    setSignUpOpen(false);
                    navigate("/register/shop-owner");
                  }}
                >
                  Shop Owner
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition"
                  onClick={() => {
                    setSignUpOpen(false);
                    navigate("/register/supplier");
                  }}
                >
                  Supplier
                </button>
                <button
                  className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 transition"
                  onClick={() => {
                    setSignUpOpen(false);
                    navigate("/register/others");
                  }}
                >
                  Staff
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => {
              setUserMenuOpen((v) => !v);
              setSignUpOpen(false);
            }}
            className="flex items-center gap-3 text-white"
          >
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold">
              {userInitial}
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-semibold leading-tight">
                {user.name || "User"}
              </div>
              <div className="text-blue-200 text-sm leading-tight capitalize">
                {user.role || "user"}
              </div>
            </div>
            <FaChevronDown
              className={`transition-transform ${
                userMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="text-gray-900 font-semibold">
                  {user.name || "User"}
                </div>
                <div className="text-gray-500 text-sm">
                  {user.email || "user@example.com"}
                </div>
              </div>
              <ul className="py-2">
                <li>
                  <button
                    className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate(dashboardPath);
                    }}
                  >
                    <FaUser className="mr-3 text-blue-600" /> Dashboard
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/profile");
                    }}
                  >
                    <FaUser className="mr-3 text-blue-600" /> Profile
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/goals");
                    }}
                  >
                    <FaBullseye className="mr-3 text-blue-600" /> Goals
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/tasks");
                    }}
                  >
                    <FaClipboardList className="mr-3 text-blue-600" /> Tasks
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate("/verify-email");
                    }}
                  >
                    <FaEnvelopeOpenText className="mr-3 text-blue-600" /> Verify
                    Email
                  </button>
                </li>
                {user.role === "financialmanager" && (
                  <li>
                    <button
                      className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition"
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate(getDashboardPath("financialmanager"));
                      }}
                    >
                      <FaDollarSign className="mr-3 text-blue-600" /> Finance
                      Dashboard
                    </button>
                  </li>
                )}
              </ul>
              <button
                className="flex items-center w-full px-5 py-2 text-red-600 hover:bg-red-50 border-t border-gray-100 transition"
                onClick={signOut}
              >
                <FaSignOutAlt className="mr-3" /> Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
