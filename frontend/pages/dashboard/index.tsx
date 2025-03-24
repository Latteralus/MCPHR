import { useState } from 'react';
import Layout from '../../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarCheck,
  faClipboardList,
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
import Head from 'next/head';

export default function Home() {
  // State for search functionality
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <Head>
        <title>Mountain Care HR - Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      
      <div className="dashboard-container">
        <div className="header">
          <div className="page-title">
            <h1>Dashboard</h1>
            <div className="page-subtitle">Welcome back, Faith! Here's what's happening today.</div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
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
            <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
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
    </Layout>
  );
}