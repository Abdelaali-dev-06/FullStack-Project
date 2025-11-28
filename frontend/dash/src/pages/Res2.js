import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const handleDownload = async (type) => {
    const url = data.download_links?.[type];
    if (!url) return;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `certificate_${type}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download the file. Please try again.');
    }
  };

  return (
    <div className="result-bg">
      <div className="result-container">
        <h2>ID Verified Successfully!</h2>
        
        <div className="verification-details">
          <div className="detail-item">
            <span className="detail-label">File ID:</span>
            <span className="detail-value">{data.file_id}</span>
          </div>
          
          {data.blockchain_data?.[0] && (
            <div className="blockchain-details">
              <h3>Blockchain Information</h3>
              <div className="detail-item">
                <span className="detail-label">Operation ID:</span>
                <span className="detail-value">{data.blockchain_data[0].operation_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">School ID:</span>
                <span className="detail-value">{data.blockchain_data[0].school_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Original Hash:</span>
                <span className="detail-value hash">{data.blockchain_data[0].original_hash}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Updated Hash:</span>
                <span className="detail-value hash">{data.blockchain_data[0].updated_hash}</span>
              </div>
            </div>
          )}
        </div>

        <div className="download-btns">
          <button 
            className="download-btn"
            onClick={() => handleDownload('original')}
          >
            Download Original
          </button>
          <button 
            className="download-btn"
            onClick={() => handleDownload('updated')}
          >
            Download Updated
          </button>
        </div>

        <button className="return-home-btn" onClick={() => navigate('/')}>
          Return Home
        </button>
      </div>
    </div>
  );
};

export default Res2; 