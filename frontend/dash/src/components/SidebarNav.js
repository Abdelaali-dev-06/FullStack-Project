import React from 'react';
import { FaUser, FaPlus, FaCheckSquare, FaTrash, FaComments, FaChartBar, FaInfoCircle } from 'react-icons/fa';
import './SidebarNav.css';

const navItems = [
  { key: 'account', label: 'Account', icon: <FaUser /> },
  { key: 'create', label: 'Create', icon: <FaPlus /> },
  { key: 'verify-download', label: 'Verify & Download', icon: <FaCheckSquare /> },
  { key: 'delete', label: 'Delete/Edit', icon: <FaTrash /> },
  { key: 'chat', label: 'Chat with AI', icon: <FaComments /> },
  { key: 'history', label: 'Upload History', icon: <FaChartBar /> },
  { key: 'support', label: 'Support', icon: <FaInfoCircle /> },
];

const SidebarNav = ({ activePage, setActivePage, isMobile, navOpen, setNavOpen }) => {
  if (isMobile && !navOpen) return null;

  const handleClick = (key) => {
    console.log('Nav item clicked:', key);
    // If verify-download button is clicked, show Account component but keep verify-download active
    if (key === 'verify-download') {
      setActivePage('verify-download');
    } else {
      setActivePage(key);
    }
    if (isMobile) setNavOpen(false);
  };

  return (
    <nav className={`sidebar-nav${isMobile ? ' mobile-overlay' : ''}${isMobile && navOpen ? ' open' : ''}`}>
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`sidebar-nav-btn${activePage === item.key ? ' active' : ''}`}
          onClick={() => handleClick(item.key)}
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span className="sidebar-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default SidebarNav; 