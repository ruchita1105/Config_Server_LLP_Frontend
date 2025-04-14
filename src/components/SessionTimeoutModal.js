import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SessionTimeoutModal = ({ show, onContinue, onLogout }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Header closeButton={false}>
        <Modal.Title>Session Expired</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your session has expired. Would you like to continue your session?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onLogout}>
          Logout
        </Button>
        <Button variant="primary" onClick={onContinue}>
          Continue Session
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionTimeoutModal;