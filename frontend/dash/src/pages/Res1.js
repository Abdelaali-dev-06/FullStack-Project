import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const { file_type, file_id, message, download_links, blockchain_data, status } = data;

  const blockchainRecord = blockchain_data
    ? (Array.isArray(blockchain_data) ? blockchain_data[0] : blockchain_data)
    : null;
  const handleDownload = (type) => {
    const url = download_links?.[type];

    if (!url) {
      alert("Download link is missing in the server response.");
      return;
    }

    window.location.href = url;
  };

  return (
    <div className="result-bg">
      <div className="result-container">
        <h2>Pdf Verification Successful !!</h2>

        <div className="verification-details">

          <div className="res-primary-info">
            <h3>Document Information</h3>

            <div className="res1-detail-item">
              <span className="detail-label">File Type:</span>
              <span className="detail-value">{file_type}</span>
            </div>

            <div className="res1-detail-item">
              <span className="detail-label">File ID:</span>
              <span className="detail-value">{file_id}</span>
            </div>

            <div className="res1-detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value" style={{ fontWeight: 700, color: '#218c4a' }}>{status || 'Active'}</span>
            </div>

          </div>

          {blockchainRecord ? (
            <div className="res1-secondary-info">
              <h3>Blockchain Data</h3>

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
                <span className="detail-value hash">{blockchainRecord.original_hash}</span>
              </div>

              {/* <div className="res1-detail-item">
                <span className="detail-label">Processed Hash:</span>
                <span className="detail-value hash">{blockchainRecord.processed_hash || blockchainRecord.updated_hash}</span>
              </div> */}
            </div>
          ) : (
            <div className="res1-secondary-info">
              <h3>Blockchain Data</h3>
              <div className="res1-detail-item">
                <span className="detail-label">Status:</span>
                <span className="detail-value" style={{ color: '#b71c1c' }}>Not Available</span>
              </div>
            </div>
          )}
        </div>

        {/* {(download_links && download_links.original && (
          <div className="download-btns">
            {download_links.original && (
              <button className="download-btn" onClick={() => handleDownload('original')}>
                Download Original
              </button>
            )}
          </div>
        )} */}

        <button className="return-home-btn" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
          Return Home
        </button>
      </div>
    </div>
  );
};
export default Res1;