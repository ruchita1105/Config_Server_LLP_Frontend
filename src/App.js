import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
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


function App() {
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const navigate = useNavigate();

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

  // useEffect(() => {
  //   setOnTokenExpired(() => setShowTimeoutModal(true));

  //   const checkTokenExpiration = setInterval(() => {
  //     const token = localStorage.getItem("token");
  //     if (token) {
  //       try {
  //         const { exp } = JSON.parse(atob(token.split('.')[1]));
  //         if (Date.now() >= exp * 1000) {
  //           setShowTimeoutModal(true);
  //         }
  //       } catch (err) {
  //         console.error("Token parsing error:", err);
  //       }
  //     }
  //   }, 60000);

  //   return () => clearInterval(checkTokenExpiration);
  // }, []);
  useEffect(() => {
    // Register callback for API-level token expiration
    setOnTokenExpired(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setShowTimeoutModal(true);
      }
    });
  
    const intervalId = setInterval(() => {
      const token = localStorage.getItem("token");
  
      // Only run expiration logic if token is valid
      if (token) {
        try {
          const { exp } = JSON.parse(atob(token.split('.')[1]));
          if (Date.now() >= exp * 1000) {
            setShowTimeoutModal(true);
          }
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
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/user-form" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
        <Route path="/user/tasks" element={<ProtectedRoute><UserTask /></ProtectedRoute>} />
        <Route path="/add-tasks" element={<ProtectedRoute><AddTask /></ProtectedRoute>} />
        <Route path="/edit-task/:taskId" element={<ProtectedRoute><UpdateTask /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
        <Route path="/view-task/:taskId" element={<ProtectedRoute><ViewTask /></ProtectedRoute>} />
      </Routes>

      <SessionTimeoutModal
        show={showTimeoutModal}
        onLogout={handleLogout}
        onContinue={handleContinue}
      />
    </div>
  );
}

export default App;
