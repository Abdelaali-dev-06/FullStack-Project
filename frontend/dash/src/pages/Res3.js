import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  const message = data.message || 'This file was in our system but is not active now.';

  return (
    <div className="result-bg">
      <div className="result-container">
        <h2>File Not Active</h2>
        <p className="result-message">{message}</p>
        <button className="return-home-btn" onClick={() => navigate('/')}>Return Home</button>
      </div>
    </div>
  );
};

export default Res3; 