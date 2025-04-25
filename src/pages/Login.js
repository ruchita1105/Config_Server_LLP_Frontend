import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import Alert from "../components/Alert";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Auth.css";

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      const redirectPath = role === "admin" ? "/admin" : "/user";
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", {
        username: credentials.email,
        password: credentials.password
      });

      const { token, refreshToken, sessionId, role, userId } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("role", role.toLowerCase());
      localStorage.setItem("userId", userId);

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setAlert({
        type: 'success',
        message: 'Login successful!',
        onClose: () => {
          const redirectPath = role.toLowerCase() === "admin" ? "/admin" : "/user";
          navigate(redirectPath, { replace: true });
        }
      });

    } catch (err) {
      console.error("Login error:", err);
      let errorMessage = "Login failed. Please try again.";

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setAlert({
        type: 'error',
        message: errorMessage
      });

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {alert && <Alert {...alert} />}
      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to access your account</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group mb-3">
            <span className="input-icon">
              <FaUser />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              value={credentials.email}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              autoComplete="username"
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="input-group mb-3">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              value={credentials.password}
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              autoComplete="current-password"
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button 
            className="auth-btn w-100 btn btn-primary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="spinner me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="text-center mt-2">
            <span
              className="link"
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer", fontSize: "0.9rem" }}
            >
              Forgot Password?
            </span>
          </div>
        </form>

        <p className="auth-footer mt-3">
          New here?{" "}
          <span
            className="link"
            onClick={() => navigate("/register")}
            style={{ cursor: "pointer" }}
          >
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;