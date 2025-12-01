import React from 'react';
import './HomeFooter.css';
import logo from './assets/logo.png';

function HomeFooter() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src={logo} alt="certa.com Logo" className="logo" />
            <span className="logo-text">Certa<span className="com-text">.com</span></span>
          </div>
          <p className="footer-description">
            Secure certificate management with blockchain technology for unparalleled security and reliability.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h3>Company</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Get in Touch</h3>
            <ul>
              <li><a href="mailto:info@certa.com">info@certa.com</a></li>
              <li><a href="tel:+1234567890">+123 456 7890</a></li>
              <li>123 Blockchain Blvd, Digital City</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p className="heart-text">Made by Abdelaali Bezziz and Abdellah Elhasni</p>
          <p className="copyright">© {new Date().getFullYear()} certa.com. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
