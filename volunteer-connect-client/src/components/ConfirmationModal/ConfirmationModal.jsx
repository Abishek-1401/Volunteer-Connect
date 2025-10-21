import React, { useState } from 'react';
import './ConfirmationModal.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText }) => {
  const [inputValue, setInputValue] = useState('');
  if (!isOpen) return null;

  const isConfirmDisabled = inputValue !== confirmText;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirmation-modal-content" onClick={(e) => e.stopPropagation()}>
        <FaExclamationTriangle className="warning-icon" />
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="confirm-input-wrapper">
          <label>To confirm, type "{confirmText}" below:</label>
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
          />
        </div>
        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="modal-confirm-btn" 
            onClick={onConfirm} 
            disabled={isConfirmDisabled}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;