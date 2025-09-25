// //frontend/src/pages/RegisterShopOwner.jsx
// import React, { useState } from "react";
// import axios from "axios";
// import {
//   FiMail,
//   FiLock,
//   FiEye,
//   FiEyeOff,
//   FiUser,
//   FiHome,
//   FiPhone,
//   FiLayers,
// } from "react-icons/fi";
// import { Link, useNavigate } from "react-router-dom";
// import { SHOP_TYPES } from "../../components/utils/roleOption";
// import Navbar from "../components/routes/Navbar";
// import Footer from "../components/routes/Footer";

// const API_URL = "http://localhost:5000/api/user/register";

// export default function RegisterShopOwner() {
//   return <ShopOwnerLayout />;
// }

// function ShopOwnerLayout() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     address: "",
//     contactNumber: "",
//     shopType: "",
//   });

//   const [showPw, setShowPw] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const sanitizeContact = (v) => v.replace(/[^0-9+]/g, "").slice(0, 16);
//   const handleContact = (e) =>
//     setForm((p) => ({ ...p, contactNumber: sanitizeContact(e.target.value) }));

//   const resetForm = () => {
//     setForm({
//       name: "",
//       email: "",
//       password: "",
//       address: "",
//       contactNumber: "",
//       shopType: "",
//     });
//     setAgree(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setError("");

//     if (!form.name.trim()) {
//       setError("Name is required.");
//       return;
//     }
//     if (!form.shopType) {
//       setError("Shop type is required.");
//       return;
//     }
//     if (!agree) {
//       setError("You must agree to the terms and conditions.");
//       return;
//     }

//     const payload = {
//       name: form.name.trim(),
//       email: form.email.trim(),
//       password: form.password,
//       role: "shopowner", // FIXED ROLE
//       address: form.address,
//       contactNumber: form.contactNumber,
//       shopType: form.shopType,
//       departmentName: "", // Not used
//       companyName: "", // Not used
//     };

//     setLoading(true);
//     try {
//       const res = await axios.post(API_URL, payload);
//       setMessage(res.data.message || "Registration successful!");
//       resetForm();
//       setTimeout(() => navigate("/login"), 1500);
//     } catch (err) {
//       if (err.response?.data?.message) {
//         setError("Server Error: " + err.response.data.message);
//       } else if (err.response?.data?.error) {
//         setError("Server Error: " + err.response.data.error);
//       } else if (err.message) {
//         setError("Network Error: " + err.message);
//       } else {
//         setError("Registration failed. Please try again.");
//       }
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="flex w-full min-h-screen bg-white">
//         {/* LEFT BRAND PANEL */}
//         <div className="hidden lg:flex w-1/2 bg-blue-600 text-white flex-col px-16 py-14">
//           <div className="flex items-center gap-3 mb-12 select-none">
//             <div className="bg-white/15 h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xl">
//               G
//             </div>
//             <div className="leading-tight">
//               <div className="text-xl font-semibold tracking-wide">FABRICK</div>
//               <div className="text-[11px] uppercase tracking-widest text-blue-100 font-medium">
//                 Garment
//               </div>
//             </div>
//           </div>

//           <hr className="border-blue-400/40 mb-10" />

//           <h1 className="text-4xl font-bold leading-tight max-w-md">
//             Register as a Shop Owner
//           </h1>
//           <p className="mt-8 text-blue-100 max-w-md leading-relaxed">
//             Manage your shop profile and oversee operational modules from one
//             unified platform.
//           </p>

//           <div className="mt-auto text-xs text-blue-200">
//             © {new Date().getFullYear()} Garment Factory Management System
//           </div>
//         </div>

//         {/* RIGHT FORM */}
//         <div className="w-full lg:w-1/2 flex items-start justify-center overflow-y-auto">
//           <div className="w-full max-w-xl px-8 md:px-12 py-14">
//             <header className="mb-10">
//               <h2 className="text-2xl font-semibold text-gray-900">
//                 Shop Owner Registration
//               </h2>
//               <p className="text-sm text-gray-500 mt-1">
//                 Enter your details to create a shop owner account
//               </p>
//             </header>

//             {error && (
//               <div className="mb-6 text-sm rounded-md bg-red-50 border border-red-200 text-red-600 px-4 py-3">
//                 {error}
//               </div>
//             )}
//             {message && (
//               <div className="mb-6 text-sm rounded-md bg-green-50 border border-green-200 text-green-700 px-4 py-3">
//                 {message}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-8">
//               <Field label="Name" required icon={<FiUser />}>
//                 <input
//                   name="name"
//                   type="text"
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="Full Name"
//                   required
//                   className="input"
//                 />
//               </Field>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field label="Email" required icon={<FiMail />}>
//                   <input
//                     name="email"
//                     type="email"
//                     value={form.email}
//                     onChange={handleChange}
//                     placeholder="name@example.com"
//                     required
//                     className="input"
//                   />
//                 </Field>

//                 <Field label="Password" required icon={<FiLock />}>
//                   <div className="relative">
//                     <input
//                       name="password"
//                       type={showPw ? "text" : "password"}
//                       value={form.password}
//                       onChange={handleChange}
//                       placeholder="Min 6 characters"
//                       minLength={6}
//                       required
//                       className="input pr-11"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPw((s) => !s)}
//                       className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
//                       tabIndex={-1}
//                       aria-label="Toggle password visibility"
//                     >
//                       {showPw ? <FiEyeOff /> : <FiEye />}
//                     </button>
//                   </div>
//                 </Field>
//               </div>

//               <Field label="Shop Type" required icon={<FiLayers />}>
//                 <select
//                   name="shopType"
//                   value={form.shopType}
//                   onChange={handleChange}
//                   required
//                   className="input"
//                 >
//                   <option value="">Select shop type</option>
//                   {SHOP_TYPES.map((t) => (
//                     <option key={t.value} value={t.value}>
//                       {t.label}
//                     </option>
//                   ))}
//                 </select>
//               </Field>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Field label="Address" required icon={<FiHome />}>
//                   <input
//                     name="address"
//                     type="text"
//                     value={form.address}
//                     onChange={handleChange}
//                     placeholder="Business address"
//                     required
//                     className="input"
//                   />
//                 </Field>
//                 <Field label="Contact Number" required icon={<FiPhone />}>
//                   <input
//                     name="contactNumber"
//                     type="text"
//                     value={form.contactNumber}
//                     onChange={handleContact}
//                     placeholder="+94..."
//                     required
//                     className="input"
//                   />
//                 </Field>
//               </div>

//               <div className="flex items-start gap-3">
//                 <input
//                   id="agree-shop"
//                   type="checkbox"
//                   checked={agree}
//                   onChange={(e) => setAgree(e.target.checked)}
//                   className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                   required
//                 />
//                 <label htmlFor="agree-shop" className="text-sm text-gray-600">
//                   I agree to the{" "}
//                   <Link
//                     to="/terms"
//                     className="text-blue-600 hover:text-blue-700 underline"
//                   >
//                     terms and conditions
//                   </Link>
//                 </label>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 rounded-md shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
//               >
//                 {loading ? "Registering..." : "Create Shop Owner Account"}
//               </button>

//               <hr className="border-gray-200" />
//               <div className="text-sm text-gray-600">
//                 Need another role?{" "}
//                 <Link
//                   to="/register/others"
//                   className="text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   Register here
//                 </Link>
//               </div>
//               <div className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <Link
//                   to="/login"
//                   className="text-blue-600 hover:text-blue-700 font-medium"
//                 >
//                   Sign in
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// function Field({ label, required, icon, children, tip }) {
//   return (
//     <div className="flex flex-col">
//       <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
//         <span className="flex items-center gap-1">
//           {icon && <span className="text-gray-400">{icon}</span>}
//           {label}
//         </span>
//         {required && <span className="text-red-500">*</span>}
//         {tip && (
//           <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-400">
//             {tip}
//           </span>
//         )}
//       </label>
//       {children}
//     </div>
//   );
// }

import React, { useState } from "react";
import axios from "axios";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUser,
  FiHome,
  FiPhone,
  FiLayers,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { SHOP_TYPES } from "../../components/utils/roleOption";
// ✅ FIXED IMPORT PATHS
import Navbar from "../../components/routes/Navbar";
import Footer from "../../components/routes/Footer";

const API_URL = "http://localhost:5000/api/user/register";

export default function RegisterShopOwner() {
  return <ShopOwnerLayout />;
}

function ShopOwnerLayout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    contactNumber: "",
    shopType: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const sanitizeContact = (v) => v.replace(/[^0-9+]/g, "").slice(0, 16);
  const handleContact = (e) =>
    setForm((p) => ({ ...p, contactNumber: sanitizeContact(e.target.value) }));

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      address: "",
      contactNumber: "",
      shopType: "",
    });
    setAgree(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (!form.shopType) {
      setError("Shop type is required.");
      return;
    }
    if (!agree) {
      setError("You must agree to the terms and conditions.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: "shopowner", // FIXED ROLE
      address: form.address,
      contactNumber: form.contactNumber,
      shopType: form.shopType,
      departmentName: "", // Not used
      companyName: "", // Not used
    };

    setLoading(true);
    try {
      const res = await axios.post(API_URL, payload);
      setMessage(res.data.message || "Registration successful!");
      resetForm();
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError("Server Error: " + err.response.data.message);
      } else if (err.response?.data?.error) {
        setError("Server Error: " + err.response.data.error);
      } else if (err.message) {
        setError("Network Error: " + err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
    setLoading(false);
  };

  return (
    // ✅ FIXED LAYOUT STRUCTURE
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ NAVBAR - Fixed at top */}
      <Navbar />

      {/* ✅ MAIN CONTENT - Takes available space */}
      <div className="flex-1 flex w-full bg-white">
        {/* LEFT BRAND PANEL */}
        <div className="hidden lg:flex w-1/2 bg-blue-600 text-white flex-col px-16 py-14">
          <div className="flex items-center gap-3 mb-12 select-none">
            <div className="bg-white/15 h-12 w-12 rounded-lg flex items-center justify-center font-bold text-xl">
              G
            </div>
            <div className="leading-tight">
              <div className="text-xl font-semibold tracking-wide">FABRICK</div>
              <div className="text-[11px] uppercase tracking-widest text-blue-100 font-medium">
                Garment
              </div>
            </div>
          </div>

          <hr className="border-blue-400/40 mb-10" />

          <h1 className="text-4xl font-bold leading-tight max-w-md">
            Register as a Shop Owner
          </h1>
          <p className="mt-8 text-blue-100 max-w-md leading-relaxed">
            Manage your shop profile and oversee operational modules from one
            unified platform.
          </p>

          <div className="mt-auto text-xs text-blue-200">
            © {new Date().getFullYear()} Garment Factory Management System
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 flex items-start justify-center overflow-y-auto">
          <div className="w-full max-w-xl px-8 md:px-12 py-14">
            <header className="mb-10">
              <h2 className="text-2xl font-semibold text-gray-900">
                Shop Owner Registration
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your details to create a shop owner account
              </p>
            </header>

            {error && (
              <div className="mb-6 text-sm rounded-md bg-red-50 border border-red-200 text-red-600 px-4 py-3">
                {error}
              </div>
            )}
            {message && (
              <div className="mb-6 text-sm rounded-md bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <Field label="Name" required icon={<FiUser />}>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Email" required icon={<FiMail />}>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </Field>

                <Field label="Password" required icon={<FiLock />}>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPw ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                      className="w-full px-4 py-3 pr-11 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                      aria-label="Toggle password visibility"
                    >
                      {showPw ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </Field>
              </div>

              <Field label="Shop Type" required icon={<FiLayers />}>
                <select
                  name="shopType"
                  value={form.shopType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select shop type</option>
                  {SHOP_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Address" required icon={<FiHome />}>
                  <input
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Business address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </Field>
                <Field label="Contact Number" required icon={<FiPhone />}>
                  <input
                    name="contactNumber"
                    type="text"
                    value={form.contactNumber}
                    onChange={handleContact}
                    placeholder="+94..."
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </Field>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="agree-shop"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <label htmlFor="agree-shop" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    terms and conditions
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 rounded-md shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </div>
                ) : (
                  "Create Shop Owner Account"
                )}
              </button>

              <hr className="border-gray-200" />
              <div className="text-sm text-gray-600">
                Need another role?{" "}
                <Link
                  to="/register/others"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Register here
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Field({ label, required, icon, children, tip }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <span className="flex items-center gap-1">
          {icon && <span className="text-gray-400">{icon}</span>}
          {label}
        </span>
        {required && <span className="text-red-500">*</span>}
        {tip && (
          <span className="ml-auto text-[10px] uppercase tracking-wide text-gray-400">
            {tip}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
