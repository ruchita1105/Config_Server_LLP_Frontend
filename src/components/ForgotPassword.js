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
    setAlert(null); // Clear any previous alerts

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      
      // Handle successful OTP sending
      setAlert({
        type: 'success',
        message: 'OTP sent to your email',
        onClose: () => navigate('/verify-otp', { state: { email } })
      });

    } catch (error) {
      // Handle specific case for non-existing email
      if (error.response && error.response.status === 404) {
        setAlert({
          type: 'error',
          message: 'This email is not registered. Please check your email or create a new account.',
          duration: 5000 // Show for 5 seconds
        });
      } 
      // Handle other errors
      else {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'This email is not registered.',
          duration: 5000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Custom Alert Component - appears at top of screen */}
      {alert && <Alert {...alert} />}

      <div className="auth-box">
        <h2 className="auth-title">Forgot Password</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <span className="input-icon"><FaEnvelope /></span>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
              autoFocus
            />
          </div>

          <button 
            className="auth-btn btn btn-primary w-100" 
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <>
                <FaSpinner className="spinner me-2" />
                Sending OTP...
              </>
            ) : "Send OTP"}
          </button>
        </form>

        <p className="auth-footer mt-3">
          Remember your password?{' '}
          <span 
            className="link" 
            onClick={() => navigate('/login')}
            style={{ cursor: 'pointer' }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;