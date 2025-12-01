import React from 'react';
import { FaEnvelope, FaPhone, FaYoutube } from 'react-icons/fa';
import './Support.css';

const Support = () => (
  <div className="support-container">
    <div className="support-option">
      <FaEnvelope className="support-icon" />
      <div className="support-title">Email Support</div>
      <div className="support-subtitle">support@certa.com</div>
    </div>
    <div className="support-divider" />
    <div className="support-option">
      <FaPhone className="support-icon" />
      <div className="support-title">Phone Support</div>
      <div className="support-subtitle">+1 (555) 123-4567</div>
    </div>
    <div className="support-divider" />
    <div className="support-option">
      <FaYoutube className="support-icon" />
      <div className="support-title">Video Tutorial</div>
      <div className="support-subtitle">
        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">Watch on YouTube</a>
      </div>
    </div>
  </div>
);

export default Support; 