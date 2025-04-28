import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert as BootstrapAlert, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import Alert from '../components/Alert';
import { FaArrowLeft } from 'react-icons/fa';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const userTasks = await UserService.getTasks();
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message || 'Failed to load tasks');
      setAlert({
        type: 'error',
        message: 'Failed to load tasks'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    if (!taskId) {
      setAlert({
        type: 'error',
        message: 'Invalid task reference'
      });
      return;
    }

    try {
      await UserService.updateTaskStatus(taskId, { status: newStatus });
      setAlert({
        type: 'success',
        message: 'Status updated successfully'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating status:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to update status'
      });
    }
  };

  const handleDeleteClick = (taskId) => {
    if (!taskId) {
      setAlert({
        type: 'error',
        message: 'Invalid task reference'
      });
      return;
    }
    setCurrentTaskId(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!currentTaskId) {
      setAlert({
        type: 'error',
        message: 'No task selected for deletion'
      });
      setShowDeleteModal(false);
      return;
    }

    try {
      await UserService.deleteTask(currentTaskId);
      setAlert({
        type: 'success',
        message: 'Task deleted successfully'
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Failed to delete task'
      });
    } finally {
      setShowDeleteModal(false);
      setCurrentTaskId(null);
    }
  };

  const handleEditClick = (taskId) => {
    if (!taskId) {
      setAlert({
        type: 'error',
        message: 'Invalid task reference'
      });
      return;
    }
    navigate(`/edit-task/${taskId}`);
  };

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your tasks...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <BootstrapAlert variant="danger">
          {error}
        </BootstrapAlert>
        <Button variant="primary" onClick={fetchTasks}>
          Try Again
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {alert && <Alert {...alert} />}
      
      {/* Added Back Button */}
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate('/user')} 
        className="mb-3"
      >
        <FaArrowLeft className="me-2" />
        Back to Dashboard
      </Button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Your Tasks</h2>
        <Button variant="primary" onClick={() => navigate('/add-tasks')} className="ms-2">
          Add New Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-4">
          <p>No tasks found. Create your first task!</p>
          <Button variant="primary" onClick={() => navigate('/add-tasks')}>
            Add Task
          </Button>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id || task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>
                    <select
                      className={`form-select ${task.status === 'Completed' ? 'bg-success text-white' : task.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary text-white'}`}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id || task.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="text-center">
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(task._id || task.id)} className="me-2">Delete</Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(task._id || task.id)}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete Task</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskList;