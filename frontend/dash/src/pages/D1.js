import React from 'react';
import './Delete.css';

function D1({ data, onBack }) {
  const operationId = data.operation_id;
  const fileId = data.file_id;

  return (
    <div className="delete-container">
      <h2>Delete Result</h2>
      <div className="important-note">
        <strong>{data.message}</strong>

        {operationId ? (
          <p>Operation ID: <b>{operationId}</b></p>
        ) : (
          <p>File ID: <b>{fileId}</b></p>
        )}
      </div>
      <button className="delete-btn" onClick={onBack} style={{ marginTop: '2rem' }}>Back</button>
    </div>
  );
}

export default D1;