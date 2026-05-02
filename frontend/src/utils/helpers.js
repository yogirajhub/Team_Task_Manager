// Format date to readable string
export const formatDate = (date) => {
  if (!date) return "No due date";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
};

// Check if a date is overdue
export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === "done") return false;
  return new Date(dueDate) < new Date();
};

// Status badge color map
export const statusColors = {
  "todo":        "bg-gray-100 text-gray-700",
  "in-progress": "bg-blue-100 text-blue-700",
  "done":        "bg-green-100 text-green-700",
};

// Priority badge color map
export const priorityColors = {
  low:    "bg-slate-100 text-slate-600",
  medium: "bg-yellow-100 text-yellow-700",
  high:   "bg-red-100 text-red-700",
};

// Get user initials for avatar
export const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// Store and retrieve token
export const getToken = () => localStorage.getItem("token");
export const setToken = (token) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");