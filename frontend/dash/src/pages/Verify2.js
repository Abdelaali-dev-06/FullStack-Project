import React from 'react';
import './Verify.css';

function Verify2({ verificationData, onBack }) {
  return (
    <div className="verify-container">
      <div className="verify-header">
        <h2>Verification Results</h2>
        <p>Document found but not active</p>
      </div>

      <div className="verification-details">
        <div className="detail-section">
          <h3>Document Information</h3>
          <p><strong>File ID:</strong> {verificationData.file_id}</p>
          <p><strong>Status:</strong> Inactive</p>
        </div>

        <div className="detail-section">
          <h3>Blockchain Data</h3>
          <p><strong>Operation ID:</strong> {verificationData.blockchain_data.operation_id}</p>
          <p><strong>School ID:</strong> {verificationData.blockchain_data.school_id}</p>
          <p><strong>File ID:</strong> {verificationData.blockchain_data.file_id}</p>
          <p><strong>Original Hash:</strong> {verificationData.blockchain_data.original_hash}</p>
          {/* <p><strong>Processed Hash:</strong> {verificationData.blockchain_data.processed_hash}</p> */}
        </div>

        <button onClick={onBack} className="back-button">
          Back to Verification
        </button>
      </div>
    </div>
  );
}

export default Verify2; 