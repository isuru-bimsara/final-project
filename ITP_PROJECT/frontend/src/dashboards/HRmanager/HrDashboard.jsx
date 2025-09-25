//frontend/src/dashboards/HRmanager/HrDashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "./HRsidebar";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Icons
const UserIcon = () => (
  <span className="inline-block bg-blue-100 text-blue-600 rounded-full p-2">
    <svg width={24} height={24} fill="none" stroke="currentColor">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
    </svg>
  </span>
);

const ManagerIcon = () => (
  <span className="inline-block bg-purple-100 text-purple-600 rounded-full p-2">
    <svg
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  </span>
);

const getRoleBadgeColor = (role) => {
  const colors = {
    "HR Manager": "bg-blue-100 text-blue-800",
    "Financial Manager": "bg-green-100 text-green-800",
    "Order Supply Manager": "bg-yellow-100 text-yellow-800",
    "Delivery Manager": "bg-purple-100 text-purple-800",
    "Feedback Service Manager": "bg-pink-100 text-pink-800",
  };
  return colors[role] || "bg-gray-100 text-gray-800";
};

export default function HrDashboard() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [managersLoading, setManagersLoading] = useState(false);
  const [departmentCounts, setDepartmentCounts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("employees"); // "employees" or "managers"

  // Fetch department counts
  useEffect(() => {
    const fetchDepartmentCounts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/employee/department-counts",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setDepartmentCounts(data.counts);
      } catch (err) {
        setDepartmentCounts([]);
      }
    };
    fetchDepartmentCounts();
  }, []);

  // Fetch employees (with search)
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = new URL("http://localhost:5000/api/employee/all");
        if (search) url.searchParams.append("search", search);
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAllEmployees(data.employees);
      } catch (err) {
        setAllEmployees([]);
      }
      setLoading(false);
    };
    fetchAllEmployees();
  }, [search]);

  // Fetch managers
  useEffect(() => {
    const fetchAllManagers = async () => {
      setManagersLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/user/managers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setAllManagers(data.managers);
        }
      } catch (err) {
        console.error("Error fetching managers:", err);
        setAllManagers([]);
      }
      setManagersLoading(false);
    };
    fetchAllManagers();
  }, []);

  // PDF generation function
  const handleGenerateReport = () => {
    const doc = new jsPDF();

    if (activeTab === "employees") {
      doc.text("Employee Report", 14, 10);

      const tableColumn = [
        "EMPLOYEE ID",
        "NAME",
        "POSITION",
        "DEPARTMENT",
        "CONTACT",
        "ADDRESS",
        "DATE ADDED",
      ];
      const tableRows = allEmployees.map((emp) => [
        emp.employeeID,
        emp.name,
        emp.position,
        emp.department,
        emp.contactNumber,
        emp.address,
        new Date(emp.createdAt).toLocaleDateString(),
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save("employee_report.pdf");
    } else {
      doc.text("Managers Report", 14, 10);

      const tableColumn = [
        "MANAGER ID",
        "NAME",
        "ROLE",
        "DEPARTMENT",
        "EMAIL",
        "CONTACT",
        "JOIN DATE",
      ];
      const tableRows = allManagers.map((manager) => [
        manager.managerId,
        manager.name,
        manager.role,
        manager.department,
        manager.email,
        manager.contactNumber,
        new Date(manager.joinDate).toLocaleDateString(),
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [147, 51, 234] },
      });

      doc.save("managers_report.pdf");
    }
  };

  // Helper: get count for a department
  const getDepartmentCount = (deptName) => {
    const found = departmentCounts.find((dep) => dep._id === deptName);
    return found ? found.count : 0;
  };

  // List unique department names for cards
  const uniqueDepartments = departmentCounts.map((dep) => dep._id || "Unknown");

  // Get manager counts by role
  const managerRoleCounts = allManagers.reduce((acc, manager) => {
    acc[manager.role] = (acc[manager.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="p-10">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <div className="text-3xl font-bold text-gray-900">Overview</div>
              <div className="text-gray-500">Dashboard</div>
            </div>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search by id, name, department, etc..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100"
                style={{ width: "240px" }}
              />
              <span className="text-gray-500 font-medium ml-4">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </header>

          {/* Welcome Box */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-gray-800 mb-2">
                  Welcome back!!
                </div>
                <div className="text-gray-500">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
                onClick={handleGenerateReport}
              >
                Generate {activeTab === "employees" ? "Employee" : "Manager"}{" "}
                Report
              </button>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Total Employees Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-between border-4 border-blue-600">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  Total Employees
                </div>
                <div className="text-6xl font-extrabold text-blue-700 mb-2">
                  {allEmployees.length}
                </div>
              </div>
              <UserIcon />
            </div>

            {/* Total Managers Card */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-between border-4 border-purple-600">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  Total Managers
                </div>
                <div className="text-6xl font-extrabold text-purple-700 mb-2">
                  {allManagers.length}
                </div>
              </div>
              <ManagerIcon />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow mb-8">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("employees")}
                className={`px-6 py-4 font-medium text-sm focus:outline-none transition-colors ${
                  activeTab === "employees"
                    ? "border-b-2 border-blue-600 text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <UserIcon />
                  <span className="ml-2">Employees ({allEmployees.length})</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("managers")}
                className={`px-6 py-4 font-medium text-sm focus:outline-none transition-colors ${
                  activeTab === "managers"
                    ? "border-b-2 border-purple-600 text-purple-600 bg-purple-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <ManagerIcon />
                  <span className="ml-2">Managers ({allManagers.length})</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "employees" ? (
                <>
                  {/* Department Cards for Employees */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {uniqueDepartments.map((dept) => (
                      <div
                        key={dept}
                        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 flex items-center border border-blue-200"
                      >
                        <div className="flex-1">
                          <div className="text-blue-600 font-medium">
                            {dept} Employees
                          </div>
                          <div className="text-3xl font-bold text-blue-700 mb-2">
                            {getDepartmentCount(dept)}
                          </div>
                        </div>
                        <UserIcon />
                      </div>
                    ))}
                  </div>

                  {/* Employees Table */}
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">
                        All Employees
                      </h3>
                    </div>
                    {loading ? (
                      <div className="py-10 text-center text-blue-600 font-bold">
                        Loading...
                      </div>
                    ) : allEmployees.length === 0 ? (
                      <div className="py-10 text-center text-gray-400">
                        No employees found.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-gray-500 text-left text-sm border-b bg-gray-50">
                              <th className="py-3 px-6">EMPLOYEE ID</th>
                              <th className="py-3 px-6">NAME</th>
                              <th className="py-3 px-6">POSITION</th>
                              <th className="py-3 px-6">DEPARTMENT</th>
                              <th className="py-3 px-6">CONTACT</th>
                              <th className="py-3 px-6">ADDRESS</th>
                              <th className="py-3 px-6">DATE ADDED</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allEmployees.map((emp) => (
                              <tr
                                key={emp._id}
                                className="border-b last:border-none hover:bg-blue-50 transition"
                              >
                                <td className="py-4 px-6 font-semibold">
                                  {emp.employeeID}
                                </td>
                                <td className="py-4 px-6">{emp.name}</td>
                                <td className="py-4 px-6">{emp.position}</td>
                                <td className="py-4 px-6">{emp.department}</td>
                                <td className="py-4 px-6">{emp.contactNumber}</td>
                                <td className="py-4 px-6">{emp.address}</td>
                                <td className="py-4 px-6">
                                  {new Date(emp.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Manager Role Cards */}
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    {Object.entries(managerRoleCounts).map(([role, count]) => (
                      <div
                        key={role}
                        className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 flex items-center border border-purple-200"
                      >
                        <div className="flex-1">
                          <div className="text-purple-600 font-medium">
                            {role}s
                          </div>
                          <div className="text-3xl font-bold text-purple-700 mb-2">
                            {count}
                          </div>
                        </div>
                        <ManagerIcon />
                      </div>
                    ))}
                  </div>

                  {/* Managers Table */}
                  <div className="bg-white rounded-xl border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">
                        All Managers
                      </h3>
                    </div>
                    {managersLoading ? (
                      <div className="py-10 text-center text-purple-600 font-bold">
                        Loading managers...
                      </div>
                    ) : allManagers.length === 0 ? (
                      <div className="py-10 text-center text-gray-400">
                        No managers found.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead>
                            <tr className="text-gray-500 text-left text-sm border-b bg-gray-50">
                              <th className="py-3 px-6">MANAGER ID</th>
                              <th className="py-3 px-6">NAME</th>
                              <th className="py-3 px-6">ROLE</th>
                              <th className="py-3 px-6">DEPARTMENT</th>
                              <th className="py-3 px-6">EMAIL</th>
                              <th className="py-3 px-6">CONTACT</th>
                              <th className="py-3 px-6">JOIN DATE</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allManagers.map((manager) => (
                              <tr
                                key={manager.id}
                                className="border-b last:border-none hover:bg-purple-50 transition"
                              >
                                <td className="py-4 px-6 font-semibold">
                                  {manager.managerId}
                                </td>
                                <td className="py-4 px-6 font-medium">
                                  {manager.name}
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                                      manager.role
                                    )}`}
                                  >
                                    {manager.role}
                                  </span>
                                </td>
                                <td className="py-4 px-6">
                                  {manager.department}
                                </td>
                                <td className="py-4 px-6 text-blue-600">
                                  {manager.email}
                                </td>
                                <td className="py-4 px-6">
                                  {manager.contactNumber}
                                </td>
                                <td className="py-4 px-6">
                                  {new Date(
                                    manager.joinDate
                                  ).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}