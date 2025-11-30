import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isMobile, navOpen, setNavOpen }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token.split('|')[1],
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert('Logout failed.');
      }
    } catch (error) {
      alert('Logout failed.');
    }
  };

  return (
    <header className="dashboard-header">
      <div className="brand">CERTA.com</div>
      {isMobile && (
        <button className="header-hamburger" onClick={() => setNavOpen(!navOpen)}>
          <FaBars size={26} />
        </button>
      )}
      <button className="logout-btn compact" onClick={handleLogout} title="Logout">
        <FiLogOut style={{marginRight: '0.4rem', fontSize: '1.2rem'}} /> Logout
      </button>
    </header>
  );
};

export default Header; 