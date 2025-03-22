import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import { AuthContext } from '../../contexts/AuthContext';
import { DatabaseService } from '../../services/DatabaseService';
import LoadingSpinner from '../../components/LoadingSpinner';
import './Dashboard.css';

interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  expiringLicenses: number;
  employeesByDepartment: Record<string, number>;
  recentAttendance: {
    present: number;
    absent: number;
    late: number;
  };
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useContext(AuthContext);
  const dbService = new DatabaseService();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await dbService.openDatabase();
        
        // Fetch total employees
        const totalEmployeesQuery = `SELECT COUNT(*) as count FROM employees`;
        const totalEmployeesResult = dbService.executeQuery(totalEmployeesQuery);
        const totalEmployees = totalEmployeesResult[0]?.count || 0;
        
        // Fetch active employees
        const activeEmployeesQuery = `SELECT COUNT(*) as count FROM employees WHERE employment_status = 'active'`;
        const activeEmployeesResult = dbService.executeQuery(activeEmployeesQuery);
        const activeEmployees = activeEmployeesResult[0]?.count || 0;
        
        // Fetch expiring licenses (within 30 days)
        const today = new Date();
        const thirtyDaysLater = new Date(today);
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
        
        const expiringLicensesQuery = `
          SELECT COUNT(*) as count FROM licenses 
          WHERE expiration_date BETWEEN date('now') AND date('now', '+30 days')
        `;
        const expiringLicensesResult = dbService.executeQuery(expiringLicensesQuery);
        const expiringLicenses = expiringLicensesResult[0]?.count || 0;
        
        // Fetch employees by department
        const departmentQuery = `
          SELECT department, COUNT(*) as count FROM employees 
          GROUP BY department
        `;
        const departmentResult = dbService.executeQuery(departmentQuery);
        const employeesByDepartment: Record<string, number> = {};
        
        departmentResult.forEach((row) => {
          employeesByDepartment[row.department] = row.count;
        });
        
        // Fetch recent attendance (today)
        const todayDate = today.toISOString().split('T')[0];
        const attendanceQuery = `
          SELECT status, COUNT(*) as count FROM attendance 
          WHERE date = '${todayDate}'
          GROUP BY status
        `;
        const attendanceResult = dbService.executeQuery(attendanceQuery);
        
        let presentCount = 0;
        let absentCount = 0;
        let lateCount = 0;
        
        attendanceResult.forEach((row) => {
          if (row.status === 'present') {
            presentCount = row.count;
          } else if (row.status === 'absent') {
            absentCount = row.count;
          } else if (row.status === 'late') {
            lateCount = row.count;
          }
        });
        
        setStats({
          totalEmployees,
          activeEmployees,
          expiringLicenses,
          employeesByDepartment,
          recentAttendance: {
            present: presentCount,
            absent: absentCount,
            late: lateCount
          }
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Loading dashboard data..." />
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <div className="error-message">{error}</div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Welcome section */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName}!</h1>
          <p>Here's what's happening today at Mountain Care.</p>
        </div>
        
        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{stats?.totalEmployees}</h3>
              <p>Total Employees</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats?.activeEmployees}</h3>
              <p>Active Employees</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3>{stats?.expiringLicenses}</h3>
              <p>Licenses Expiring Soon</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats?.recentAttendance.present}</h3>
              <p>Present Today</p>
            </div>
          </div>
        </div>
        
        {/* Dashboard widgets */}
        <div className="dashboard-widgets">
          {/* Department distribution */}
          <div className="widget">
            <h3>Department Distribution</h3>
            <div className="department-list">
              {stats && Object.entries(stats.employeesByDepartment).map(([dept, count]) => (
                <div key={dept} className="department-item">
                  <span className="department-name">{dept}</span>
                  <span className="department-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Attendance chart */}
          <div className="widget">
            <h3>Today's Attendance</h3>
            <div className="attendance-chart">
              <div className="attendance-metric">
                <div className="attendance-label">Present</div>
                <div className="attendance-bar">
                  <div 
                    className="attendance-bar-fill present"
                    style={{ 
                      width: `${calculatePercentage(
                        stats?.recentAttendance.present || 0, 
                        getTotalAttendance(stats?.recentAttendance)
                      )}%` 
                    }}
                  ></div>
                </div>
                <div className="attendance-value">{stats?.recentAttendance.present}</div>
              </div>
              
              <div className="attendance-metric">
                <div className="attendance-label">Late</div>
                <div className="attendance-bar">
                  <div 
                    className="attendance-bar-fill late"
                    style={{ 
                      width: `${calculatePercentage(
                        stats?.recentAttendance.late || 0, 
                        getTotalAttendance(stats?.recentAttendance)
                      )}%` 
                    }}
                  ></div>
                </div>
                <div className="attendance-value">{stats?.recentAttendance.late}</div>
              </div>
              
              <div className="attendance-metric">
                <div className="attendance-label">Absent</div>
                <div className="attendance-bar">
                  <div 
                    className="attendance-bar-fill absent"
                    style={{ 
                      width: `${calculatePercentage(
                        stats?.recentAttendance.absent || 0, 
                        getTotalAttendance(stats?.recentAttendance)
                      )}%` 
                    }}
                  ></div>
                </div>
                <div className="attendance-value">{stats?.recentAttendance.absent}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-button">
              <span className="action-icon">➕</span>
              <span>Add Employee</span>
            </button>
            <button className="action-button">
              <span className="action-icon">🔐</span>
              <span>Add License</span>
            </button>
            <button className="action-button">
              <span className="action-icon">📝</span>
              <span>Take Attendance</span>
            </button>
            <button className="action-button">
              <span className="action-icon">📄</span>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to calculate percentage
const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

// Helper function to get total attendance
const getTotalAttendance = (attendance: DashboardStats['recentAttendance'] | undefined): number => {
  if (!attendance) return 0;
  return attendance.present + attendance.absent + attendance.late;
};

export default Dashboard;