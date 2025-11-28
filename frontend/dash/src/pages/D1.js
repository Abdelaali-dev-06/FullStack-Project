import React from 'react';
import './Delete.css';

function D1({ data, onBack }) {
  return (
    <div className="delete-container">
      <h2>Delete Result</h2>
      <div className="important-note">
        <strong>{data.message}</strong>
        <p>Operation ID: <b>{data.operation_id}</b></p>
      </div>
      <button className="delete-btn" onClick={onBack} style={{marginTop: '2rem'}}>Back</button>
    </div>
  );
}

export default D1; 