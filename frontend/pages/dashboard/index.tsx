import { useState } from 'react';
import Layout from '../../components/Layout';
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
  faCog,
  faSearch,
  faBell,
  faPlus,
  faArrowUp,
  faArrowDown,
  faHourglassHalf,
  faUserPlus,
  faClipboardCheck,
  faClock,
  faFileUpload,
  faChartLine,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  // State for search functionality (can be expanded later)
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className="dashboard-container">
        <div className="header">
          <div className="page-title">
            <h1>Dashboard</h1>
            <div className="page-subtitle">Welcome back, Faith! Here's what's happening today.</div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="notification-badge">
              <FontAwesomeIcon icon={faBell} />
              <span className="badge">3</span>
            </div>
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} /> New Employee
            </button>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Stats Row */}
          <div className="col-span-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">
                  <FontAwesomeIcon icon={faUsers} /> Total Employees
                </div>
                <div className="stat-value">198</div>
                <div className="stat-description">
                  <span className="stat-trend trend-up">
                    <FontAwesomeIcon icon={faArrowUp} /> 3.2%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">
                  <FontAwesomeIcon icon={faCalendarCheck} /> Attendance Rate
                </div>
                <div className="stat-value">96.5%</div>
                <div className="stat-description">
                  <span className="stat-trend trend-up">
                    <FontAwesomeIcon icon={faArrowUp} /> 1.8%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">
                  <FontAwesomeIcon icon={faHourglassHalf} /> Leave Requests
                </div>
                <div className="stat-value">12</div>
                <div className="stat-description">
                  <span className="stat-trend trend-down">
                    <FontAwesomeIcon icon={faArrowDown} /> 2.5%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-span-3">
            <div className="card stat-card">
              <div className="card-body">
                <div className="stat-label">
                  <FontAwesomeIcon icon={faClipboardList} /> Compliance Rate
                </div>
                <div className="stat-value">98.2%</div>
                <div className="stat-description">
                  <span className="stat-trend trend-up">
                    <FontAwesomeIcon icon={faArrowUp} /> 0.7%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>

          {/* License Expiry */}
          <div className="col-span-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">License Operations</h3>
                <a href="#" className="action-link">
                  View all <FontAwesomeIcon icon={faChevronRight} />
                </a>
              </div>
              <div className="card-body">
                {[
                  {
                    initials: 'JD',
                    name: 'James Kirk',
                    licenseType: 'Pharmacist License',
                    status: 'danger',
                    days: 7
                  },
                  {
                    initials: 'MM',
                    name: 'Leonard McCoy',
                    licenseType: 'Pharmacy Tech License',
                    status: 'warning',
                    days: 14
                  },
                  {
                    initials: 'RL',
                    name: 'Nyota Uhura',
                    licenseType: 'Controlled Substance License',
                    status: 'warning',
                    days: 21
                  },
                  {
                    initials: 'JD',
                    name: 'William Manager',
                    licenseType: '90 Day Review',
                    status: 'warning',
                    days: 23
                  },
                  {
                    initials: 'JD',
                    name: 'Washington State',
                    licenseType: 'State License Renewal',
                    status: 'warning',
                    days: 25
                  }
                ].map((license, index) => (
                  <div className="license-item" key={index}>
                    <div className="license-item-avatar">{license.initials}</div>
                    <div className="license-item-info">
                      <div className="license-item-name">{license.name}</div>
                      <div className="license-item-detail">{license.licenseType}</div>
                    </div>
                    <div className={`license-status status-${license.status}`}>
                      {license.days} days
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-8">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
                <a href="#" className="action-link">
                  View all <FontAwesomeIcon icon={faChevronRight} />
                </a>
              </div>
              <div className="card-body">
                {[
                  {
                    time: 'Today, 10:30 AM',
                    user: 'Sarah Johnson',
                    description: 'approved time off request for Emily Chen'
                  },
                  {
                    time: 'Today, 9:45 AM',
                    user: 'David Wilson',
                    description: 'uploaded a new document to the compliance portal'
                  },
                  {
                    time: 'Today, 8:15 AM',
                    user: 'Lisa Patel',
                    description: 'completed onboarding for Mark Thompson'
                  },
                  {
                    time: 'Yesterday, 4:30 PM',
                    user: 'James Rodriguez',
                    description: 'updated the employee handbook'
                  },
                  {
                    time: 'Yesterday, 2:15 PM',
                    user: 'Maria Garcia',
                    description: 'added 3 new training modules to the compliance system'
                  }
                ].map((activity, index) => (
                  <div className="activity-item" key={index}>
                    <div className="activity-badge"></div>
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-description">
                      <span className="activity-user">{activity.user}</span> {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module Access Cards */}
          <div className="col-span-12">
            <h3 style={{ marginBottom: '1rem' }}>Quick Access</h3>
            <div className="dashboard-grid quick-access-grid">
              {[
                {
                  icon: faUserPlus,
                  title: 'Onboarding',
                  description: 'Add new employees to the system',
                  action: 'Get Started',
                  href: '#'
                },
                {
                  icon: faClipboardCheck,
                  title: 'Compliance',
                  description: 'Track licenses and certifications',
                  action: 'Manage',
                  href: '#'
                },
                {
                  icon: faClock,
                  title: 'Time Off',
                  description: 'Manage leave requests',
                  action: 'Review',
                  href: '#'
                },
                {
                  icon: faFileUpload,
                  title: 'Documents',
                  description: 'Upload and manage files',
                  action: 'Access',
                  href: '#'
                },
                {
                  icon: faChartLine,
                  title: 'Reports',
                  description: 'Generate HR analytics',
                  action: 'View',
                  href: '#'
                }
              ].map((module, index) => (
                <div className="card module-card" key={index}>
                  <div className="module-card-body">
                    <div className="module-icon">
                      <FontAwesomeIcon icon={module.icon} />
                    </div>
                    <h4 className="module-title">{module.title}</h4>
                    <p className="module-description">{module.description}</p>
                    <a href={module.href} className="action-link">{module.action}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Dashboard specific styles */
        .dashboard-container {
          width: 100%;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .page-title h1 {
          font-size: 1.75rem;
          font-weight: 700;
        }
        
        .page-subtitle {
          color: var(--gray-600);
          margin-top: 0.25rem;
        }
        
        .header-actions {
          display: flex;
          gap: 1rem;
        }
        
        .search-box {
          position: relative;
        }
        
        .search-box input {
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          width: 250px;
          font-size: 0.875rem;
          color: var(--gray-800);
          outline: none;
          transition: all 0.2s ease;
        }
        
        .search-box input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.1);
        }
        
        .search-box :global(svg) {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }
        
        .notification-badge {
          position: relative;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border-radius: 50%;
          color: var(--gray-700);
          cursor: pointer;
          border: 1px solid var(--gray-300);
          transition: all 0.2s ease;
        }
        
        .notification-badge:hover {
          background-color: var(--gray-100);
        }
        
        .notification-badge .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: var(--danger);
          color: white;
          font-size: 0.75rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          border-radius: var(--radius);
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
        }
        
        .btn-primary {
          background-color: var(--primary);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--primary-dark);
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }
        
        .quick-access-grid {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .col-span-3 {
          grid-column: span 3;
        }
        
        .col-span-4 {
          grid-column: span 4;
        }
        
        .col-span-6 {
          grid-column: span 6;
        }
        
        .col-span-8 {
          grid-column: span 8;
        }
        
        .col-span-12 {
          grid-column: span 12;
        }
        
        .card {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          overflow: hidden;
        }
        
        .card-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .card-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-900);
        }
        
        .card-body {
          padding: 1.5rem;
        }
        
        .stat-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .stat-card .card-body {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          padding: 1.25rem;
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }
        
        .stat-label :global(svg) {
          margin-right: 0.5rem;
          font-size: 1rem;
          color: var(--primary);
        }
        
        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 0.5rem;
        }
        
        .stat-description {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-top: auto;
        }
        
        .stat-trend {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          margin-right: 0.5rem;
        }
        
        .trend-up {
          background-color: rgba(76, 175, 80, 0.1);
          color: var(--success);
        }
        
        .trend-down {
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--danger);
        }
        
        .license-item {
          display: flex;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid var(--gray-200);
        }
        
        .license-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .license-item-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 1rem;
          background-color: var(--gray-300);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          color: var(--gray-700);
        }
        
        .license-item-info {
          flex-grow: 1;
        }
        
        .license-item-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        
        .license-item-detail {
          font-size: 0.875rem;
          color: var(--gray-600);
        }
        
        .license-status {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .status-warning {
          background-color: rgba(255, 152, 0, 0.1);
          color: var(--warning);
        }
        
        .status-danger {
          background-color: rgba(244, 67, 54, 0.1);
          color: var(--danger);
        }
        
        .activity-item {
          position: relative;
          padding-left: 2rem;
          padding-bottom: 1.5rem;
        }
        
        .activity-item:last-child {
          padding-bottom: 0;
        }
        
        .activity-item::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--gray-200);
        }
        
        .activity-item:last-child::before {
          height: 10px;
        }
        
        .activity-badge {
          position: absolute;
          left: 0;
          top: 0;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background-color: var(--primary);
          border: 2px solid white;
        }
        
        .activity-time {
          font-size: 0.75rem;
          color: var(--gray-500);
          margin-bottom: 0.25rem;
        }
        
        .activity-description {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .activity-user {
          font-weight: 600;
        }
        
        .action-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        
        .action-link:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }
        
        .module-card {
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .module-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        
        .module-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .module-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgba(0, 121, 107, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .module-icon :global(svg) {
          font-size: 1.5rem;
          color: var(--primary);
        }
        
        .module-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .module-description {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-bottom: 1rem;
        }
        
        /* Responsive styles */
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        
          .col-span-3, .col-span-4 {
            grid-column: span 3;
          }
        
          .col-span-6, .col-span-8, .col-span-12 {
            grid-column: span 6;
          }
        }
        
        @media (max-width: 768px) {
          .col-span-3, .col-span-4, .col-span-6, .col-span-8, .col-span-12 {
            grid-column: span 6;
          }
        
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
        
          .header-actions {
            margin-top: 1rem;
            width: 100%;
            justify-content: space-between;
          }
        
          .search-box input {
            width: 100%;
          }
        }
        
        @media (max-width: 640px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        
          .col-span-3, .col-span-4, .col-span-6, .col-span-8, .col-span-12 {
            grid-column: span 1;
          }
        }
      `}</style>
    </Layout>
  );
}