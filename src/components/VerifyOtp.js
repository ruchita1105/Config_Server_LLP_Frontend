import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";
import { FaKey, FaSpinner } from "react-icons/fa";
import "../pages/Auth.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;
    
    setLoading(true);
    try {
      const response = await API.post("/api/auth/verify-otp", { 
        email, 
        otp 
      });
      toast.success(response.data.message);
      // Navigate to reset password with email
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid OTP");
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
        <h2 className="auth-title">Verify OTP</h2>
        <p className="auth-subtitle">
          Enter the 6-digit OTP sent to {email}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-icon">
              <FaKey />
            </span>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="form-control"
              required
              maxLength={6}
            />
          </div>

          <button className="auth-btn w-100 btn btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="spinner me-2" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <p className="auth-footer mt-3">
          Didn't receive OTP?{" "}
          <span 
            className="link" 
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: "pointer" }}
          >
            Resend OTP
          </span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;