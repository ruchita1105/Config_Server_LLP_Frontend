
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Alert from '../components/Alert';
import UserForm from '../users/UserForm';
import UserList from '../users/UserList';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const adminId = localStorage.getItem('userId');

      if (!token || !adminId) {
        navigate("/login", { replace: true }); 
        return;
      }

      const response = await API.get(`/api/users?adminId=${adminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      setAlert({
        type: 'error',
        message: error.response?.data?.message || "Error fetching users!"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = async (userId) => {
    try {
      const userToEdit = users.find(user => user.id === userId);
      
      if (!userToEdit) {
        setAlert({
          type: 'error',
          message: "User not found"
        });
        return;
      }

      const { value: formValues } = await Swal.fire({
        title: 'Edit User',
        html:
          `<input id="swal-username" class="swal2-input" placeholder="Username" value="${userToEdit.username || ''}" required>
           <input id="swal-firstname" class="swal2-input" placeholder="First Name" value="${userToEdit.firstname || ''}">
           <input id="swal-lastname" class="swal2-input" placeholder="Last Name" value="${userToEdit.lastname || ''}">
           <select id="swal-role" class="swal2-input" required>
             <option value="USER" ${userToEdit.role === 'USER' ? 'selected' : ''}>User</option>
             <option value="ADMIN" ${userToEdit.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
           </select>`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          return {
            username: document.getElementById('swal-username').value,
            firstname: document.getElementById('swal-firstname').value,
            lastname: document.getElementById('swal-lastname').value,
            role: document.getElementById('swal-role').value
          };
        },
        validationMessage: 'Username and Role are required',
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (formValues) {
        Swal.fire({
          title: 'Updating User...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const token = localStorage.getItem('token');
        const response = await API.put(`/api/users/${userId}`, formValues, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setUsers(users.map(user => 
          user.id === userId ? { ...user, ...response.data } : user
        ));

        Swal.fire(
          'Success!',
          'User updated successfully!',
          'success'
        );
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire(
        'Error!',
        error.response?.data?.message || 'Failed to update user',
        'error'
      );
    }
  };

  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      allowOutsideClick: false
    });
  
    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        
        Swal.fire({
          title: 'Deleting...',
          html: 'Please wait while we delete the user',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        await API.delete(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(users.filter((user) => user.id !== userId));
        
        Swal.fire(
          'Deleted!',
          'User has been deleted successfully.',
          'success'
        );
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire(
          'Error!',
          error.response?.data?.message || 'Failed to delete user',
          'error'
        );
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/login', { replace: true });
  };

  return (
    <div className="container mt-4">
      {alert && <Alert {...alert} />}
      <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 style={{
  color: "green",
  textAlign: "center",  // Horizontal centering
  width: "100%",       // Ensure full width for centering
  margin: "20px 0"     // Add vertical spacing (optional)
}}>
  <b>Welcome To Admin Dashboard</b>
</h4>
        <button 
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <UserForm fetchUsers={fetchUsers} />
      </div>

      <UserList 
        users={users} 
        loading={loading}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default AdminDashboard;