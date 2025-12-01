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
  };

  return (
    <header className="dashboard-header">
      <div className="brand">Administration</div>
      {isMobile && (
        <button className="header-hamburger" onClick={() => setNavOpen(!navOpen)}>
          <FaBars size={26} />
        </button>
      )}
    </header>
  );
};

export default Header; 