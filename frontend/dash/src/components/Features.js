import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: "📄",
      title: "Unique Certificate IDs",
      description: "Each certificate is assigned a unique 8-character ID along with an operation ID. These identifiers make every certificate traceable, verifiable, and tamper-resistant."
    },
    {
      icon: "🏫",
      title: "School-Specific IDs",
      description: "Every institution receives a unique, randomly generated ID, ensuring a clear structure and separation between data sources."
    },
    {
      icon: "🔐",
      title: "Blockchain-Based Verification",
      description: "All certificates and related documents are authenticated using metadata stored on the blockchain—including cryptographic hashes—ensuring authenticity and preventing forgery."
    },
    {
      icon: "🧠",
      title: "AI-Powered Chat Assistant",
      description: "Our integrated AI chat assistant allows users to instantly access certificate details. Ask questions about certificate holders, IDs, issuance dates, or verification status—your data is just a message away."
    },
    {
      icon: "📊",
      title: "Smart Management Dashboard",
      description: "Schools can issue certificates with ease, and employers can verify them in seconds. The intuitive dashboard is designed for simplicity, speed, and control."
    },
    {
      icon: "☁️",
      title: "Secure Cloud Storage",
      description: "Certificates and documents (PDFs) are stored in the cloud with regular backups, providing both reliability and scalability."
    }
  ];

  return (
    <>
      <HomeHeader />
      <div className="features-root">
        <div className="features-container">
          <h1 className="features-title">Features</h1>
          <p className="features-subtitle">
            Discover the powerful features that make NGCFO.com the most secure and efficient certificate management platform.
          </p>
          <div className="features-content">
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-box">
                  <div className="feature-header">
                    <span className="feature-icon">{feature.icon}</span>
                    <h3 className="feature-title">{feature.title}</h3>
                  </div>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default Features; 