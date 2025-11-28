import React from 'react';
import './HomeFooter.css';
import logo from './assets/logo.png';

function HomeFooter() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src={logo} alt="ngcfo.com Logo" className="logo" />
            <span className="logo-text">ngcfo.<span className="com-text">COM</span></span>
          </div>
          <p className="footer-description">
            Secure certificate management with blockchain technology for unparalleled security and reliability.
          </p>
        </div>
        
        <div className="footer-links">
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/features">Features</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Contact</h3>
            <ul>
              <li><a href="mailto:info@ngcfo.com">info@ngcfo.com</a></li>
              <li><a href="tel:+1234567890">+123 456 7890</a></li>
              <li>Address: 123 Blockchain Blvd, Digital City</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="heart-text">Made with ❤️ by Abdellatif Dafiaa, Imad Bouhssou, and Abdellah Elhasni</p>
        <p className="copyright">© {new Date().getFullYear()} ngcfo.com. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default HomeFooter;
