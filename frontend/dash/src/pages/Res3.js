import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  
  // Display a clear error message
  const message = data.message || 'This file was in our system but is not active now.';
  // Destructure file_id, file_type, and status (now correctly passed for inactive PDF)
  const { file_id, file_type, status } = data; 
  
  // Attempt to extract blockchain data if available (even if inactive, this is the history)
  const blockchainData = data.blockchain_data;
  const blockchainRecord = blockchainData 
    ? (Array.isArray(blockchainData) ? blockchainData[0] : blockchainData) 
    : null;


  return (
    <div className="result-bg">
      {/* Apply the red styling class to the container */}
      <div className="result-container-inactive">
        <h2 style={{color: '#dc3545'}}>❌ File Not Active</h2>
        
        {/* Verification Details Container */}
        <div className="verification-details">

          {/* --- BOX 1: DOCUMENT INFORMATION (Top Box) --- */}
          {/* Using the default green box structure, but with red inactive styling */}
          <div className="res-primary-info" style={{border: '1px solid #dc3545', background: '#fff0f0'}}> 
            <h3>Document Information</h3>

            {/* File Type (FIXED) */}
            <div className="res1-detail-item">
              <span className="detail-label">File Type:</span>
              <span className="detail-value">{file_type}</span>
            </div>
            
            {/* File ID (FIXED) */}
            <div className="res1-detail-item">
              <span className="detail-label">File ID:</span>
              <span className="detail-value">{blockchainRecord.file_id}</span>
            </div>

            <div className="res1-detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value" style={{fontWeight: 700, color: '#dc3545'}}>{status || 'Inactive'}</span>
            </div>

          </div>
          
          {blockchainRecord && (
            <div className="res1-secondary-info" style={{border: '1px solid #dc3545', background: '#fff0f0'}}> 
              <h3 style={{color: '#dc3545', borderBottomColor: '#f8d7da'}}>Blockchain History</h3>

              <div className="res1-detail-item">
                <span className="detail-label">Operation ID:</span>
                <span className="detail-value">{blockchainRecord.operation_id}</span>
              </div>
              
              <div className="res1-detail-item">
                <span className="detail-label">School ID:</span>
                <span className="detail-value">{blockchainRecord.school_id}</span>
              </div>

              <div className="res1-detail-item">
                <span className="detail-label">File ID:</span>
                <span className="detail-value">{blockchainRecord.file_id}</span>
              </div>

              <div className="res1-detail-item">
                <span className="detail-label">Original Hash:</span>
                <span className="detail-value-hash-ina">{blockchainRecord.original_hash}</span>
              </div>
              
            </div>
          )}
          {/* --- END BOX 2 --- */}

        </div>

        {/* Use the new inactive button style */}
        <button className="return-home-btn-inactive" onClick={() => navigate('/')}>Return Home</button>
      </div>
    </div>
  );
};

export default Res3;