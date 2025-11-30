import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
        setScrolled(window.scrollY > 50);
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
      navigate('/');
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

  // 💡 NEW LOGIC: Function to determine if a link is the active page
  const getLinkClass = (path) => {
    // Use exact match for the home page ('/') to prevent it from matching all paths
    if (path === '/') {
        return location.pathname === '/' ? 'active' : '';
    }
    // For other pages, check if the current path starts with the link path
    return location.pathname.startsWith(path) ? 'active' : '';
  };
  // END NEW LOGIC

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}> 
        <div className="header-container">
          <div className="logo-container">
            <Link to="/" onClick={handleSectionNav('home')}> 
              <img src={logo} alt="certa.com Logo" className="logo" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}/>
              <div className="logo-placeholder" style={{ display: 'none' }}></div>
              <span className="logo-text">Certa<span className="com-text">.Com</span></span>
            </Link>
          </div>
          <nav 
            className={`nav-menu${menuOpen ? ' open' : ''}`} 
            aria-expanded={menuOpen}
            aria-label="Main navigation">
            <ul className="nav-links">
              <li><Link to="/" onClick={handleSectionNav('home')} className={getLinkClass('/')}>Home</Link></li>
              <li><Link to="/features" onClick={() => setMenuOpen(false)} className={getLinkClass('/features')}>Features</Link></li>
              <li><Link to="/about" onClick={() => setMenuOpen(false)} className={getLinkClass('/about')}>About</Link></li>
              <li><Link to="/faq" onClick={() => setMenuOpen(false)} className={getLinkClass('/faq')}>FAQ</Link></li>
              <li><Link to="/blog" onClick={() => setMenuOpen(false)} className={getLinkClass('/blog')}>Blog</Link></li>
              <li><Link to="/contact" onClick={() => setMenuOpen(false)} className={getLinkClass('/contact')}>Contact</Link></li>
              
              <li className="mobile-auth-buttons">
                <div className="auth-buttons-mobile-in-menu">
                    {isLoggedIn ? (
                       <>
                            
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                         <>
                            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                            <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
                        </>
                    )}
                </div>
              </li>
            </ul>
          </nav>
          
        
          <div className="auth-buttons desktop-only">
            {isLoggedIn ? (
               <>
                    
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </>
            ) : (
                 <>
                    <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
                    <button className="signup-btn" onClick={() => navigate('/register')}>Sign Up</button>
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