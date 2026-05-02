import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster }       from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login             from "./pages/Login";
import Register          from "./pages/Register";
import Dashboard         from "./pages/Dashboard";
import Projects          from "./pages/Projects";
import ProjectDetail     from "./pages/ProjectDetail";
import NotFound          from "./pages/NotFound";
import Layout            from "./components/layout/Layout";

const FullPageSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="w-10 h-10 border-4 border-primary-500
                    border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login"
      element={<GuestRoute><Login /></GuestRoute>} />
    <Route path="/register"
      element={<GuestRoute><Register /></GuestRoute>} />

    <Route path="/"
      element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="dashboard"    element={<Dashboard />} />
      <Route path="projects"     element={<Projects />} />
      <Route path="projects/:id" element={<ProjectDetail />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}