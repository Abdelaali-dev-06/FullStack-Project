import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import './About.css';

function About() {
  return (
    <>
      <HomeHeader />
      <div className="about-root">
        <div className="about-container">
          <h1 className="about-title">About CERTA</h1>
          <div className="about-content">
            <p className="about-main-text">
              CERTA.com is built to make certificate management secure and simple.
            </p>
            <p className="about-description">
              We use blockchain to verify authenticity, helping you instantly access your documents. Whether you're a school, student, or employer, our platform ensures every certificate is safe, trusted, and easy to verify anytime, anywhere.
            </p>
            <div className="about-features">
              <div className="about-feature">
                <span className="feature-icon">🔒</span>
                <h3>Secure</h3>
                <p>Blockchain-powered verification ensures document authenticity</p>
              </div>
              <div className="about-feature">
                <span className="feature-icon">⚡</span>
                <h3>Simple</h3>
                <p>Easy-to-use interface for quick certificate management</p>
              </div>
              {/* <div className="about-feature">
                <span className="feature-icon">🤖</span>
                <h3>Smart</h3>
                <p>AI-powered tools for instant access and verification</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
}

export default About; 