import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole, onUnauthorized }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      onUnauthorized?.();
      navigate("/login", {
        replace: true,
        state: { 
          from: location.pathname,
          preventBack: true 
        }
      });
    } else if (allowedRole && role !== allowedRole) {
      navigate("/unauthorized", { replace: true });
    }
  }, [token, role, allowedRole, navigate, location, onUnauthorized]);

  if (!token || (allowedRole && role !== allowedRole)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;