import React from 'react';
import './FaqQ.css';
import { Link } from 'react-router-dom';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';

const FaqQ = () => {
  const faqs = [
    {
      question: "How does NGCFO ensure the authenticity of certificates?",
      answer: "We use blockchain technology to store cryptographic hashes and metadata for every certificate. This ensures that each document is tamper-proof and can be independently verified for authenticity at any time."
    },
    {
      question: "Can third parties verify a certificate without contacting the issuing school?",
      answer: "Yes. Employers and third parties can verify certificates instantly by uploading the certificate PDF, and can see them using the ID through our home main page."
    },
    {
      question: "What if a certificate is lost or deleted?",
      answer: "No worries. All certificates are securely stored in the cloud with backup systems in place. You can retrieve them anytime through your dashboard using the unique certificate ID or by interacting with our AI assistant."
    }
  ];

  return (
    <>
      <HomeHeader />
      <div className="faq-root">
        <div className="faq-container">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">
            Find answers to common questions about our certificate verification platform.
          </p>
          <div className="faq-content">
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div key={index} className="faq-box">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="faq-actions">
              <Link to="/blog" className="faq-button blog-button">
                Do you have more questions? Check our blog
              </Link>
              <Link to="/contact" className="faq-button contact-button">
                Or you can contact us
              </Link>
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default FaqQ; 