// //frontend/src/dashboards/HRmanager/Sidebar.jsx

// import React, { useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Define sidebar items
//   const sidebarItems = [
//     {
//       label: "Dashboard",
//       path: "/dashboard/hr",
//       icon: (
//         <span className="mr-3 flex items-center justify-center w-6 h-6">
//           {/* Home icon */}
//           <svg
//             width={20}
//             height={20}
//             fill="none"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path d="M3 10L10 3L17 10" stroke="#2563eb" />
//             <rect x="6" y="10" width="8" height="7" rx="1" stroke="#2563eb" />
//           </svg>
//         </span>
//       ),
//     },
//     {
//       label: "Add Employee",
//       path: "/dashboard/hr/add-employee",
//       icon: (
//         <span className="mr-3 flex items-center justify-center w-6 h-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <circle cx="9" cy="7" r="4" stroke="#222" />
//             <path d="M5 21c0-4 4-7 9-7" stroke="#222" />
//             <line x1="19" y1="8" x2="19" y2="14" stroke="#222" />
//             <line x1="16" y1="11" x2="22" y2="11" stroke="#222" />
//           </svg>
//         </span>
//       ),
//     },

//     {
//       label: "Your Employees",
//       path: "/dashboard/hr/our-employees",
//       icon: (
//         <span className="mr-3 flex items-center justify-center w-6 h-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <circle cx="9" cy="7" r="4" stroke="#222" />
//             <path d="M2 21c0-4 3-7 7-7" stroke="#222" />
//             <circle cx="17" cy="7" r="3" stroke="#222" />
//             <path d="M22 21c0-3-2-6-5-6" stroke="#222" />
//           </svg>
//         </span>
//       ),
//     },

//     {
//       label: "Generate Report",
//       path: "/dashboard/hr/GenerateReport",
//       icon: (
//         <span className="mr-3 flex items-center justify-center w-6 h-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M12 5v14m0 0l-5-5m5 5l5-5" stroke="#222" />
//             <rect
//               x="3"
//               y="3"
//               width="18"
//               height="18"
//               rx="2"
//               ry="2"
//               stroke="#222"
//             />
//           </svg>
//         </span>
//       ),
//     },

//     {
//       label: "My Profile",
//       path: "/staff/profile", // ✅ Fixed path
//       icon: (
//         <span className="mr-3 flex items-center justify-center w-6 h-6">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="18"
//             height="18"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//             <circle cx="12" cy="7" r="4" />
//           </svg>
//         </span>
//       ),
//     },
//   ];

//   // Find the current selected item by path
//   const selectedPath =
//     sidebarItems.find((item) => location.pathname.startsWith(item.path))
//       ?.path || "/dashboard/hr";

//   return (
//     <aside className="w-72 bg-white border-r px-6 py-8">
//       <div className="flex items-center mb-10">
//         <span className="text-blue-600 font-extrabold text-2xl">
//           Admin Panel
//         </span>
//         <button className="ml-auto p-2 rounded-full hover:bg-gray-100">
//           <svg width={24} height={24} fill="none" stroke="currentColor">
//             <path d="M6 9l6 6 6-6" />
//           </svg>
//         </button>
//       </div>
//       <nav className="space-y-2 font-medium text-gray-700">
//         {sidebarItems.map((item) => (
//           <button
//             key={item.label}
//             onClick={() => navigate(item.path)}
//             className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors
//               ${
//                 location.pathname === item.path
//                   ? "bg-blue-50 text-blue-600 font-semibold"
//                   : "hover:bg-gray-100 text-gray-800"
//               }
//             `}
//             style={{
//               fontWeight: location.pathname === item.path ? "600" : "400",
//               background:
//                 location.pathname === item.path ? "#eaf3ff" : undefined,
//             }}
//           >
//             {item.icon}
//             {item.label}
//           </button>
//         ))}
//       </nav>
//     </aside>
//   );
// }

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ SIGN OUT HANDLER
  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      try {
        const token = localStorage.getItem("token");

        // Call backend sign out endpoint
        await fetch("http://localhost:5000/api/auth/signout", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } catch (error) {
        console.error("Sign out error:", error);
        // Continue with local cleanup even if backend call fails
      } finally {
        // Clear all localStorage data
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        // Dispatch auth update event
        window.dispatchEvent(new Event("auth:update"));

        // Redirect to login
        window.location.href = "/login";
      }
    }
  };

  // Define sidebar items
  const sidebarItems = [
    {
      label: "Dashboard",
      path: "/dashboard/hr",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg
            width={20}
            height={20}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M3 10L10 3L17 10" stroke="#2563eb" />
            <rect x="6" y="10" width="8" height="7" rx="1" stroke="#2563eb" />
          </svg>
        </span>
      ),
    },
    {
      label: "Add Employee",
      path: "/dashboard/hr/add-employee",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="7" r="4" stroke="#222" />
            <path d="M5 21c0-4 4-7 9-7" stroke="#222" />
            <line x1="19" y1="8" x2="19" y2="14" stroke="#222" />
            <line x1="16" y1="11" x2="22" y2="11" stroke="#222" />
          </svg>
        </span>
      ),
    },
    {
      label: "Your Employees",
      path: "/dashboard/hr/our-employees",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="7" r="4" stroke="#222" />
            <path d="M2 21c0-4 3-7 7-7" stroke="#222" />
            <circle cx="17" cy="7" r="3" stroke="#222" />
            <path d="M22 21c0-3-2-6-5-6" stroke="#222" />
          </svg>
        </span>
      ),
    },
    {
      label: "Generate Report",
      path: "/dashboard/hr/GenerateReport",
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </span>
      ),
    },
    {
      label: "My Profile",
      path: "/hr/profile", // ✅ Fixed path (should match your route)
      icon: (
        <span className="mr-3 flex items-center justify-center w-6 h-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
      ),
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-gray-200 shadow-sm flex flex-col h-screen">
      {/* ✅ HEADER */}
      <div className="px-6 py-8">
        <div className="flex items-center mb-10">
          <span className="text-blue-600 font-extrabold text-2xl">
            HR Panel
          </span>
        </div>

        {/* ✅ NAVIGATION ITEMS */}
        <nav className="space-y-2 font-medium text-gray-700">
          {sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-all duration-200
                ${
                  location.pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-semibold border-r-4 border-blue-600"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }
              `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ✅ SIGN OUT SECTION (Bottom) */}
      <div className="mt-auto px-6 py-6 border-t border-gray-200">
        {/* ✅ USER INFO */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {localStorage.getItem("userName")?.charAt(0)?.toUpperCase() ||
                "U"}
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900">
                {localStorage.getItem("userName") || "User"}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {localStorage.getItem("role") || "HR Manager"}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ SIGN OUT BUTTON */}
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
          <span className="mr-3 flex items-center justify-center w-6 h-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
