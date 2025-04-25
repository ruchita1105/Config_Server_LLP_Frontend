// src/App.js
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AdminDashboard from './dashboards/AdminDashboard';
import UserDashboard from './dashboards/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UserForm from './users/UserForm';
import UserTask from './usertask/UserTask';
import AddTask from "./usertask/AddTask";
import TaskList from './usertask/TaskList';
import UpdateTask from './usertask/UpdateTask';
import SessionTimeoutModal from "./components/SessionTimeoutModal";
import ForgotPassword from "./components/ForgotPassword";
import VerifyOtp from "./components/VerifyOtp";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import API, { setOnTokenExpired } from "./services/api";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const modalShownRef = useRef(false);
  const countdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    setShowTimeoutModal(false);
    modalShownRef.current = false;
    clearInterval(countdownRef.current);
    navigate("/login", { replace: true });
  };

  const handleContinue = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await API.post("api/auth/refresh-token", { refreshToken });
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      setShowTimeoutModal(false);
      modalShownRef.current = false;
      clearInterval(countdownRef.current);
    } catch (error) {
      handleLogout();
    }
  };

  useEffect(() => {
    setOnTokenExpired(() => setShowTimeoutModal(true));

    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now();
        const expiryTime = exp * 1000;
        const timeLeft = expiryTime - currentTime;

        if (timeLeft <= 5000 && timeLeft > 0 && !modalShownRef.current) {
          modalShownRef.current = true;
          setShowTimeoutModal(true);
          setCountdown(5);

          countdownRef.current = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownRef.current);
                handleLogout();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch (err) {}
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <div className="App">
      <Routes location={location}>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp key={location.key} /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute allowedRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user-form" element={<ProtectedRoute allowedRole="user"><UserForm /></ProtectedRoute>} />
        <Route path="/user/tasks" element={<ProtectedRoute allowedRole="user"><UserTask /></ProtectedRoute>} />
        <Route path="/add-tasks" element={<ProtectedRoute allowedRole="user"><AddTask /></ProtectedRoute>} />
        <Route path="/edit-task/:taskId" element={<ProtectedRoute allowedRole="user"><UpdateTask /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute allowedRole="user"><TaskList /></ProtectedRoute>} />
      </Routes>

    
      <ToastContainer position="top-center" autoClose={3000} />
      <SessionTimeoutModal
        show={showTimeoutModal}
        onLogout={handleLogout}
        onContinue={handleContinue}
        countdown={countdown}
      />
    </div>
  );
}

export default App;
