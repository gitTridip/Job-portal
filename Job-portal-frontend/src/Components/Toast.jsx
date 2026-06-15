import React from 'react';
import './Toast.css';

const Toast = ({ toasts }) => {
  return (
    <div className="toast-wrapper">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
