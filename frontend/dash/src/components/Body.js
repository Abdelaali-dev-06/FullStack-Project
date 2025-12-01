import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaBolt, FaGlobe, FaShieldAlt, FaLeaf, FaMoneyBillWave } from 'react-icons/fa';
import './Body.css';
import pic1 from './assets/pic1.png';
import pic5 from './assets/pic5.png';
import SpotlightCard from './SpotlightCard';


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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to verify certificates.');
      navigate('/login');
      return;
    }

    if (!pdfFile) {
      alert('Please select a PDF file first.');
      return;
    }
    const formData = new FormData();
    formData.append('file', pdfFile);
    try {
      const res = await fetch('http://localhost:8000/api/public/verify/pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data && data.message && (data.message.toLowerCase().includes('not active') || data.message.toLowerCase().includes('inactive'))) {
        navigate('/res3', { state: data });
        return;
      }

      if (res.ok && data && data.message && data.message.toLowerCase().includes('active')) {
        navigate('/res1', { state: data });
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
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to verify certificates.');
      navigate('/login');
      return;
    }

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

      if (data && data.status && data.status.toLowerCase() === 'inactive') {
        navigate('/res3', { state: data });
        return;
      }

      if (res.ok && data && data.status && data.status.toLowerCase() === 'active') {
        navigate('/res2', { state: data });
      } else if (res.ok && data) {
        navigate('/res2', { state: data });
      } else {
        alert(data.message || 'Verification failed.');
      }
    } catch (err) {
      alert('An error occurred while verifying the ID.');
    }
  };

  return (
    <>
      <div className="main-content">
        <section className="hero-section">
          <div className="container hero-container">
            <div className="hero-text">
              <h1 className="hero-title">Secure Certificate Authentication with Blockchain</h1>
              <p className="hero-subtitle">
                Verify, store, and manage certificates with unparalleled security and ease.
                Powered by cutting-edge blockchain technology.
              </p>

              <div className="verification-wrapper">
                <div className="verification-tabs">
                  <div className="verification-box">
                    <h3>Verify by ID</h3>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter Certificate ID"
                        value={idInput}
                        onChange={handleIdInputChange}
                      />
                      <button className="btn btn-primary" onClick={handleVerifyId}>Check</button>
                    </div>
                  </div>

                  <div className="verification-divider">OR</div>

                  <div className="verification-box">
                    <h3>Verify by PDF</h3>
                    <div className="input-group">
                      <input
                        type="file"
                        accept="application/pdf"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <button className="btn btn-outline full-width" onClick={handleUploadClick}>
                        {pdfFile ? pdfFile.name : 'Upload PDF Document'}
                      </button>
                      <button className="btn btn-primary" onClick={handleVerifyPdf}>Verify</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-image-container">
              <img src={pic1} alt="Certificate Verification" className="hero-img" />
            </div>
          </div>
        </section>

        <section className="services-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Our Services</h2>
              <p className="section-desc">Comprehensive solutions for certificate management and verification.</p>
            </div>

            <div className="services-grid">
              <div className="service-card">
                <div className="service-icon"><FaLock /></div>
                <h3>Blockchain Security</h3>
                <p>Immutable and tamper-proof storage for all your digital credentials.</p>
                <a href="/features" className="service-link">View more →</a>
              </div>

              <div className="service-card">
                <div className="service-icon"><FaBolt /></div>
                <h3>Instant Verification</h3>
                <p>Real-time verification of certificates using unique IDs or QR codes.</p>
                <a href="/features" className="service-link">View more →</a>
              </div>

              <div className="service-card">
                <div className="service-icon"><FaGlobe /></div>
                <h3>Global Access</h3>
                <p>Access and verify your documents from anywhere in the world, 24/7.</p>
                <a href="/features" className="service-link">View more →</a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Why Choose Us?</h2>
              <p className="section-desc">Discover the unique benefits that set our platform apart.</p>
            </div>

            <div className="features-grid-cards">
              <SpotlightCard spotlightColor="rgba(11, 102, 35, 0.15)">
                <div className="feature-card-item">
                  <div className="feature-icon-small"><FaShieldAlt /></div>
                  <h4>Tamper-Proof</h4>
                  <p>Once issued, certificates cannot be altered or forged.</p>
                  <button onClick={() => navigate('/about')} className="btn btn-primary btn-sm">Learn More</button>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(11, 102, 35, 0.15)">
                <div className="feature-card-item">
                  <div className="feature-icon-small"><FaLeaf /></div>
                  <h4>Eco-Friendly</h4>
                  <p>Reduce paper waste with digital-first certificate management.</p>
                  <button onClick={() => navigate('/about')} className="btn btn-primary btn-sm">Learn More</button>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(11, 102, 35, 0.15)">
                <div className="feature-card-item">
                  <div className="feature-icon-small"><FaMoneyBillWave /></div>
                  <h4>Cost-Effective</h4>
                  <p>Save on printing, shipping, and administrative costs.</p>
                  <button onClick={() => navigate('/about')} className="btn btn-primary btn-sm">Learn More</button>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(11, 102, 35, 0.15)">
                <div className="feature-card-item">
                  <div className="feature-icon-small"><FaLock /></div>
                  <h4>Blockchain Security</h4>
                  <p>Immutable records secured by distributed ledger technology.</p>
                  <button onClick={() => navigate('/about')} className="btn btn-primary btn-sm">Learn More</button>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Promo Section */}
        <section className="promo-section">
          <div className="container promo-container">
            <div className="promo-content">
              <h2>Trusted by Leading Institutions</h2>
              <p>Join thousands of organizations securing their credentials with our blockchain technology.</p>
              <button onClick={() => navigate('/login')} className="btn btn-primary">Get Started Today</button>
            </div>
            <div className="promo-image">
              <img src={pic5} alt="Trusted Partner" className="promo-img" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Body;