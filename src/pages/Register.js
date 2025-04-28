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
    <div className="auth-container" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      padding: "2rem"
    }}>
      <div className="auth-box" style={{
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "500px",
        transition: "all 0.3s ease"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="auth-title" style={{
            color: "#2c3e50",
            marginBottom: "0.5rem",
            fontWeight: "600",
            fontSize: "1.8rem"
          }}>Create Account</h2>
          <p className="auth-subtitle" style={{
            color: "#7f8c8d",
            fontSize: "0.95rem"
          }}>Fill in your details to register</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="input-group" style={{ marginBottom: "1.5rem", position: "relative" }}>
            <span className="input-icon" style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#7f8c8d",
              fontSize: "1rem"
            }}>
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="username"
              placeholder="Email Address"
              value={user.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
              style={{
                width: "100%",
                padding: "12px 20px 12px 45px",
                borderRadius: "8px",
                border: errors.username ? "1px solid #e74c3c" : "1px solid #dfe6e9",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            {errors.username && <div className="error-message" style={{
              color: "#e74c3c",
              fontSize: "0.8rem",
              marginTop: "0.3rem",
              paddingLeft: "5px"
            }}>{errors.username}</div>}
          </div>

          {/* Password Field */}
          <div className="input-group" style={{ marginBottom: "1.5rem", position: "relative" }}>
            <span className="input-icon" style={{
              position: "absolute",
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#7f8c8d",
              fontSize: "1rem"
            }}>
              <FaLock />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              style={{
                width: "100%",
                padding: "12px 45px 12px 45px",
                borderRadius: "8px",
                border: errors.password ? "1px solid #e74c3c" : "1px solid #dfe6e9",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            <span 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7f8c8d",
                cursor: "pointer",
                fontSize: "1rem"
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <div className="error-message" style={{
              color: "#e74c3c",
              fontSize: "0.8rem",
              marginTop: "0.3rem",
              paddingLeft: "5px"
            }}>{errors.password}</div>}
          </div>

          {/* Name Fields */}
          <div style={{ 
            display: "flex", 
            gap: "1rem", 
            flexWrap: "wrap",
            marginBottom: "1.5rem"
          }}>
            <div className="input-group" style={{ flex: 1, minWidth: "45%", position: "relative" }}>
              <span className="input-icon" style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7f8c8d",
                fontSize: "1rem"
              }}>
                <FaUser />
              </span>
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                value={user.firstname}
                onChange={handleChange}
                className={errors.firstname ? "error" : ""}
                style={{
                  width: "100%",
                  padding: "12px 20px 12px 45px",
                  borderRadius: "8px",
                  border: errors.firstname ? "1px solid #e74c3c" : "1px solid #dfe6e9",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              {errors.firstname && <div className="error-message" style={{
                color: "#e74c3c",
                fontSize: "0.8rem",
                marginTop: "0.3rem",
                paddingLeft: "5px"
              }}>{errors.firstname}</div>}
            </div>

            <div className="input-group" style={{ flex: 1, minWidth: "45%", position: "relative" }}>
              <span className="input-icon" style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7f8c8d",
                fontSize: "1rem"
              }}>
                <FaUser />
              </span>
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                value={user.lastname}
                onChange={handleChange}
                className={errors.lastname ? "error" : ""}
                style={{
                  width: "100%",
                  padding: "12px 20px 12px 45px",
                  borderRadius: "8px",
                  border: errors.lastname ? "1px solid #e74c3c" : "1px solid #dfe6e9",
                  fontSize: "0.95rem",
                  transition: "all 0.3s ease",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              {errors.lastname && <div className="error-message" style={{
                color: "#e74c3c",
                fontSize: "0.8rem",
                marginTop: "0.3rem",
                paddingLeft: "5px"
              }}>{errors.lastname}</div>}
            </div>
          </div>

          {/* Role Field */}
          <div className="input-group" style={{ marginBottom: "2rem" }}>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="role-select"
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: "8px",
                border: "1px solid #dfe6e9",
                fontSize: "0.95rem",
                backgroundColor: "#fff",
                color: "#2c3e50",
                appearance: "none",
                outline: "none",
                cursor: "pointer"
              }}
            >
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="auth-btn"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#3498db",
              color: "white",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.3s ease",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#2980b9"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#3498db"}
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

          <p className="auth-footer" style={{
            textAlign: "center",
            color: "#7f8c8d",
            fontSize: "0.9rem"
          }}>
            Already have an account? <Link to="/login" style={{
              color: "#3498db",
              textDecoration: "none",
              fontWeight: "500"
            }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;