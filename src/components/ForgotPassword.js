import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import Alert from './Alert';
import '../pages/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      setAlert({
        type: 'success',
        message: 'OTP sent to your email',
        onClose: () => navigate('/verify-otp', { state: { email } })
      });
    } catch {
      setAlert({
        type: 'error',
        message: 'Failed to send OTP. Try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {alert && <Alert {...alert} />}
      <div className="auth-box">
        <h2 className="auth-title">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-icon"><FaEnvelope /></span>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button className="auth-btn btn btn-primary w-100" disabled={loading}>
            {loading ? <><FaSpinner className="spinner me-2" /> Sending OTP...</> : "Send OTP"}
          </button>
        </form>
        <p className="auth-footer mt-3">
          Remember password? <span className="link" onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;