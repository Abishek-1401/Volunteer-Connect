import React from 'react';
import './Toast.css';
import { FaTimes, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';

const Toast = ({ toast, removeToast }) => {
  const { id, message, type } = toast;
  
  // Icon based on toast type
  const icon = type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />;

  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">{icon}</div>
      <p className="toast-message">{message}</p>
      <button className="toast-close-btn" onClick={() => removeToast(id)}>
        <FaTimes />
      </button>
    </div>
  );
};

export default Toast;