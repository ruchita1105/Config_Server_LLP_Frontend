// src/components/UnauthenticatedRoute.js

import { Navigate } from "react-router-dom";

const UnauthenticatedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    // Agar user login hai, to uske role ke hisaab se dashboard pe bhejo
    return <Navigate to={role === "admin" ? "/admin" : "/user"} replace />;
  }

  // Agar user login nahi hai, to usse page access karne do
  return children;
};

export default UnauthenticatedRoute;
