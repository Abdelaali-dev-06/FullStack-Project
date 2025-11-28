import React from 'react';
import './LoadingOverlay.css';

const LoadingOverlay = ({ message = "Please wait..." }) => (
  <div className="loading-overlay">
    <div className="loading-content">
      <div className="spinner"></div>
      <span>{message}</span>
    </div>
  </div>
);

export default LoadingOverlay; 