import React from 'react';

const DeleteModal = ({ show, onClose, onConfirm, itemName }) => {
  if (!show) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h3>Confirm Deletion</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="delete-modal-body">
          <i className="fas fa-exclamation-triangle warning-icon"></i>
          <p>Are you sure you want to delete this {itemName}?</p>
          <p className="warning-text">This action cannot be undone.</p>
        </div>
        
        <div className="delete-modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="delete-btn" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
