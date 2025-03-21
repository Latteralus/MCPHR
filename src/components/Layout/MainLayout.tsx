import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const user = authState.user;
  const employee = authState.employee;

  return (
    <div className="container">
      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-logo">
          <img src="/logo-placeholder.png" alt="Mountain Care Logo" />
          <span>Mountain Care</span>
        </div>
        <nav className="sidebar-menu">
          <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}>
            <i className="fas fa-home"></i>
            Dashboard
          </Link>
          <Link to="/employees" className={`menu-item ${location.pathname.startsWith('/employees') ? 'active' : ''}`}>
            <i className="fas fa-users"></i>
            Employees
          </Link>
          <Link to="/attendance" className={`menu-item ${location.pathname.startsWith('/attendance') ? 'active' : ''}`}>
            <i className="fas fa-calendar-alt"></i>
            Attendance
          </Link>
          <Link to="/licenses" className={`menu-item ${location.pathname.startsWith('/licenses') ? 'active' : ''}`}>
            <i className="fas fa-id-card"></i>
            Licenses
          </Link>
          <Link to="/documents" className={`menu-item ${location.pathname.startsWith('/documents') ? 'active' : ''}`}>
            <i className="fas fa-file-alt"></i>
            Documents
          </Link>
          <Link to="/settings" className={`menu-item ${location.pathname.startsWith('/settings') ? 'active' : ''}`}>
            <i className="fas fa-cog"></i>
            Settings
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="user-avatar">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-role">{employee?.position || user?.role}</div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;