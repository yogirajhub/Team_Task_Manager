import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-7xl font-bold text-primary-600">404</h1>
      <p className="text-xl text-gray-600 mt-4">Page not found</p>
      <Link to="/dashboard"
        className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-lg
                   hover:bg-primary-700 transition font-medium">
        Back to Dashboard
      </Link>
    </div>
  );
}