// //frontend/src/dashboards/HRmanager/GenerateReport.jsx

// import React, { useEffect, useState } from "react";
// import Sidebar from "./HRsidebar";
// import axios from "axios";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// export default function GenerateReport() {
//   const [employees, setEmployees] = useState([]);
//   const [department, setDepartment] = useState("All");
//   const [loading, setLoading] = useState(false);

//   // Get departments from employees
//   const departmentOptions = [
//     "All",
//     ...Array.from(new Set(employees.map((emp) => emp.department))).filter(
//       Boolean
//     ),
//   ];

//   useEffect(() => {
//     const fetchEmployees = async () => {
//       setLoading(true);
//       try {
//         const token = localStorage.getItem("token");
//         const params = {};
//         if (department && department !== "All") params.department = department;
//         const res = await axios.get("http://localhost:5000/api/employee/list", {
//           headers: { Authorization: `Bearer ${token}` },
//           params,
//         });
//         setEmployees(res.data.employees);
//       } catch (err) {
//         setEmployees([]);
//       }
//       setLoading(false);
//     };
//     fetchEmployees();
//   }, [department]);

//   // Format date
//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
//   };

//   // Generate PDF with error handling
//   const handleGeneratePDF = () => {
//     try {
//       const doc = new jsPDF();
//       doc.text(`Employee Report (${department} Department)`, 14, 18);

//       const columns = [
//         "EMPLOYEE ID",
//         "NAME",
//         "POSITION",
//         "DEPARTMENT",
//         "CONTACT NUMBER",
//         "ADDRESS",
//         "DATE",
//       ];
//       const rows = employees.map((emp) => [
//         emp.employeeID,
//         emp.name,
//         emp.position,
//         emp.department,
//         emp.contactNumber,
//         emp.address,
//         formatDate(emp.createdAt),
//       ]);

//       // Check that rows is not empty
//       if (rows.length === 0) {
//         alert("No employees to generate PDF!");
//         return;
//       }

//       doc.autoTable({
//         startY: 25,
//         head: [columns],
//         body: rows,
//         styles: { fontSize: 10 },
//       });
//       doc.save(`Employee_Report_${department}.pdf`);
//     } catch (err) {
//       alert("PDF generation failed: " + err.message);
//       console.error(err);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar />
//       <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
//         <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl flex flex-col items-center">
//           <h1 className="text-2xl font-bold mb-6 text-blue-700">
//             Generate Employee Report
//           </h1>
//           <div className="flex gap-4 mb-6">
//             <select
//               value={department}
//               onChange={(e) => setDepartment(e.target.value)}
//               className="border rounded-lg px-4 py-2"
//             >
//               {departmentOptions.map((dep) => (
//                 <option key={dep} value={dep}>
//                   {dep}
//                 </option>
//               ))}
//             </select>
//             <button
//               onClick={handleGeneratePDF}
//               disabled={loading || employees.length === 0}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
//               style={{ minWidth: 140 }}
//             >
//               {loading ? "Loading..." : "Generate PDF"}
//             </button>
//           </div>
//           <div className="w-full">
//             <div className="text-gray-500 mb-2 font-semibold">
//               {employees.length} employees found
//             </div>
//             <div className="bg-gray-50 rounded p-3">
//               <ul>
//                 {employees.map((emp) => (
//                   <li
//                     key={emp._id}
//                     className="mb-2 border-b pb-2 last:border-none"
//                   >
//                     <span className="font-bold">{emp.employeeID}</span> —{" "}
//                     {emp.name} ({emp.department})
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import Sidebar from "./HRsidebar";
import axios from "axios";
import { createBeautifulEmployeePDF } from "./pdfGenerator";

export default function GenerateReport() {
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState("All");
  const [loading, setLoading] = useState(false);

  // Get departments from employees
  const departmentOptions = [
    "All",
    ...Array.from(new Set(employees.map((emp) => emp.department))).filter(
      Boolean
    ),
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = {};
        if (department && department !== "All") params.department = department;
        const res = await axios.get("http://localhost:5000/api/employee/list", {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setEmployees(res.data.employees);
      } catch (err) {
        setEmployees([]);
      }
      setLoading(false);
    };
    fetchEmployees();
  }, [department]);

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  // Generate PDF with beautiful structure
  const handleGeneratePDF = () => {
    try {
      // Check that employees exist
      if (employees.length === 0) {
        alert("No employees to generate PDF!");
        return;
      }

      // Current user info
      const currentUser = {
        name: localStorage.getItem("userName") || "HR Manager",
        role: localStorage.getItem("role") || "HRmanager",
      };

      // Call the beautiful PDF generator
      createBeautifulEmployeePDF({
        employees,
        department,
        currentUser,
        formatDate,
      });
    } catch (err) {
      alert("PDF generation failed: " + err.message);
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6 text-blue-700">
            Generate Employee Report
          </h1>
          <div className="flex gap-4 mb-6">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="border rounded-lg px-4 py-2"
            >
              {departmentOptions.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
            <button
              onClick={handleGeneratePDF}
              disabled={loading || employees.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
              style={{ minWidth: 140 }}
            >
              {loading ? "Loading..." : "Generate PDF"}
            </button>
          </div>
          <div className="w-full">
            <div className="text-gray-500 mb-2 font-semibold">
              {employees.length} employees found
            </div>
            <div className="bg-gray-50 rounded p-3">
              <ul>
                {employees.map((emp) => (
                  <li
                    key={emp._id}
                    className="mb-2 border-b pb-2 last:border-none"
                  >
                    <span className="font-bold">{emp.employeeID}</span> —{" "}
                    {emp.name} ({emp.department})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
