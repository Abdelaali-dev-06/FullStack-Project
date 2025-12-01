import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import SpotlightCard from './SpotlightCard';
import { FaFileAlt, FaUniversity, FaLock, FaChartBar, FaCloud, FaKey } from 'react-icons/fa';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: <FaFileAlt className="feature-icon-svg" />,
      title: "Unique Certificate IDs",
      description: "Each certificate is assigned a unique 8-character ID along with an operation ID. These identifiers make every certificate traceable, verifiable, and tamper-resistant."
    },
    {
      icon: <FaUniversity className="feature-icon-svg" />,
      title: "School-Specific IDs",
      description: "Every institution receives a unique, randomly generated ID, ensuring a clear structure and separation between data sources."
    },
    {
      icon: <FaLock className="feature-icon-svg" />,
      title: "Blockchain-Based Verification",
      description: "All certificates and related documents are authenticated using metadata stored on the blockchain-including cryptographic hashes-ensuring authenticity and preventing forgery."
    },

    {
      icon: <FaChartBar className="feature-icon-svg" />,
      title: "Smart Management Dashboard",
      description: "Schools can issue certificates with ease, and employers can verify them in seconds. The intuitive dashboard is designed for simplicity, speed, and control."
    },
    {
      icon: <FaCloud className="feature-icon-svg" />,
      title: "Secure Cloud Storage",
      description: "Certificates and documents (PDFs) are stored in the cloud with regular backups, providing both reliability and scalability."
    },
    {
      icon: <FaKey className="feature-icon-svg" />,
      title: "Global, Seamless Platform",
      description: "Access your credentials anytime, anywhere with military-grade security. Our smooth, intuitive sign-up and login process ensures zero friction, getting you verified and connected instantly."
    }
  ];

  return (
    <>
      <HomeHeader />
      <div className="features-root">
        <div className="container">
          <div className="features-header">
            <h1 className="features-main-title">Features</h1>
            <p className="features-main-subtitle">
              Discover the powerful features that make CERTA.com the most secure and efficient certificate management platform.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <SpotlightCard key={index} spotlightColor="rgba(11, 102, 35, 0.15)" className="feature-spotlight">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
      <HomeFooter />
    </>
  );
};

export default Features;