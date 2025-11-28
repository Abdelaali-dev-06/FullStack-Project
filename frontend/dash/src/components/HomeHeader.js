import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './HomeHeader.css';
import logo from './assets/logo.png';

function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to handle section navigation from any page
  const handleSectionNav = (sectionId) => (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="ngcfo.com Logo" className="logo" />
              <span className="logo-text">NGCFO.<span className="com-text">COM</span></span>
            </Link>
          </div>
          <nav className={`nav-menu${menuOpen ? ' open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </nav>
          <button className="hamburger" onClick={handleMenuToggle} aria-label="Toggle menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>
      <div className="auth-buttons-below-header">
        <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
        <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
      </div>
      <button className="scroll-to-top-btn" onClick={handleScrollToTop} aria-label="Scroll to top">
        <span style={{fontWeight: 900, fontSize: '2rem', lineHeight: 1}}>&uarr;</span>
      </button>
    </>
  );
}

export default HomeHeader;