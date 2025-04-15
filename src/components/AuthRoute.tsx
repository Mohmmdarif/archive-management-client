import { JSX, useEffect } from "react";
import { Navigate } from "react-router";
import useAuthStore from "../store/api/useAuthStore";

interface AuthRouteProps {
  publicOnly?: boolean; // jika true, route hanya bisa diakses user yang belum login
  children: JSX.Element;
}

const AuthRoute = ({ publicOnly = false, children }: AuthRouteProps) => {
  const { token, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Jika route untuk pengguna yang belum login dan token ada, redirect ke dashboard
  if (publicOnly && token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Jika route private dan token tidak ada, redirect ke login
  if (!publicOnly && !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthRoute;
