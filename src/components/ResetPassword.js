// src/components/ResetPassword.js
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaLock, FaSpinner } from "react-icons/fa";
import "../pages/Auth.css";
import { showToast } from '../utils/toast';

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/auth/reset-password", { email, newPassword: password });
      showToast("success","Password reset successfully");
      
      navigate("/login");
    } catch {
      showToast('Reset failed. Try again.');
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
