import { FaTimesCircle } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res3 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const message = data.message || 'This file was in our system but is not active now.';

  const { file_id, file_type, status } = data;

  const blockchainData = data.blockchain_data;
  const blockchainRecord = blockchainData
    ? (Array.isArray(blockchainData) ? blockchainData[0] : blockchainData)
    : null;


  return (
    <div className="result-bg">
      <div className="result-container-inactive">
        <h2 style={{ color: '#dc3545' }}><FaTimesCircle /> File Not Active</h2>

        <div className="verification-details">

          <div className="res-primary-info" style={{ border: '1px solid #dc3545', background: '#fff0f0' }}>
            <h3>Document Information</h3>

            <div className="res1-detail-item">
              <span className="detail-label">File Type:</span>
              <span className="detail-value">{file_type}</span>
            </div>


            <div className="res1-detail-item">
              <span className="detail-label">File ID:</span>
              <span className="detail-value">{blockchainRecord.file_id}</span>
            </div>

            <div className="res1-detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value" style={{ fontWeight: 700, color: '#dc3545' }}>{status || 'Inactive'}</span>
            </div>

          </div>

          {blockchainRecord && (
            <div className="res1-secondary-info" style={{ border: '1px solid #dc3545', background: '#fff0f0' }}>
              <h3 style={{ color: '#dc3545', borderBottomColor: '#f8d7da' }}>Blockchain History</h3>

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

        </div>

        <button className="return-home-btn-inactive" onClick={() => { navigate('/'); window.scrollTo(0, 0); }}>Return Home</button>
      </div>
    </div>
  );
};

export default Res3;