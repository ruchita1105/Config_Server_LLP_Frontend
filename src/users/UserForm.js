import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '../components/Alert';

const UserForm = ({ fetchUsers }) => {
  const [user, setUser] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    role: 'USER',
  });

  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (!token || !adminId || !role) {
      setAlert({
        type: 'error',
        message: "You must be logged in to add a user.",
        onClose: () => navigate("/login")
      });
      setLoading(false);
      return;
    }

    if (role.toUpperCase() !== "ADMIN") {
      setAlert({
        type: 'error',
        message: "You do not have permission to add users."
      });
      setLoading(false);
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

      setAlert({
        type: 'success',
        message: "User added successfully!",
        onClose: () => {
          setUser({
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            role: 'USER',
          });
          if (fetchUsers) fetchUsers();
        }
      });
      
    } catch (error) {
      console.error("Error adding user:", error);
      let errorMessage = "This username is already  Please use a different email";
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "This username is already taken. Please use a different email.";
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      }
      
      setAlert({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {alert && <Alert {...alert} />}
          <div className="card border-0 shadow-lg">
            <div className="card-header bg-gradient-primary text-white">
              <h5 style={{color:'brown'}} className="card-title mb-0 text-center"><b>Add New User</b></h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="form-label fw-bold text-primary">Username (Email)</label>
                  <input
                    type="email"
                    className="form-control border-2 border-primary rounded-pill py-2 px-3"
                    id="username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-4">
                    <label htmlFor="firstname" className="form-label fw-bold text-primary">First Name</label>
                    <input
                      type="text"
                      className="form-control border-2 border-primary rounded-pill py-2 px-3"
                      id="firstname"
                      name="firstname"
                      value={user.firstname}
                      onChange={handleChange}
                      required
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="col-md-6 mb-4">
                    <label htmlFor="lastname" className="form-label fw-bold text-primary">Last Name</label>
                    <input
                      type="text"
                      className="form-control border-2 border-primary rounded-pill py-2 px-3"
                      id="lastname"
                      name="lastname"
                      value={user.lastname}
                      onChange={handleChange}
                      required
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold text-primary">Password</label>
                  <input
                    type="password"
                    className="form-control border-2 border-primary rounded-pill py-2 px-3"
                    id="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="role" className="form-label fw-bold text-primary">Role</label>
                  <select
                    id="role"
                    name="role"
                    className="form-select border-2 border-primary rounded-pill py-2 px-3"
                    value={user.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="d-grid mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg rounded-pill py-2 fw-bold text-uppercase"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding User...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Add User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;