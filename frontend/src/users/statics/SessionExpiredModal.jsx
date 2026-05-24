import React from 'react';
import { X, LogIn } from 'lucide-react';
import '../css/aiplanner.css';

export default function SessionExpiredModal({ isOpen, message, onClose, onLogin }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="session-modal-backdrop" onClick={onClose}></div>
      <div className="session-modal" role="dialog" aria-modal="true">
        <div className="session-modal-header">
          <h3>Session Expired</h3>
          <button className="session-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="session-modal-body">
          <p>{message || 'Your session has expired. Please log in again.'}</p>
        </div>
        <div className="session-modal-footer">
          <button className="session-modal-btn session-modal-btn-primary" onClick={onLogin}>
            <LogIn size={16} />
            Go to Login
          </button>
          <button className="session-modal-btn" onClick={onClose}>Dismiss</button>
        </div>
      </div>
    </>
  );
}
