import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaKey, FaSpinner } from "react-icons/fa";
import Alert from "./Alert";
import "../pages/Auth.css";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !otp) return;

    setLoading(true);
    try {
      await API.post("/api/auth/verify-otp", { email, otp });
      setAlert({
        type: 'success',
        message: 'OTP verified. Reset your password.',
        onClose: () => navigate("/reset-password", { state: { email } })
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Invalid OTP. Try again.'
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
        <h2 className="auth-title">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-icon"><FaKey /></span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter OTP"
              className="form-control"
              required
            />
          </div>
          <button className="auth-btn btn btn-primary w-100" disabled={loading}>
            {loading ? <><FaSpinner className="spinner me-2" /> Verifying...</> : "Verify OTP"}
          </button>
        </form>
        <p className="auth-footer mt-3">
          Didn't receive OTP? <span className="link" onClick={() => navigate('/forgot-password')}>Resend OTP</span>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;