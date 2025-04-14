import React, { useEffect, useState } from "react";
import { Form, Button, Container, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { toast } from "react-toastify";

const UpdateTask = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState({ 
    title: "", 
    description: "",
    status: "Pending" // Added status field
  });
  const [loading, setLoading] = useState(true); // Changed initial state
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await UserService.getTaskById(taskId);
      setTask({
        title: data.title || "",
        description: data.description || "",
        status: data.status || "Pending"
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Failed to load task details");
      toast.error("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]); // Added taskId to dependencies

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await UserService.updateTask(taskId, task);
      toast.success("Task updated successfully!");
      navigate("/tasks"); // Changed to consistent route
    } catch (error) {
      console.error("Update error:", error);
      setError(error.response?.data?.message || "Failed to update task");
      toast.error("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading task details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Update Task</h2>
      
      <Form onSubmit={handleUpdate}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={task.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="status">
          <Form.Label>Status</Form.Label>
          <Form.Select
            name="status"
            value={task.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>

        <div className="d-flex gap-2">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Update Task"}
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => navigate("/tasks")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UpdateTask;