import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (token && role === "user") {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default PublicRoute;
