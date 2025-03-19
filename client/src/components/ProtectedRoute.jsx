import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while authentication is being verified
  if (loading) return <div>Loading...</div>;

  // Redirect to login if not authenticated
  if (!isAuthenticated) return <Navigate to="/" replace />;

  // Restrict access based on user role
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;



