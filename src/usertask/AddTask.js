import React, { useState } from "react";
import { Form, Button, Container, Alert as BootstrapAlert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import Alert from "../components/Alert";

const AddTask = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "Pending"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(null);
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
      await UserService.createTask(taskData);
      setAlert({
        type: 'success',
        message: 'Task added successfully!',
        onClose: () => navigate("/tasks")
      });
    } catch (err) {
      console.error("Task creation error:", err);
      const errorMessage = err.message || "Failed to add task";
      setError(errorMessage);
      setAlert({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4" style={{ 
      maxWidth: "600px",
      background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
      padding: "2rem",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}>
      {alert && <Alert {...alert} />}
      
      <h2 className="mb-4 text-center" style={{
        color: "#6c5ce7",
        fontWeight: "600",
        textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
      }}>
        Add New Task
      </h2>
      
      {error && (
        <BootstrapAlert 
          variant="danger" 
          className="mb-3"
          onClose={() => setError("")}
          dismissible
        >
          {error}
        </BootstrapAlert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label style={{ color: "#2d3436", fontWeight: "500" }}>
            <b>Title </b><span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Enter task title"
            value={taskData.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={100}
            style={{ 
              borderColor: "#a29bfe",
              boxShadow: "0 2px 4px rgba(108, 92, 231, 0.1)" 
            }}
          />
          <Form.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
            Minimum 3 characters required
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label style={{ color: "#2d3436", fontWeight: "500" }}>
            <b>Description</b>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            placeholder="Enter task description"
            value={taskData.description}
            onChange={handleChange}
            maxLength={500}
            style={{ 
              borderColor: "#a29bfe",
              boxShadow: "0 2px 4px rgba(108, 92, 231, 0.1)" 
            }}
          />
          <Form.Text className="text-muted" style={{ fontSize: "0.85rem" }}>
            Maximum 500 characters allowed
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-4" controlId="status">
          <Form.Label style={{ color: "#2d3436", fontWeight: "500" }}>
            <b>Status </b><span className="text-danger">*</span>
          </Form.Label>
          <Form.Select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            required
            style={{ 
              borderColor: "#a29bfe",
              boxShadow: "0 2px 4px rgba(108, 92, 231, 0.1)",
              cursor: "pointer"
            }}
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
            style={{
              background: "linear-gradient(to right, #6c5ce7, #a29bfe)",
              border: "none",
              padding: "0.75rem",
              fontWeight: "500",
              letterSpacing: "0.5px"
            }}
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
            style={{
              borderColor: "#6c5ce7",
              color: "#6c5ce7",
              fontWeight: "500"
            }}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddTask;