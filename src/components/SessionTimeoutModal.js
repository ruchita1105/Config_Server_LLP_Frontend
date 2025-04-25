import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const SessionTimeoutModal = ({ show, onContinue, onLogout, countdown }) => {
  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Session Expiring Soon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Your session will expire in <strong>{countdown}</strong> seconds.</p>
        <p>Do you want to continue your session?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={onLogout}>Logout</Button>
        <Button variant="primary" onClick={onContinue}>Continue</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionTimeoutModal;
