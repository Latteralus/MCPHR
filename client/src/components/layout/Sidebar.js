// client/src/components/layout/Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../../styles/sidebar.css';

const Sidebar = ({ activeItem, user, onLogout }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close sidebar when clicking on a link in mobile view
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Menu items configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', path: '/dashboard' },
    { id: 'employees', label: 'Employees', icon: 'users', path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: 'calendar-alt', path: '/attendance' },
    { id: 'leave', label: 'Leave Management', icon: 'calendar-check', path: '/leave' },
    { id: 'onboarding', label: 'Onboarding', icon: 'clipboard-list', path: '/onboarding' },
    { id: 'offboarding', label: 'Offboarding', icon: 'user-minus', path: '/offboarding' },
    { id: 'compliance', label: 'Compliance', icon: 'shield-alt', path: '/compliance' },
    { id: 'documents', label: 'Documents', icon: 'file-alt', path: '/documents' },
    { id: 'settings', label: 'Settings', icon: 'cog', path: '/settings' }
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <img src="/assets/logo.png" alt="Mountain Care Logo" />
          <span>Mountain Care</span>
        </div>
        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <Link 
              key={item.id}
              to={item.path}
              className={`menu-item ${
                activeItem === item.id || location.pathname === item.path ? 'active' : ''
              }`}
              onClick={handleLinkClick}
            >
              <i className={`fas fa-${item.icon}`}></i>
              {item.label}
            </Link>
          ))}
          
          <Link 
            to="/login" 
            className="menu-item logout-item"
            onClick={(e) => {
              e.preventDefault();
              if (props.onLogout) props.onLogout();
            }}
          >
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </Link>
        </nav>
        <div className="sidebar-footer">
          <img 
            src={user?.avatar || "https://via.placeholder.com/36"} 
            alt={`${user?.first_name || 'User'} avatar`}
          />
          <div className="user-info">
            <div className="user-name">{`${user?.first_name || 'User'} ${user?.last_name || ''}`}</div>
            <div className="user-role">{user?.role || 'Staff'}</div>
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle button */}
      {isMobile && (
        <button className="mobile-menu-toggle" onClick={toggleSidebar}>
          <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
        </button>
      )}
    </>
  );
};

export default Sidebar;