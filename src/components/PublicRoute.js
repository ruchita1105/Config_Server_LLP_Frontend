import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token) {
      const redirectPath = role === "admin" ? "/admin" : "/user";
      navigate(redirectPath, { 
        replace: true,
        state: { preventBack: false } 
      });
    }
  }, [token, role, navigate]);

  return !token ? children : null;
};

export default PublicRoute;