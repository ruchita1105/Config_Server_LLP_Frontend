import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication-related items from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('lastLogin');
    
    // Redirect to login page and replace history entry
    navigate('/login', { replace: true });
  };

  return (
    <Container className="mt-4">
      {/* Dashboard Header with Centered Title and Logout Button */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div style={{ width: "100%", textAlign: "center" }}>
          <h2 className="m-0">Welcome to Your Dashboard</h2>
        </div>
        <Button 
          variant="outline-danger"
          onClick={handleLogout}
          size="sm"
          style={{ position: "absolute", right: "20px" }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </Button>
      </div>

      {/* Main Dashboard Content */}
      <div className="dashboard-content">
        <Row className="justify-content-center g-4">
          <Col md={6} lg={4}>
            <Button 
              variant="success" 
              size="lg" 
              onClick={() => navigate("/add-tasks")} 
              className="w-100 py-3 d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-plus-circle-fill me-2"></i>
              Add New Task
            </Button>
          </Col>
          <Col md={6} lg={4}>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => navigate("/tasks")} 
              className="w-100 py-3 d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-list-task me-2"></i>
              View All Tasks
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default UserDashboard;