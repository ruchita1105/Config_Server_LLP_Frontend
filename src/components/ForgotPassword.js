import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import '../pages/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      toast.success(response.data.message);
      // Navigate to OTP verification page with email state
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email to receive OTP</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group mb-3">
            <span className="input-icon">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button 
            className="auth-btn w-100 btn btn-primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner me-2" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>

        <p className="auth-footer mt-3">
          Remember password?{' '}
          <span 
            className="link" 
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;