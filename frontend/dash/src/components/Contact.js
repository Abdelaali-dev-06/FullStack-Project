import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
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
              <div className="contact-icon email-icon"><FaEnvelope /></div>
              <h3>Email</h3>
              <a href="mailto:info@certa.com" className="contact-link">info@certa.com</a>
            </div>

            <div className="contact-card">
              <div className="contact-icon phone-icon"><FaPhone /></div>
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
              <button type="submit" className="send-button">
                <div className="svg-wrapper-1">
                  <div className="svg-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path
                        fill="currentColor"
                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
}

export default Contact; 