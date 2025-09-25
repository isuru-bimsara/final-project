// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Home from "./pages/Home";
// // import RegisterPage from "./pages/RegisterPage";
// import RegisterShopOwner from "./pages/registerPages/RegisterShopOwner";
// import RegisterOthers from "./pages/registerPages/RegisterOthers";
// import RegisterSupplier from "./pages/registerPages/RegisterSupplier";
// import LoginPage from "./pages/LoginPage";
// // HR Dashboard
// import HrDashboard from "./dashboards/HRmanager/HrDashboard";
// import AddEmployee from "./dashboards/HRmanager/AddEmployee";
// import EmployeeDisplay from "./dashboards/HRmanager/DisplayEmployees";
// import GenerateReport from "./dashboards/HRmanager/GenerateReport";
// import UpdateEmployee from "./dashboards/HRmanager/UpdateEmployee";
// import HRprofile from "./dashboards/HRmanager/HRprofile";

// //shop owner dashboard
// import ShopOwnerDashboard from "./dashboards/ShopOwner/dashboard";

// import UserProfile from "./pages/UserProfile";

// //finance manager

// function ProtectedRoute({ children, requiredRole }) {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");
//   if (!token) return <Navigate to="/login" />;
//   if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;
//   return children;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />

//         <Route path="/register/shop-owner" element={<RegisterShopOwner />} />
//         <Route path="/register/others" element={<RegisterOthers />} />
//         <Route path="/register/supplier" element={<RegisterSupplier />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/profile" element={<UserProfile />} />
//       </Routes>

//       <Routes>
//         {/* HR Manager Routes */}
//         <Route
//           path="/dashboard/hr"
//           element={
//             <ProtectedRoute requiredRole="HRmanager">
//               <HrDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/hr/profile" element={<HRprofile />} />

//         <Route
//           path="/dashboard/hr/add-employee"
//           element={
//             <ProtectedRoute requiredRole="HRmanager">
//               <AddEmployee />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/dashboard/hr/our-employees"
//           element={
//             <ProtectedRoute requiredRole="HRmanager">
//               <EmployeeDisplay />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/dashboard/hr/GenerateReport"
//           element={<GenerateReport />}
//         />

//         <Route
//           path="/dashboard/hr/employee/update/:id"
//           element={
//             <ProtectedRoute requiredRole="HRmanager">
//               <UpdateEmployee />
//             </ProtectedRoute>
//           }
//         />

//         {/* shop owner dashboard */}
//         <Route
//           path="/dashboard/shopowner"
//           element={
//             <ProtectedRoute requiredRole="shopowner">
//               <ShopOwnerDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
// import RegisterPage from "./pages/RegisterPage";
import RegisterShopOwner from "./pages/registerPages/RegisterShopOwner";
import RegisterOthers from "./pages/registerPages/RegisterOthers";
import RegisterSupplier from "./pages/registerPages/RegisterSupplier";
import LoginPage from "./pages/LoginPage";
import AboutPage from "../src/components/routes/AboutPage";
import ContactUs from "./components/routes/ContactUs";
// HR Dashboard
import HrDashboard from "./dashboards/HRmanager/HrDashboard";
import AddEmployee from "./dashboards/HRmanager/AddEmployee";
import EmployeeDisplay from "./dashboards/HRmanager/DisplayEmployees";
import GenerateReport from "./dashboards/HRmanager/GenerateReport";
import UpdateEmployee from "./dashboards/HRmanager/UpdateEmployee";
import HRprofile from "./dashboards/HRmanager/HRprofile";

//shop owner dashboard
import ShopOwnerDashboard from "./dashboards/ShopOwner/dashboard";

import UserProfile from "./pages/UserProfile";

//finance manager
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Incomes from "./pages/Incomes";
import Salaries from "./pages/Salaries";
import TaxCompliance from "./pages/TaxCompliance";


function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/register/shop-owner" element={<RegisterShopOwner />} />
        <Route path="/register/others" element={<RegisterOthers />} />
        <Route path="/register/supplier" element={<RegisterSupplier />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>

      <Routes>
        {/* HR Manager Routes */}
        <Route
          path="/dashboard/hr"
          element={
            <ProtectedRoute requiredRole="HRmanager">
              <HrDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/hr/profile" element={<HRprofile />} />

        <Route
          path="/dashboard/hr/add-employee"
          element={
            <ProtectedRoute requiredRole="HRmanager">
              <AddEmployee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/hr/our-employees"
          element={
            <ProtectedRoute requiredRole="HRmanager">
              <EmployeeDisplay />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/hr/GenerateReport"
          element={<GenerateReport />}
        />

        <Route
          path="/dashboard/hr/employee/update/:id"
          element={
            <ProtectedRoute requiredRole="HRmanager">
              <UpdateEmployee />
            </ProtectedRoute>
          }
        />

        {/* shop owner dashboard */}
        <Route
          path="/dashboard/shopowner"
          element={
            <ProtectedRoute requiredRole="shopowner">
              <ShopOwnerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* finance manager routes */}
      <Routes>
        <Route path="/financedashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/incomes" element={<Incomes />} />
        <Route path="/salaries" element={<Salaries />} />
        <Route path="/tax-compliance" element={<TaxCompliance />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
