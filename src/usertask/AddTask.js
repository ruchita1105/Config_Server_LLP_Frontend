import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import { toast } from "react-toastify";

const AddTask = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "Pending"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Updated to match the new UserService.createTask signature
      await UserService.createTask(taskData);
      toast.success("Task added successfully!");
      navigate("/tasks");
    } catch (err) {
      console.error("Task creation error:", err);
      const errorMessage = err.message || "Failed to add task";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">Add New Task</h2>
      
      {error && (
        <Alert 
          variant="danger" 
          className="mb-3"
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title <span className="text-danger">*</span></Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter task title"
            value={taskData.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={100}
          />
          <Form.Text className="text-muted">
            Minimum 3 characters required
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            placeholder="Enter task description"
            value={taskData.description}
            onChange={handleChange}
            maxLength={500}
          />
          <Form.Text className="text-muted">
            Maximum 500 characters allowed
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4" controlId="status">
          <Form.Label>Status <span className="text-danger">*</span></Form.Label>
          <Form.Select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Form.Select>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="d-flex justify-content-center align-items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" />
                Adding Task...
              </>
            ) : (
              "Add Task"
            )}
          </Button>
          
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate("/user")}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddTask;