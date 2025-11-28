import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import './Contact.css';

function Contact() {
  return (
    <>
      <HomeHeader />
      <div className="contact-root">
        <div className="contact-container">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            Have questions about our certificate verification platform? We're here to help! 
            Reach out to our team for assistance with implementation, pricing, or any other inquiries.
          </p>
          
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon email-icon">✉️</div>
              <h3>Email</h3>
              <a href="mailto:info@ngcfo.com" className="contact-link">info@ngcfo.com</a>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon phone-icon">📞</div>
              <h3>Phone</h3>
              <a href="tel:+1234567890" className="contact-link">+123 456 7890</a>
            </div>
          </div>

          <div className="contact-form-container">
            <h2>Send us a Message</h2>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
}

export default Contact; 