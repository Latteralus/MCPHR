import Link from 'next/link';
import { FC, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUsers,
  faCalendarAlt,
  faCalendarCheck,
  faClipboardList,
  faUserMinus,
  faShieldAlt,
  faFileAlt,
  faCog
} from '@fortawesome/free-solid-svg-icons';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="https://via.placeholder.com/40" alt="Mountain Care Logo" />
          <span>Mountain Care</span>
        </div>
        <nav className="sidebar-menu">
          <Link href="/" className="menu-item active">
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </Link>
          <Link href="/employees" className="menu-item">
            <FontAwesomeIcon icon={faUsers} /> Employees
          </Link>
          <Link href="/attendance" className="menu-item">
            <FontAwesomeIcon icon={faCalendarAlt} /> Attendance
          </Link>
          <Link href="/leave" className="menu-item">
            <FontAwesomeIcon icon={faCalendarCheck} /> Leave Management
          </Link>
          <Link href="/onboarding" className="menu-item">
            <FontAwesomeIcon icon={faClipboardList} /> Onboarding
          </Link>
          <Link href="/offboarding" className="menu-item">
            <FontAwesomeIcon icon={faUserMinus} /> Offboarding
          </Link>
          <Link href="/compliance" className="menu-item">
            <FontAwesomeIcon icon={faShieldAlt} /> Compliance
          </Link>
          <Link href="/documents" className="menu-item">
            <FontAwesomeIcon icon={faFileAlt} /> Documents
          </Link>
          <Link href="/settings" className="menu-item">
            <FontAwesomeIcon icon={faCog} /> Settings
          </Link>
        </nav>
        <div className="sidebar-footer">
          <img src="https://via.placeholder.com/36" alt="User avatar" />
          <div className="user-info">
            <div className="user-name">Faith Calkins</div>
            <div className="user-role">HR Director</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;