// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Loading from '../components/common/Loading';
import StatCard from '../components/dashboard/StatCard';
import LicenseItem from '../components/dashboard/LicenseItem';
import ActivityItem from '../components/dashboard/ActivityItem';
import ModuleCard from '../components/dashboard/ModuleCard';
import '../styles/dashboard.css';

const Dashboard = () => {
 },
    leaveRequests: { value: 0, trend: 0 },
    complianceRate: { value: 0, trend: 0 }
  });
  const [licenses, setLicenses] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch dashboard data
    fetchDashboardData();
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      let response;
      
      if (window.electronAPI) {
        // Electron environment - use IPC
        response = await window.electronAPI.getDashboardData();
      } else {
        // Web environment - use fetch API
        const res = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
          }
        });
        response = await res.json();
      }
      
      if (response?.success) {
        setStats(response.stats);
        setLicenses(response.licenses);
        setActivities(response.activities);
      } else {
        console.error('Failed to fetch dashboard data:', response?.message);
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock data for development
  useEffect(() => {
    // This would be replaced by the actual API call
    setStats({
      employees: { value: 198, trend: 3.2 },
      attendance: { value: 96.5, trend: 1.8 },
      leaveRequests: { value: 12, trend: -2.5 },
      complianceRate: { value: 98.2, trend: 0.7 }
    });

    setLicenses([
      {
        id: 1,
        employeeName: 'James Kirk',
        initials: 'JK',
        licenseType: 'Pharmacist License',
        daysRemaining: 7,
        status: 'danger'
      },
      {
        id: 2,
        employeeName: 'Leonard McCoy',
        initials: 'LM',
        licenseType: 'Pharmacy Tech License',
        daysRemaining: 14,
        status: 'warning'
      },
      {
        id: 3,
        employeeName: 'Nyota Uhura',
        initials: 'NU',
        licenseType: 'Controlled Substance License',
        daysRemaining: 21,
        status: 'warning'
      },
      {
        id: 4,
        employeeName: 'William Manager',
        initials: 'WM',
        licenseType: '90 Day Review',
        daysRemaining: 23,
        status: 'warning'
      },
      {
        id: 5,
        employeeName: 'Washington State',
        initials: 'WS',
        licenseType: 'State License Renewal',
        daysRemaining: 25,
        status: 'warning'
      }
    ]);

    setActivities([
      {
        id: 1,
        time: 'Today, 10:30 AM',
        user: 'Sarah Johnson',
        description: 'approved time off request for Emily Chen'
      },
      {
        id: 2,
        time: 'Today, 9:45 AM',
        user: 'David Wilson',
        description: 'uploaded a new document to the compliance portal'
      },
      {
        id: 3,
        time: 'Today, 8:15 AM',
        user: 'Lisa Patel',
        description: 'completed onboarding for Mark Thompson'
      },
      {
        id: 4,
        time: 'Yesterday, 4:30 PM',
        user: 'James Rodriguez',
        description: 'updated the employee handbook'
      },
      {
        id: 5,
        time: 'Yesterday, 2:15 PM',
        user: 'Maria Garcia',
        description: 'added 3 new training modules to the compliance system'
      }
    ]);
  }, []);

  const moduleCards = [
    {
      id: 'onboarding',
      title: 'Onboarding',
      description: 'Add new employees to the system',
      icon: 'user-plus',
      link: '/onboarding',
      actionText: 'Get Started'
    },
    {
      id: 'compliance',
      title: 'Compliance',
      description: 'Track licenses and certifications',
      icon: 'clipboard-check',
      link: '/compliance',
      actionText: 'Manage'
    },
    {
      id: 'timeoff',
      title: 'Time Off',
      description: 'Manage leave requests',
      icon: 'clock',
      link: '/time-off',
      actionText: 'Review'
    },
    {
      id: 'documents',
      title: 'Documents',
      description: 'Upload and manage files',
      icon: 'file-upload',
      link: '/documents',
      actionText: 'Access'
    },
    {
      id: 'reports',
      title: 'Reports',
      description: 'Generate HR analytics',
      icon: 'chart-line',
      link: '/reports',
      actionText: 'View'
    }
  ];

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="container">
      <Sidebar activeItem="dashboard" user={user} onLogout={handleLogout} />
      
      <main className="main-content">
        <div className="header">
          <div className="page-title">
            <h1>Dashboard</h1>
            <div className="page-subtitle">
              Welcome back, {user?.first_name || 'User'}! Here's what's happening today.
            </div>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="notification-badge">
              <i className="fas fa-bell"></i>
              <span className="badge">3</span>
            </div>
            <Link to="/employees/new" className="btn btn-primary">
              <i className="fas fa-plus"></i> New Employee
            </Link>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Stats Row */}
          <div className="col-span-3">
            <StatCard 
              label="Total Employees"
              icon="users"
              value={stats.employees.value}
              trend={stats.employees.trend}
              description="from last month"
            />
          </div>
          <div className="col-span-3">
            <StatCard 
              label="Attendance Rate"
              icon="calendar-check"
              value={`${stats.attendance.value}%`}
              trend={stats.attendance.trend}
              description="from last month"
            />
          </div>
          <div className="col-span-3">
            <StatCard 
              label="Leave Requests"
              icon="hourglass-half"
              value={stats.leaveRequests.value}
              trend={stats.leaveRequests.trend}
              description="from last month"
            />
          </div>
          <div className="col-span-3">
            <StatCard 
              label="Compliance Rate"
              icon="clipboard-list"
              value={`${stats.complianceRate.value}%`}
              trend={stats.complianceRate.trend}
              description="from last month"
            />
          </div>

          {/* License Expiry */}
          <div className="col-span-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">License Operations</h3>
                <Link to="/licenses" className="action-link">
                  View all <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <div className="card-body">
                {licenses.map(license => (
                  <LicenseItem 
                    key={license.id}
                    employeeName={license.employeeName}
                    initials={license.initials}
                    licenseType={license.licenseType}
                    daysRemaining={license.daysRemaining}
                    status={license.status}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-8">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Activity</h3>
                <Link to="/activity" className="action-link">
                  View all <i className="fas fa-chevron-right"></i>
                </Link>
              </div>
              <div className="card-body">
                {activities.map(activity => (
                  <ActivityItem 
                    key={activity.id}
                    time={activity.time}
                    user={activity.user}
                    description={activity.description}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Module Access Cards */}
          <div className="col-span-12">
            <h3 style={{ marginBottom: '1rem' }}>Quick Access</h3>
            <div className="modules-grid">
              {moduleCards.map(module => (
                <ModuleCard 
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  link={module.link}
                  actionText={module.actionText}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;