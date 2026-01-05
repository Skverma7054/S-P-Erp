import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../pages/AuthPages/AuthProvider";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ⏳ Wait for auth check (page refresh case)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ❌ Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // ✅ Authenticated → allow access
  return <Outlet />;
}
