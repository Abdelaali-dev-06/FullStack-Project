import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaHome, FaStar, FaInfoCircle, FaQuestionCircle, FaBlog, FaEnvelope, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import './HomeHeader.css';
import logo from './assets/logo.png';

function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    checkAuthStatus();
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname]);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
    setMenuOpen(false);
  };

  const handleSectionNav = (sectionId) => (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (sectionId === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      e.preventDefault();
    }

    setMenuOpen(false);
  };

  const getLinkClass = (path) => {
    if (path === '/') {
      return location.pathname === '/' ? 'active' : '';
    }
    return location.pathname.startsWith(path) ? 'active' : '';
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <div className="logo-container">
            <Link to="/" onClick={handleSectionNav('home')}>
              <img src={logo} alt="certa.com Logo" className="logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }} />
              <div className="logo-placeholder" style={{ display: 'none' }}></div>
              <span className="logo-text">Certa<span className="com-text">.com</span></span>
            </Link>
          </div>

          <nav
            className={`nav-menu${menuOpen ? ' open' : ''}`}
            aria-label="Main navigation">
            <ul className="nav-links">
              <li>
                <Link to="/" onClick={handleSectionNav('home')} className={getLinkClass('/')}>
                  <FaHome className="nav-icon" />
                  <span className="nav-text">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/features" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className={getLinkClass('/features')}>
                  <FaStar className="nav-icon" />
                  <span className="nav-text">Features</span>
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className={getLinkClass('/about')}>
                  <FaInfoCircle className="nav-icon" />
                  <span className="nav-text">About</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className={getLinkClass('/faq')}>
                  <FaQuestionCircle className="nav-icon" />
                  <span className="nav-text">FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className={getLinkClass('/blog')}>
                  <FaBlog className="nav-icon" />
                  <span className="nav-text">Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => { setMenuOpen(false); window.scrollTo(0, 0); }} className={getLinkClass('/contact')}>
                  <FaEnvelope className="nav-icon" />
                  <span className="nav-text">Contact</span>
                </Link>
              </li>

              <li className="mobile-auth-buttons">
                <div className="mobile-menu-divider"></div>
                <div className="auth-buttons-mobile-in-menu">
                  {isLoggedIn ? (
                    <button className="btn btn-primary logout-btn" onClick={handleLogout}>
                      <FaSignOutAlt className="btn-icon" />
                      <span className="btn-text">Logout</span>
                    </button>
                  ) : (
                    <>
                      <button className="btn btn-outline login-btn" onClick={() => { navigate('/login'); setMenuOpen(false); window.scrollTo(0, 0); }}>
                        <FaSignInAlt className="btn-icon" />
                        <span className="btn-text">Login</span>
                      </button>
                      <button className="btn btn-primary signup-btn" onClick={() => { navigate('/register'); setMenuOpen(false); window.scrollTo(0, 0); }}>
                        <FaUserPlus className="btn-icon" />
                        <span className="btn-text">Sign Up</span>
                      </button>
                    </>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          <div className="auth-buttons desktop-only">
            {isLoggedIn ? (
              <button className="btn btn-primary logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="btn-icon" />
                <span className="btn-text">Logout</span>
              </button>
            ) : (
              <>
                <button className="btn btn-outline login-btn" onClick={() => { navigate('/login'); window.scrollTo(0, 0); }}>
                  <FaSignInAlt className="btn-icon" />
                  <span className="btn-text">Log in</span>
                </button>
                <button className="btn btn-primary signup-btn" onClick={() => { navigate('/register'); window.scrollTo(0, 0); }}>
                  <FaUserPlus className="btn-icon" />
                  <span className="btn-text">Sign Up</span>
                </button>
              </>
            )}
          </div>

          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={handleMenuToggle} aria-label="Toggle menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>
    </>
  );
}

export default HomeHeader;