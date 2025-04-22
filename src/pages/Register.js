import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

function Register() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    role: "ADMIN",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!user.username.trim()) newErrors.username = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.username)) newErrors.username = "Invalid email format";
    if (!user.password.trim()) newErrors.password = "Password required";
    else if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!user.firstname.trim()) newErrors.firstname = "First name required";
    if (!user.lastname.trim()) newErrors.lastname = "Last name required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await API.post(
        "/api/auth/registerAdmin",
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Fill in your details to register</p>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="username"
              placeholder="Email Address"
              value={user.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
            />
            {errors.username && <div className="error-message">{errors.username}</div>}
          </div>

          {/* Password Field */}
          <div className="input-group">
            <span className="input-icon">
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          {/* Name Fields */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div className="input-group" style={{ flex: 1, minWidth: "45%" }}>
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={user.firstname}
                onChange={handleChange}
                className={errors.firstname ? "error" : ""}
              />
              {errors.firstname && <div className="error-message">{errors.firstname}</div>}
            </div>

            <div className="input-group" style={{ flex: 1, minWidth: "45%" }}>
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={user.lastname}
                onChange={handleChange}
                className={errors.lastname ? "error" : ""}
              />
              {errors.lastname && <div className="error-message">{errors.lastname}</div>}
            </div>
          </div>

          {/* Role Field */}
          <div className="input-group">
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="role-select"
            >
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
