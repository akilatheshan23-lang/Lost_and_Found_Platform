import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { token, user } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}
