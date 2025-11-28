import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResultBg.css';

const Res1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  return (
    <div className="result-bg">
      <div className="result-container">
        <h2>PDF Verified Successfully!</h2>
        <pre className="result-data">{JSON.stringify(data, null, 2)}</pre>
        {data.download_links && (
          <div className="download-btns">
            {data.download_links.original && (
              <a href={data.download_links.original} className="download-btn" target="_blank" rel="noopener noreferrer">Download Original</a>
            )}
            {data.download_links.updated && (
              <a href={data.download_links.updated} className="download-btn" target="_blank" rel="noopener noreferrer">Download Updated</a>
            )}
          </div>
        )}
        <button className="return-home-btn" onClick={() => navigate('/')}>Return Home</button>
      </div>
    </div>
  );
};

export default Res1; 