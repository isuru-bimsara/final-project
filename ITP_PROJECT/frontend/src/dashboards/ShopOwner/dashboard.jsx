//frontend/src/dashboards/ShopOwner/dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiPackage,
  FiRefreshCcw,
  FiPlus,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function ShopOwnerDashboard() {
  const navigate = useNavigate();

  // Placeholder state (replace with real API calls)
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayOrders: 0,
    activeEmployees: 0,
    monthlyRevenue: 0,
    inventoryItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    // Simulate async fetch
    const timer = setTimeout(() => {
      setStats({
        todayOrders: 12,
        activeEmployees: 37,
        monthlyRevenue: 84250,
        inventoryItems: 1543,
      });
      setRecentOrders([
        {
          id: "ORD-1001",
          customer: "Alpha Textiles",
          amount: 1250,
          status: "Processing",
          date: "2025-09-18",
        },
        {
          id: "ORD-1000",
          customer: "Nova Garments",
          amount: 980,
          status: "Shipped",
          date: "2025-09-18",
        },
        {
          id: "ORD-0999",
          customer: "Bright Wear",
          amount: 415,
          status: "Pending",
          date: "2025-09-17",
        },
        {
          id: "ORD-0998",
          customer: "Skyline Ltd",
          amount: 2210,
          status: "Delivered",
          date: "2025-09-17",
        },
      ]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const kpi = [
    {
      label: "Today's Orders",
      value: stats.todayOrders,
      icon: <FiShoppingCart />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Employees",
      value: stats.activeEmployees,
      icon: <FiUsers />,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Monthly Revenue",
      value: "Rs " + stats.monthlyRevenue.toLocaleString(),
      icon: <FiTrendingUp />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Inventory Items",
      value: stats.inventoryItems,
      icon: <FiPackage />,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const refresh = () => {
    setLoading(true);
    // You would re-fetch real data here
    setTimeout(() => setLoading(false), 600);
  };

  return (
    <div className="p-6 md:p-10 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Shop Owner Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of today’s performance and quick actions.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition"
          >
            <FiRefreshCcw /> {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => navigate("/orders/new")}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition"
          >
            <FiPlus /> New Order
          </button>
        </div>
      </header>

      {/* KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpi.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4"
          >
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${card.color}`}
            >
              {card.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">
                {card.label}
              </div>
              <div className="text-xl font-semibold text-gray-800 mt-1">
                {loading ? "..." : card.value}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT ORDERS */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <button
              onClick={() => navigate("/orders")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left px-6 py-3 font-medium">Order ID</th>
                  <th className="text-left px-6 py-3 font-medium">Customer</th>
                  <th className="text-left px-6 py-3 font-medium">
                    Amount (Rs)
                  </th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-left px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-center text-gray-400"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
                {!loading &&
                  recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-gray-100 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-3 font-medium text-gray-800">
                        {o.id}
                      </td>
                      <td className="px-6 py-3 text-gray-700">{o.customer}</td>
                      <td className="px-6 py-3 text-gray-700">
                        {o.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-3 text-gray-500">{o.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* QUICK ACTIONS / SIDEBAR */}
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickAction
                label="New Order"
                icon={<FiPlus />}
                onClick={() => navigate("/orders/new")}
              />
              <QuickAction
                label="Reports"
                icon={<FiBarChart2 />}
                onClick={() => navigate("/reports")}
              />
              <QuickAction
                label="Employees"
                icon={<FiUsers />}
                onClick={() => navigate("/employees")}
              />
              <QuickAction
                label="Settings"
                icon={<FiSettings />}
                onClick={() => navigate("/settings")}
              />
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow">
            <h4 className="font-semibold text-lg">Growth Tip</h4>
            <p className="text-sm mt-2 text-blue-100 leading-relaxed">
              Track daily orders and inventory turnover to prevent stockouts and
              identify top‑performing product lines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "px-2.5 py-1 rounded-full text-xs font-medium inline-block capitalize";
  const map = {
    Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Processing: "bg-blue-50 text-blue-700 border border-blue-200",
    Shipped: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    Delivered: "bg-green-50 text-green-700 border border-green-200",
    Cancelled: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span className={`${base} ${map[status] || "bg-gray-100"}`}>{status}</span>
  );
}

function QuickAction({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 py-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
