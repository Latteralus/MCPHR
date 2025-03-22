import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Layout.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Navigation items with icons
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/employees', name: 'Employees', icon: '👥' },
    { path: '/licenses', name: 'Licenses', icon: '🔐' },
    { path: '/attendance', name: 'Attendance', icon: '📅' },
    { path: '/documents', name: 'Documents', icon: '📄' }
  ];

  // Admin only navigation items
  const adminNavItems = [
    { path: '/settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h1 className="app-title">
            {isSidebarCollapsed ? 'MC' : 'Mountain Care HR'}
          </h1>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isSidebarCollapsed ? '►' : '◄'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </Link>
              </li>
            ))}

            {/* Show admin items only for admin/manager roles */}
            {user && (user.role === 'admin' || user.role === 'manager') && (
              <>
                <li className="nav-divider">
                  {!isSidebarCollapsed && <span>Administration</span>}
                </li>
                
                {adminNavItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={location.pathname === item.path ? 'active' : ''}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {!isSidebarCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {!isSidebarCollapsed && (
            <button className="logout-button" onClick={handleLogout}>
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </button>
          )}
          {isSidebarCollapsed && (
            <button className="logout-button-icon" onClick={handleLogout}>
              🚪
            </button>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            <h2>{getCurrentPageTitle(location.pathname)}</h2>
          </div>
          <div className="header-user">
            {user && (
              <>
                <span className="user-greeting">
                  Hello, {user.firstName} {user.lastName}
                </span>
                <span className="user-role">{capitalizeRole(user.role)}</span>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="content">
          {children}
        </div>
      </main>
    </div>
  );
};

// Helper function to get the current page title
const getCurrentPageTitle = (pathname: string): string => {
  const path = pathname.split('/')[1];
  return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard';
};

// Helper function to capitalize role
const capitalizeRole = (role: string): string => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default MainLayout;