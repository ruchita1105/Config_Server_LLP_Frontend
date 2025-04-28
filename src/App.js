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
    
    navigate("/login", { 
      replace: true,
      state: { 
        from: "logout",
        preventBack: true 
      }
    });
    
    // Clear history stack
    if (window.history && window.history.pushState) {
      window.history.pushState(null, "", window.location.href);
    }
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

    // Handle token expiration check
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
      } catch (err) {
        console.error("Token parsing error:", err);
      }
    }, 1000);

    // Handle navigation control
    const handlePopState = (event) => {
      if (location.state?.preventBack) {
        navigate("/login", { replace: true });
      }
      
      // Block navigation during password reset flow
      const inPasswordFlow = ['/forgot-password', '/verify-otp', '/reset-password']
        .some(path => location.pathname.includes(path));
      
      if (inPasswordFlow) {
        navigate(location.pathname, { replace: true });
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      clearInterval(interval);
      clearInterval(countdownRef.current);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location, navigate]);

  return (
    <div className="App">
      <Routes location={location}>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login onLoginSuccess={() => window.history.replaceState(null, "", "/")} /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp key={location.key} /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRole="admin" onUnauthorized={handleLogout}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute allowedRole="user" onUnauthorized={handleLogout}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user-form" element={<ProtectedRoute allowedRole="user" onUnauthorized={handleLogout}><UserForm /></ProtectedRoute>} />
        <Route path="/user/tasks" element={<ProtectedRoute allowedRole="user" onUnauthorized={handleLogout}><UserTask /></ProtectedRoute>} />
        <Route path="/add-tasks" element={<ProtectedRoute allowedRole="user" onUnauthorized={handleLogout}><AddTask /></ProtectedRoute>} />
        <Route path="/edit-task/:taskId" element={<ProtectedRoute allowedRole="user" onUnauthorized={handleLogout}><UpdateTask /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute allowedRole="user" onUnauthorized={handleLogout}><TaskList /></ProtectedRoute>} />
      </Routes>

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