import React, { useEffect, useState } from "react";
import { Button, Container, Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserService from '../services/UserService';

const UserTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      const data = await UserService.getAllTasks(userId); // ✅ Use from UserService
      setTasks(data);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await UserService.deleteTask(taskId); // ✅ Use from UserService
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Your Tasks</h2>
      {loading ? (
        <Spinner animation="border" />
      ) : tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <Table bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.taskId}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => navigate(`/user/update-task/${task.taskId}`)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(task.taskId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserTask;
