import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaLock, FaSpinner } from "react-icons/fa";
import "../pages/Auth.css";

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
      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/api/auth/reset-password", { 
        email, 
        newPassword: password 
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to reset password");
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
        <p className="auth-subtitle">Create a new password for {email}</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-icon">
              <FaLock />
            </span>
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
            <span className="input-icon">
              <FaLock />
            </span>
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

          <button className="auth-btn w-100 btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner me-2" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;