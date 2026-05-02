export default function Card({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100
                  p-6 ${className} ${onClick ? "cursor-pointer" : ""}`}
    >
      {children}
    </div>
  );
}