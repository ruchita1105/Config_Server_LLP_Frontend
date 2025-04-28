import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaLock, FaSpinner } from "react-icons/fa";
import Alert from "./Alert"; 

import "../pages/Auth.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setAlert({
        type: 'error',
        message: 'Passwords do not match'
      });
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/auth/reset-password", { email, newPassword: password });
      setAlert({
        type: 'success',
        message: 'Password reset successfully',
        onClose: () => navigate("/login")
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Reset failed. Try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  return (
    <div className="auth-container">
      {alert && <Alert {...alert} />}
      <div className="auth-box">
        <h2 className="auth-title">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-icon"><FaLock /></span>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
              minLength={6}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-icon"><FaLock /></span>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-control"
              required
              minLength={6}
            />
          </div>
          <button className="auth-btn btn btn-primary w-100" disabled={loading}>
            {loading ? <><FaSpinner className="spinner me-2" /> Resetting...</> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;