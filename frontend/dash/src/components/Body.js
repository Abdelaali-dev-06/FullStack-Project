import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Body.css';
import pic1 from './assets/pic1.png';
import key from './assets/key.jpg';
import pic5 from './assets/pic5.png';

import HomeHeader from './HomeHeader';

function Body() {
  const fileInputRef = useRef();
  const [pdfFile, setPdfFile] = useState(null);
  const [idInput, setIdInput] = useState('');
  const navigate = useNavigate();

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleVerifyPdf = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file first.');
      return;
    }
    const formData = new FormData();
    formData.append('pdf_file', pdfFile);
    try {
      const res = await fetch('http://localhost:8000/api/public/verify/pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data && data.message && data.message.toLowerCase().includes('active')) {
        navigate('/res1', { state: data });
      } else if (data && data.message && data.message.toLowerCase().includes('not active')) {
        navigate('/res3', { state: data });
      } else {
        alert(data.message || 'Verification failed.');
      }
    } catch (err) {
      alert('An error occurred while verifying the PDF.');
    }
  };

  const handleIdInputChange = (e) => {
    setIdInput(e.target.value);
  };

  const handleVerifyId = async () => {
    if (!idInput.trim()) {
      alert('Please enter a Certificate or Document ID.');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8000/api/public/verify/${encodeURIComponent(idInput.trim())}`);
      const data = await res.json();
      
      if (res.status === 404) {
        alert('Certificate ID not found in our system.');
        return;
      }
      
      if (res.ok && data && data.message) {
        if (data.message.toLowerCase().includes('active')) {
          navigate('/res2', { state: data });
        } else if (data.message.toLowerCase().includes('not active')) {
          navigate('/res3', { state: data });
        } else {
          alert(data.message || 'Verification failed.');
        }
      } else {
        alert(data.message || 'Verification failed.');
      }
    } catch (err) {
      alert('An error occurred while verifying the ID.');
    }
  };

  return (
    <>
      <HomeHeader />
      <div className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title-left">Secure Certificate Authentication, Management and Storage with Blockchain Technology and Integrated AI</h1>
            <p className="hero-subtitle">
              Verify, store, and manage certificates with unparalleled security and ease.
              Powered by blockchain and AI technology.
            </p>
            <div className="verification-container">
              <div className="verification-card">
                <div className="verification-title">Verify with PDF Upload</div>
                <div className="input-group">
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    className="certificate-input"
                    style={{ display: 'none' }}
                    id="pdf-upload"
                    onChange={handleFileChange}
                  />
                  <span className="upload-icon" onClick={handleUploadClick} title="Upload PDF" role="button" tabIndex={0}>
                    📎
                  </span>
                  <div className="upload-placeholder" onClick={handleUploadClick} tabIndex={0} role="button">
                    Click here to upload PDF <span role="img" aria-label="paperclip">📎</span>
                  </div>
                  <button className="verify-button" onClick={handleVerifyPdf}>Verify</button>
                </div>
              </div>
              <div className="verification-card">
                <div className="verification-title">Check and Download using ID</div>
                <div className="input-group">
                  <input
                    type="text"
                    className="certificate-input"
                    placeholder="Enter Certificate ID"
                    value={idInput}
                    onChange={handleIdInputChange}
                  />
                  <button className="verify-button" onClick={handleVerifyId}>Check</button>
                </div>
                <a
                  href="https://www.youtube.com/watch?v=yqWX86uT5jM"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-tutorial-btn"
                >
                  <span className="play-icon">▶️</span> Watch our small tutorial on YouTube
                </a>
              </div>
            </div>
          </div>
          <div className="hero-image-row">
            <img src={pic1} alt="Certificate" className="cert-image" />
            <img src={pic5} alt="Trust" className="side-pic5 large" />
          </div>
        </section>

        <section className="features-section">
          <div className="features-container">
            <h2 className="features-title">Key Features</h2>
            <div className="features-grid">
              <div className="feature-box">
                <span className="feature-icon">🔒</span>
                <h3 className="feature-title">Secure Storage</h3>
                <p className="feature-description">
                  All certificates are stored securely using blockchain technology
                </p>
              </div>
              <div className="feature-box">
                <span className="feature-icon">⚡</span>
                <h3 className="feature-title">Instant Verification</h3>
                <p className="feature-description">
                  Verify certificates instantly with unique IDs
                </p>
              </div>
              <div className="feature-box">
                <span className="feature-icon">🤖</span>
                <h3 className="feature-title">AI Assistant</h3>
                <p className="feature-description">
                  Get instant answers about your certificates
                </p>
              </div>
            </div>
            <div className="key-image-below-grid">
              <img src={key} alt="Key Features" className="key-image large" />
            </div>
            <div className="features-content">
              <h3>Why Choose Our Platform?</h3>
              <p>Our platform combines cutting-edge blockchain technology with advanced AI to provide the most secure and efficient certificate management system available. With features like instant verification, secure storage, and AI-powered assistance, we ensure your certificates are always protected and easily accessible.</p>
              <ul>
                <li>Blockchain-powered security</li>
                <li>Instant verification system</li>
                <li>AI-powered assistance</li>
                <li>User-friendly interface</li>
                <li>24/7 support available</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Body;
