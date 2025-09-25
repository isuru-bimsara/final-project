// Roles (excluding shopowner for the "others" page)
export const OTHER_ROLE_OPTIONS = [
  { value: "HRmanager", label: "HR Manager", department: "HR" },
  {
    value: "ordersupplymanager",
    label: "Order & Supply Manager",
    department: "order and supply",
  },

  {
    value: "financialmanager",
    label: "Financial Manager",
    department: "finance",
  },
  {
    value: "deliverymanager",
    label: "Delivery Manager",
    department: "delivery",
  },
  {
    value: "feedbackservicemanager",
    label: "Feedback Service Manager",
    department: "customer service",
  },
];

// Shop types for shop owners
export const SHOP_TYPES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];
