import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store/api/useAuthStore";
import { useEffect } from "react";

const ProtectedRoute = () => {
  const { token, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
