// src/components/Alert.js
import { useEffect } from 'react';
import './Alert.css';

const Alert = ({ type, message, duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-message">{message}</div>
      <button 
        className="alert-close"
        onClick={() => onClose?.()}
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};

export default Alert;