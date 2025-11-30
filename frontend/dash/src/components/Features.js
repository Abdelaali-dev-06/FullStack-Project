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
      icon: "📊",
      title: "Smart Management Dashboard",
      description: "Schools can issue certificates with ease, and employers can verify them in seconds. The intuitive dashboard is designed for simplicity, speed, and control."
    },
    {
      icon: "☁️",
      title: "Secure Cloud Storage",
      description: "Certificates and documents (PDFs) are stored in the cloud with regular backups, providing both reliability and scalability."
    },
    {
      icon: "🔑",
      title: "Global, Seamless Platform",
      description: "Access your credentials anytime, anywhere with military-grade security. Our smooth, intuitive sign-up and login process ensures zero friction, getting you verified and connected instantly."
    }
  ];

  return (
    <>
      <HomeHeader />
      <div className="features-root">
        
        {/* The Main Title remains OUTSIDE the box, against the gradient */}
        <h1 className="features-main-title">Features</h1>
        
        {/* This is the ONE main content box, now BLACK */}
        <div className="features-container">
          {/* FIX: Subtitle is now INSIDE the black box, styled white */}
          <p className="features-main-subtitle-in-box">
              Discover the powerful features that make CERTA.com the most secure and efficient certificate management platform.
          </p>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-box">
                {/* feature-box is WHITE */}
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                
                {/* feature-content-box provides the inner black border */}
                <div className="feature-content-box">
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default Features;