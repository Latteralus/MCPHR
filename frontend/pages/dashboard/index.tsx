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
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  // State for search functionality (can be expanded later)
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Layout>
      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <div className={styles.pageTitle}>
            <h1>Dashboard</h1>
            <div className={styles.pageSubtitle}>Welcome back, Faith! Here's what's happening today.</div>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.searchBox}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.notificationBadge}>
              <FontAwesomeIcon icon={faBell} />
              <span className={styles.badge}>3</span>
            </div>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              <FontAwesomeIcon icon={faPlus} /> New Employee
            </button>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Stats Row */}
          <div className={styles.colSpan3}>
            <div className={`${styles.card} ${styles.statCard}`}>
              <div className={styles.cardBody}>
                <div className={styles.statLabel}>
                  <FontAwesomeIcon icon={faUsers} /> Total Employees
                </div>
                <div className={styles.statValue}>198</div>
                <div className={styles.statDescription}>
                  <span className={`${styles.statTrend} ${styles.trendUp}`}>
                    <FontAwesomeIcon icon={faArrowUp} /> 3.2%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.colSpan3}>
            <div className={`${styles.card} ${styles.statCard}`}>
              <div className={styles.cardBody}>
                <div className={styles.statLabel}>
                  <FontAwesomeIcon icon={faCalendarCheck} /> Attendance Rate
                </div>
                <div className={styles.statValue}>96.5%</div>
                <div className={styles.statDescription}>
                  <span className={`${styles.statTrend} ${styles.trendUp}`}>
                    <FontAwesomeIcon icon={faArrowUp} /> 1.8%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.colSpan3}>
            <div className={`${styles.card} ${styles.statCard}`}>
              <div className={styles.cardBody}>
                <div className={styles.statLabel}>
                  <FontAwesomeIcon icon={faHourglassHalf} /> Leave Requests
                </div>
                <div className={styles.statValue}>12</div>
                <div className={styles.statDescription}>
                  <span className={`${styles.statTrend} ${styles.trendDown}`}>
                    <FontAwesomeIcon icon={faArrowDown} /> 2.5%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.colSpan3}>
            <div className={`${styles.card} ${styles.statCard}`}>
              <div className={styles.cardBody}>
                <div className={styles.statLabel}>
                  <FontAwesomeIcon icon={faClipboardList} /> Compliance Rate
                </div>
                <div className={styles.statValue}>98.2%</div>
                <div className={styles.statDescription}>
                  <span className={`${styles.statTrend} ${styles.trendUp}`}>
                    <FontAwesomeIcon icon={faArrowUp} /> 0.7%
                  </span>
                  from last month
                </div>
              </div>
            </div>
          </div>

          {/* License Expiry */}
          <div className={styles.colSpan4}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>License Operations</h3>
                <a href="#" className={styles.actionLink}>
                  View all <FontAwesomeIcon icon={faChevronRight} />
                </a>
              </div>
              <div className={styles.cardBody}>
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
                  <div className={styles.licenseItem} key={index}>
                    <div className={styles.licenseItemAvatar}>{license.initials}</div>
                    <div className={styles.licenseItemInfo}>
                      <div className={styles.licenseItemName}>{license.name}</div>
                      <div className={styles.licenseItemDetail}>{license.licenseType}</div>
                    </div>
                    <div className={`${styles.licenseStatus} ${styles[`status${license.status.charAt(0).toUpperCase() + license.status.slice(1)}`]}`}>
                      {license.days} days
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={styles.colSpan8}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Recent Activity</h3>
                <a href="#" className={styles.actionLink}>
                  View all <FontAwesomeIcon icon={faChevronRight} />
                </a>
              </div>
              <div className={styles.cardBody}>
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
                  <div className={styles.activityItem} key={index}>
                    <div className={styles.activityBadge}></div>
                    <div className={styles.activityTime}>{activity.time}</div>
                    <div className={styles.activityDescription}>
                      <span className={styles.activityUser}>{activity.user}</span> {activity.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module Access Cards */}
          <div className={styles.colSpan12}>
            <h3 style={{ marginBottom: '1rem' }}>Quick Access</h3>
            <div className={`${styles.dashboardGrid} ${styles.quickAccessGrid}`}>
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
                <div className={`${styles.card} ${styles.moduleCard}`} key={index}>
                  <div className={styles.moduleCardBody}>
                    <div className={styles.moduleIcon}>
                      <FontAwesomeIcon icon={module.icon} />
                    </div>
                    <h4 className={styles.moduleTitle}>{module.title}</h4>
                    <p className={styles.moduleDescription}>{module.description}</p>
                    <a href={module.href} className={styles.actionLink}>{module.action}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )};