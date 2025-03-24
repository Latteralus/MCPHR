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
import Head from 'next/head';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="container">
      <Head>
        <title>Mountain Care HR Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Mountain Care Logo" />
          <span>Mountain Care</span>
        </div>
        <nav className="sidebar-menu">
          <Link href="/dashboard" className="menu-item active">
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
          <img src="/images/avatar.png" alt="User avatar" />
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