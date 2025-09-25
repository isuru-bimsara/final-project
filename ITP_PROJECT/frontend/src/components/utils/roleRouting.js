//frontend/src/components/utils/roleRouting.js

export const roleDashboardMap = {
  HRmanager: "/dashboard/hr",
  financialmanager: "/dashboard/finance",
  ordersupplymanager: "/dashboard/order-supply",
  shopowner: "/dashboard/shopowner",
  supplier: "/dashboard/supplier",
  deliverymanager: "/dashboard/delivery",
  feedbackservicemanager: "/dashboard/feedback",
};

// Returns best guess path for a role (fallback: generic dashboard)
export function getDashboardPath(role) {
  return roleDashboardMap[role] || "/dashboard";
}
