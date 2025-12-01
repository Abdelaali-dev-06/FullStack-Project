import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const { file_type, file_id, download_links, blockchain_data, status } = data;

  const blockchainRecord = blockchain_data
    ? (Array.isArray(blockchain_data) ? blockchain_data[0] : blockchain_data)
    : null;

  const effectiveFileId = file_id || 'N/A';
  const effectiveFileType = file_type || 'N/A';
  const effectiveStatus = status || 'Active';

  const handleDownload = async (type) => {
    const url = download_links?.[type];

    if (url && url.startsWith('/download/')) {
      console.error(`ERROR: The download feature is currently disabled. The actual Laravel route for the ${type} file is missing.`);
      alert("Download feature currently unavailable. The file is verified, but download routes are still under construction.");
      return;
    }

    if (!url) {
      console.error('Download link not found.');
      return;
    }

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

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `certificate_${type}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['\"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed: The file could not be accessed. (Server Error)');
    }
  };

  return (
    <div className="result-bg">
      <div className="result-container">
        <h2>ID Verification Successful !!</h2>

        <div className="verification-details">

          <div className="res-primary-info">
            <h3>Document Information</h3>

            <div className="res1-detail-item">
              <span className="detail-label">File Type:</span>
              <span className="detail-value">{effectiveFileType}</span>
            </div>

            <div className="res1-detail-item">
              <span className="detail-label">File ID:</span>
              <span className="detail-value">{effectiveFileId}</span>
            </div>

            <div className="res1-detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value" style={{ fontWeight: 700, color: '#218c4a' }}>{effectiveStatus}</span>
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

        {(download_links && (download_links.original || download_links.updated)) && (
          <div className="download-btns">
            {download_links.original && (
              <button className="download-btn" onClick={() => handleDownload('original')}>
                Download Original
              </button>
            )}
            {/* {download_links.updated && (
              <button className="download-btn" onClick={() => handleDownload('updated')}>
                Download Updated
              </button>
            )} */}
          </div>
        )}

        <button className="return-home-btn" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>
          Return Home
        </button>
      </div>
    </div>
  );
};

export default Res2;