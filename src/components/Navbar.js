import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Fetch role from localStorage

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Remove role on logout
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/"><b>Home</b></Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login"><b>Login</b></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register"><b>Register</b></Link>
              </li>
            </>
          ) : (
            <>
              {role === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                </li>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/user">User Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
