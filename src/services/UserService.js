import API from "./api";
import { toast } from 'react-toastify';


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warn("Please login to continue");
    throw new Error("No authentication token found");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const UserService = {
  // Task Management
  createTask: async (taskData) => {
    try {
      const response = await API.post('/api/tasks', taskData, getAuthHeaders());
      toast.success("Task created successfully");
      return response.data;
    } catch (error) {
      console.error("Task creation error:", error);
      toast.error(error.response?.data?.message || "Failed to create task");
      throw error;
    }
  },

  getTasks: async () => {
    try {
      const response = await API.get('/api/tasks', getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error(error.response?.data?.message || "Failed to load tasks");
      throw error;
    }
  },

  getTaskById: async (taskId) => {
    try {
      const response = await API.get(`/api/tasks/${taskId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching task:", error);
      toast.error(error.response?.data?.message || "Failed to load task");
      throw error;
    }
  },

  updateTask: async (taskId, taskData) => {
    try {
      const response = await API.put(`/api/tasks/${taskId}`, taskData, getAuthHeaders());
      toast.success("Task updated successfully");
      return response.data;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error(error.response?.data?.message || "Failed to update task");
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      const response = await API.delete(`/api/tasks/${taskId}`, getAuthHeaders());
      toast.success("Task deleted successfully");
      return response.data;
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(error.response?.data?.message || "Failed to delete task");
      throw error;
    }
  },

  // For admin functionality
  getAdminTasks: async () => {
    try {
      const response = await API.get('/api/tasks/admin/view-tasks', getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error("Error fetching admin tasks:", error);
      toast.error(error.response?.data?.message || "Failed to load admin tasks");
      throw error;
    }
  }
};

export default UserService;