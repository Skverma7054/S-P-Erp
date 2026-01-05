import { Navigate, Outlet } from "react-router";
import { useAuth } from "../pages/AuthPages/AuthProvider";

export default function PublicRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  // ✅ Already logged in → redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
