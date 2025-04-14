import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserForm = () => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'USER',
  });

  const { authData } = useAuth();
  const navigate = useNavigate();

  // Fallback to localStorage if authData is missing
  const storedAuth = JSON.parse(localStorage.getItem('authData'));
  // const token = authData?.token || storedAuth?.token;
  // const role = authData?.role || storedAuth?.role;
  // const adminId = authData?.userId || storedAuth?.userId;
  const adminId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !role) {
      alert("You must be logged in to add a user.");
      navigate("/admin");
      return;
    }

    if (role.toUpperCase() !== "ADMIN") {
      alert("You do not have permission to add users.");
      return;
    }

    const newUser = {
      ...user,
      createdBy: adminId
    };

    try {
      await axios.post("http://localhost:8080/api/auth/registerUser", newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert("User added successfully!");
      setUser({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        role: 'USER',
      });
      navigate("/admin");
      
    } catch (error) {
      console.error("Error adding user:", error);
      alert(error.response?.data?.message || "Failed to add user. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center">Add New User</h3>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-light">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username (Email)</label>
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            required
            placeholder="Enter email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstname"
            name="firstname"
            value={user.firstname}
            onChange={handleChange}
            required
            placeholder="Enter first name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastname"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            required
            placeholder="Enter last name"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
  id="role"
  name="role"
  className="form-control"
  value={user.role}
  onChange={handleChange}
  required
>
  <option value="">Select Role</option>
  <option value="USER">User</option>
  <option value="ADMIN">Admin</option>
</select>

        </div>

        <button type="submit" className="btn btn-primary w-100">Add User</button>
      </form>
    </div>
  );
};

export default UserForm;
