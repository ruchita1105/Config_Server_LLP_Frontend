import React, { useEffect } from 'react';
import './Alert.css';

function Alert({ type = 'success', message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="alert-container">
      <div className={`alert alert-${type}`}>
        {message}
        <button 
          className="alert-close" 
          onClick={onClose} 
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default Alert;