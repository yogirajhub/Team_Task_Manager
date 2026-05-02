export default function Button({
  children, onClick, type = "button", variant = "primary",
  size = "md", disabled = false, fullWidth = false, className = ""
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:   "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 focus:ring-gray-400",
    danger:    "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    outline:   "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-400",
    ghost:     "hover:bg-gray-100 text-gray-600 focus:ring-gray-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]}
                  ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </button>
  );
}