import React from 'react';
import './Verify.css';

function Id1({ verificationData, onBack }) {
  const handleDownload = async (url) => {
    try {
      const fullToken = localStorage.getItem('token');
      if (!fullToken) {
        throw new Error('No authentication token found');
      }

      // Extract the token part after the "|"
      const token = fullToken.split('|')[1];
      if (!token) {
        throw new Error('Invalid token format');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a URL for the blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `document_${verificationData.file_id}.pdf`; // Set the filename
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <h2>ID Verification Results</h2>
        <p>Document verified successfully!</p>
      </div>

      <div className="verification-details">
        <div className="detail-section">
          <h3>Document Information</h3>
          <p><strong>File ID:</strong> {verificationData.file_id}</p>
          <p><strong>Status:</strong> Active</p>
        </div>

        <div className="detail-section">
          <h3>Blockchain Data</h3>
          <p><strong>Operation ID:</strong> {verificationData.blockchain_data.operation_id}</p>
          <p><strong>School ID:</strong> {verificationData.blockchain_data.school_id}</p>
          <p><strong>File ID:</strong> {verificationData.blockchain_data.file_id}</p>
          <p><strong>Original Hash:</strong> {verificationData.blockchain_data.original_hash}</p>
          <p><strong>Processed Hash:</strong> {verificationData.blockchain_data.processed_hash}</p>
        </div>

        <div className="download-section">
          <h3>Download Options</h3>
          <div className="download-buttons">
            <button 
              onClick={() => handleDownload(verificationData.download_links.original)}
              className="download-button"
            >
              Download Original PDF
            </button>
            <button 
              onClick={() => handleDownload(verificationData.download_links.updated)}
              className="download-button"
            >
              Download Processed PDF
            </button>
          </div>
        </div>

        <button onClick={onBack} className="back-button">
          Back to Verification
        </button>
      </div>
    </div>
  );
}

export default Id1; 