import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/Layout/MainLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DatabaseService } from '../../services/DatabaseService';
import { Employee } from '../../types';
import './Employees.css';

interface EmployeeWithDetails extends Employee {
  fullName: string;
  managerName?: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  
  const dbService = new DatabaseService();
  
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        await dbService.openDatabase();
        
        // Join the employees table with users table to get names
        const query = `
          SELECT 
            e.id, e.user_id, e.employee_id, e.department, e.position, 
            e.hire_date, e.manager_id, e.employment_status, 
            e.emergency_contact_name, e.emergency_contact_phone,
            e.created_at, e.updated_at,
            u.first_name, u.last_name
          FROM employees e
          LEFT JOIN users u ON e.user_id = u.id
          ORDER BY e.id ASC
        `;
        
        const employeeData = dbService.executeQuery(query);
        
        // Create a map of manager IDs to names for lookup
        const managerQuery = `
          SELECT 
            e.id as manager_id,
            u.first_name, u.last_name
          FROM employees e
          JOIN users u ON e.user_id = u.id
          WHERE e.id IN (
            SELECT DISTINCT manager_id FROM employees WHERE manager_id IS NOT NULL
          )
        `;
        
        const managerData = dbService.executeQuery(managerQuery);
        const managerMap = new Map();
        
        managerData.forEach((manager) => {
          managerMap.set(
            manager.manager_id, 
            `${manager.first_name} ${manager.last_name}`
          );
        });
        
        // Transform the employee data
        const employeeList: EmployeeWithDetails[] = employeeData.map((emp) => ({
          id: emp.id,
          userId: emp.user_id,
          employeeId: emp.employee_id,
          department: emp.department,
          position: emp.position,
          hireDate: emp.hire_date,
          managerId: emp.manager_id,
          employmentStatus: emp.employment_status,
          emergencyContactName: emp.emergency_contact_name,
          emergencyContactPhone: emp.emergency_contact_phone,
          createdAt: emp.created_at,
          updatedAt: emp.updated_at,
          fullName: `${emp.first_name} ${emp.last_name}`,
          managerName: emp.manager_id ? managerMap.get(emp.manager_id) : undefined
        }));
        
        setEmployees(employeeList);
        setFilteredEmployees(employeeList);
        
        // Extract unique departments for filter - using alternate approach to avoid TS2802 error
        const departmentsMap: {[key: string]: boolean} = {};
        employeeList.forEach(emp => departmentsMap[emp.department] = true);
        const uniqueDepartments = Object.keys(departmentsMap);
        
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  // Apply filters when search or filters change
  useEffect(() => {
    let filtered = [...employees];
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(emp => 
        emp.fullName.toLowerCase().includes(searchLower) ||
        emp.employeeId.toLowerCase().includes(searchLower) ||
        emp.department.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter(emp => emp.department === departmentFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(emp => emp.employmentStatus === statusFilter);
    }
    
    setFilteredEmployees(filtered);
  }, [searchTerm, departmentFilter, statusFilter, employees]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDepartmentFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDepartmentFilter(e.target.value);
  };
  
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setStatusFilter('all');
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingSpinner message="Loading employees..." />
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
      <div className="employee-list-container">
        <div className="employee-list-header">
          <h1>Employees</h1>
          <button className="primary">
            <span className="button-icon">➕</span>
            Add Employee
          </button>
        </div>
        
        <div className="filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className="filter-selects">
            <div className="filter-group">
              <label htmlFor="department-filter">Department</label>
              <select 
                id="department-filter"
                value={departmentFilter}
                onChange={handleDepartmentFilter}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label htmlFor="status-filter">Status</label>
              <select 
                id="status-filter"
                value={statusFilter}
                onChange={handleStatusFilter}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="terminated">Terminated</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            
            <button 
              className="secondary clear-filter-button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        </div>
        
        <div className="employee-count">
          Showing {filteredEmployees.length} of {employees.length} employees
        </div>
        
        <div className="employee-table-container">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Manager</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-results">
                    No employees found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.employeeId}</td>
                    <td>{employee.fullName}</td>
                    <td>{employee.department}</td>
                    <td>{employee.position}</td>
                    <td>
                      <span className={`status-badge ${employee.employmentStatus}`}>
                        {formatStatus(employee.employmentStatus)}
                      </span>
                    </td>
                    <td>{employee.managerName || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/employees/${employee.id}`} 
                          className="action-button view"
                          title="View Employee"
                        >
                          👁️
                        </Link>
                        <Link 
                          to={`/employees/${employee.id}/edit`} 
                          className="action-button edit"
                          title="Edit Employee"
                        >
                          ✏️
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

// Helper function to format status
const formatStatus = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'on_leave':
      return 'On Leave';
    case 'terminated':
      return 'Terminated';
    case 'suspended':
      return 'Suspended';
    default:
      return status;
  }
};

export default EmployeeList;