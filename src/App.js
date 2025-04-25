import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from './dashboards/AdminDashboard';
import UserDashboard from './dashboards/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserForm from './users/UserForm';
import ViewTask from './usertask/ViewTask';
import UserTask from './usertask/UserTask';
import AddTask from "./usertask/AddTask";
import TaskList from './usertask/TaskList';
import UpdateTask from './usertask/UpdateTask';
import SessionTimeoutModal from "./components/SessionTimeoutModal";
import { setOnTokenExpired } from "./services/api";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/ResetPassword";
import API from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ New imports for UnauthenticatedRoute
import UnauthenticatedRoute from './components/UnauthenticatedRoute'; 

import { ToastContainer } from "react-toastify"; // ✅ Toast container import
import "react-toastify/dist/ReactToastify.css";  // ✅ Toast styles

function App() {
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && ["/", "/login", "/register"].includes(location.pathname)) {
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "user") navigate("/user", { replace: true });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setShowTimeoutModal(false);
    navigate("/login", { replace: true });
  };

  const handleContinue = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await API.post("api/auth/refresh-token", { refreshToken });
      localStorage.setItem("token", response.data.token);
      API.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      setShowTimeoutModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Token refresh failed:", error);
      handleLogout();
    }
  };

  useEffect(() => {
    setOnTokenExpired(() => {
      if (localStorage.getItem("token")) setShowTimeoutModal(true);
    });

    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { exp } = JSON.parse(atob(token.split('.')[1]));
          if (Date.now() >= exp * 1000) setShowTimeoutModal(true);
        } catch (err) {
          console.error("Token parsing error:", err);
        }
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ✅ Add UnauthenticatedRoute for ForgotPassword, VerifyOtp, and ResetPassword */}
        <Route path="/forgot-password" element={<UnauthenticatedRoute><ForgotPassword /></UnauthenticatedRoute>} />
        <Route path="/verify-otp" element={<UnauthenticatedRoute><VerifyOtp /></UnauthenticatedRoute>} />
        <Route path="/reset-password" element={<UnauthenticatedRoute><ResetPassword /></UnauthenticatedRoute>} />

        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user-form" element={<ProtectedRoute allowedRole="admin"><UserForm /></ProtectedRoute>} />
        <Route path="/user/tasks" element={<ProtectedRoute allowedRole="user"><UserTask /></ProtectedRoute>} />
        <Route path="/add-tasks" element={<ProtectedRoute allowedRole="user"><AddTask /></ProtectedRoute>} />
        <Route path="/edit-task/:taskId" element={<ProtectedRoute allowedRole="user"><UpdateTask /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute allowedRole="user"><TaskList /></ProtectedRoute>} />
        <Route path="/view-task/:taskId" element={<ProtectedRoute allowedRole="user"><ViewTask /></ProtectedRoute>} />
      </Routes>

      <SessionTimeoutModal show={showTimeoutModal} onLogout={handleLogout} onContinue={handleContinue} />

      {/* ✅ This enables all toast notifications like login errors */}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} />
    </div>
  );
}

export default App;
