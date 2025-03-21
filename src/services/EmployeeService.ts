import DatabaseService from './DatabaseService';
import UserService from './UserService';
import { Employee, EmploymentStatus } from '../types';

class EmployeeService {
  private db: DatabaseService;
  private userService: UserService;

  constructor() {
    // Using the singleton method for backward compatibility.
    this.db = DatabaseService.getInstance();
    this.userService = new UserService();
  }

  /**
   * Type guard to check if a value is a Date.
   */
  private isDate(d: unknown): d is Date {
    return d instanceof Date;
  }

  /**
   * Get all employees with optional filters
   * @param options Filter options
   * @returns Array of employees
   */
  public async getAllEmployees(options: {
    includeUser?: boolean;
    department?: string;
    status?: EmploymentStatus;
  } = {}): Promise<Employee[]> {
    try {
      let query = `
        SELECT 
          id, 
          user_id as userId, 
          employee_id as employeeId, 
          department, 
          position, 
          hire_date as hireDate, 
          manager_id as managerId, 
          employment_status as employmentStatus, 
          emergency_contact_name as emergencyContactName, 
          emergency_contact_phone as emergencyContactPhone, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM employees
      `;

      const params: any[] = [];
      const conditions: string[] = [];

      if (options.department) {
        conditions.push('department = ?');
        params.push(options.department);
      }

      if (options.status) {
        conditions.push('employment_status = ?');
        params.push(options.status);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY employee_id';

      const rows = this.db.executeQuery(query, params);
      const employees = rows.map((row: any) => this.mapEmployeeFromRow(row));

      // Include user data if requested
      if (options.includeUser) {
        for (const employee of employees) {
          if (employee.userId) {
            (employee as any).user = await this.userService.getUserById(employee.userId);
          }
        }
      }

      return employees;
    } catch (error) {
      console.error('Error getting all employees:', error);
      throw error;
    }
  }

  /**
   * Get an employee by ID
   * @param id Employee ID
   * @param includeUser Whether to include user data
   * @returns Employee object or null if not found
   */
  public async getEmployeeById(id: number, includeUser: boolean = false): Promise<Employee | null> {
    try {
      const rows = this.db.executeQuery(`
        SELECT 
          id, 
          user_id as userId, 
          employee_id as employeeId, 
          department, 
          position, 
          hire_date as hireDate, 
          manager_id as managerId, 
          employment_status as employmentStatus, 
          emergency_contact_name as emergencyContactName, 
          emergency_contact_phone as emergencyContactPhone, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM employees
        WHERE id = ?
      `, [id]);

      if (rows.length === 0) {
        return null;
      }

      const employee = this.mapEmployeeFromRow(rows[0]);

      // Include user data if requested
      if (includeUser && employee.userId) {
        (employee as any).user = await this.userService.getUserById(employee.userId);
      }

      return employee;
    } catch (error) {
      console.error(`Error getting employee by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get an employee by user ID
   * @param userId User ID
   * @param includeUser Whether to include user data
   * @returns Employee object or null if not found
   */
  public async getEmployeeByUserId(userId: number, includeUser: boolean = false): Promise<Employee | null> {
    try {
      const rows = this.db.executeQuery(`
        SELECT 
          id, 
          user_id as userId, 
          employee_id as employeeId, 
          department, 
          position, 
          hire_date as hireDate, 
          manager_id as managerId, 
          employment_status as employmentStatus, 
          emergency_contact_name as emergencyContactName, 
          emergency_contact_phone as emergencyContactPhone, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM employees
        WHERE user_id = ?
      `, [userId]);

      if (rows.length === 0) {
        return null;
      }

      const employee = this.mapEmployeeFromRow(rows[0]);

      // Include user data if requested
      if (includeUser && employee.userId) {
        (employee as any).user = await this.userService.getUserById(employee.userId);
      }

      return employee;
    } catch (error) {
      console.error(`Error getting employee by user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get an employee by employee ID (not database ID)
   * @param employeeId Employee ID string
   * @param includeUser Whether to include user data
   * @returns Employee object or null if not found
   */
  public async getEmployeeByEmployeeId(employeeId: string, includeUser: boolean = false): Promise<Employee | null> {
    try {
      const rows = this.db.executeQuery(`
        SELECT 
          id, 
          user_id as userId, 
          employee_id as employeeId, 
          department, 
          position, 
          hire_date as hireDate, 
          manager_id as managerId, 
          employment_status as employmentStatus, 
          emergency_contact_name as emergencyContactName, 
          emergency_contact_phone as emergencyContactPhone, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM employees
        WHERE employee_id = ?
      `, [employeeId]);

      if (rows.length === 0) {
        return null;
      }

      const employee = this.mapEmployeeFromRow(rows[0]);

      // Include user data if requested
      if (includeUser && employee.userId) {
        (employee as any).user = await this.userService.getUserById(employee.userId);
      }

      return employee;
    } catch (error) {
      console.error(`Error getting employee by employee ID ${employeeId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new employee
   * @param employee Employee data
   * @returns Created employee with ID
   */
  public async createEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee> {
    try {
      const now = new Date().toISOString();
      // Use the type guard to determine if hireDate is a Date.
      const hireDate = this.isDate(employee.hireDate)
        ? employee.hireDate.toISOString().split('T')[0]
        : employee.hireDate;
      
      const id = this.db.executeInsert(`
        INSERT INTO employees (
          user_id, 
          employee_id, 
          department, 
          position, 
          hire_date, 
          manager_id, 
          employment_status, 
          emergency_contact_name, 
          emergency_contact_phone, 
          created_at, 
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        employee.userId,
        employee.employeeId,
        employee.department,
        employee.position,
        hireDate,
        employee.managerId || null,
        employee.employmentStatus,
        employee.emergencyContactName || null,
        employee.emergencyContactPhone || null,
        now,
        now
      ]);

      return {
        ...employee,
        id,
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  /**
   * Update an existing employee
   * @param id Employee ID
   * @param employee Employee data to update
   * @returns Updated employee
   */
  public async updateEmployee(id: number, employee: Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Employee> {
    try {
      // Get the current employee to merge with updates
      const currentEmployee = await this.getEmployeeById(id);
      if (!currentEmployee) {
        throw new Error(`Employee with ID ${id} not found`);
      }

      // Build the SQL SET clause dynamically
      const updates: string[] = [];
      const values: any[] = [];

      if (employee.userId !== undefined) {
        updates.push('user_id = ?');
        values.push(employee.userId);
      }
      
      if (employee.employeeId !== undefined) {
        updates.push('employee_id = ?');
        values.push(employee.employeeId);
      }
      
      if (employee.department !== undefined) {
        updates.push('department = ?');
        values.push(employee.department);
      }
      
      if (employee.position !== undefined) {
        updates.push('position = ?');
        values.push(employee.position);
      }
      
      if (employee.hireDate !== undefined) {
        updates.push('hire_date = ?');
        const hireDate = this.isDate(employee.hireDate)
          ? employee.hireDate.toISOString().split('T')[0]
          : employee.hireDate;
        values.push(hireDate);
      }
      
      if (employee.managerId !== undefined) {
        updates.push('manager_id = ?');
        values.push(employee.managerId || null);
      }
      
      if (employee.employmentStatus !== undefined) {
        updates.push('employment_status = ?');
        values.push(employee.employmentStatus);
      }
      
      if (employee.emergencyContactName !== undefined) {
        updates.push('emergency_contact_name = ?');
        values.push(employee.emergencyContactName || null);
      }
      
      if (employee.emergencyContactPhone !== undefined) {
        updates.push('emergency_contact_phone = ?');
        values.push(employee.emergencyContactPhone || null);
      }

      // Only update if there are changes
      if (updates.length > 0) {
        const now = new Date().toISOString();
        updates.push('updated_at = ?');
        values.push(now);
        
        // Add the ID as the last parameter
        values.push(id);

        // Execute the update
        this.db.executeUpdate(`
          UPDATE employees
          SET ${updates.join(', ')}
          WHERE id = ?
        `, values);

        // Return the updated employee
        return {
          ...currentEmployee,
          ...employee,
          updatedAt: now
        };
      }

      return currentEmployee;
    } catch (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete an employee
   * @param id Employee ID
   * @returns True if deleted, false if not found
   */
  public async deleteEmployee(id: number): Promise<boolean> {
    try {
      const result = this.db.executeUpdate('DELETE FROM employees WHERE id = ?', [id]);
      return result > 0;
    } catch (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all direct reports for a manager
   * @param managerId Manager's employee ID
   * @param includeUser Whether to include user data
   * @returns Array of employees reporting to the manager
   */
  public async getDirectReports(managerId: number, includeUser: boolean = false): Promise<Employee[]> {
    try {
      const rows = this.db.executeQuery(`
        SELECT 
          id, 
          user_id as userId, 
          employee_id as employeeId, 
          department, 
          position, 
          hire_date as hireDate, 
          manager_id as managerId, 
          employment_status as employmentStatus, 
          emergency_contact_name as emergencyContactName, 
          emergency_contact_phone as emergencyContactPhone, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM employees
        WHERE manager_id = ?
        ORDER BY employee_id
      `, [managerId]);

      const employees = rows.map((row: any) => this.mapEmployeeFromRow(row));

      // Include user data if requested
      if (includeUser) {
        for (const employee of employees) {
          if (employee.userId) {
            (employee as any).user = await this.userService.getUserById(employee.userId);
          }
        }
      }

      return employees;
    } catch (error) {
      console.error(`Error getting direct reports for manager ID ${managerId}:`, error);
      throw error;
    }
  }

  /**
   * Map a database row to an Employee object
   * @param row Database row
   * @returns Employee object
   */
  private mapEmployeeFromRow(row: any): Employee {
    return {
      id: row.id,
      userId: row.userId,
      employeeId: row.employeeId,
      department: row.department,
      position: row.position,
      hireDate: new Date(row.hireDate).toISOString(),
      managerId: row.managerId,
      employmentStatus: row.employmentStatus as EmploymentStatus,
      emergencyContactName: row.emergencyContactName,
      emergencyContactPhone: row.emergencyContactPhone,
      createdAt: new Date(row.createdAt).toISOString(),
      updatedAt: new Date(row.updatedAt).toISOString()
    };
  }
}

export default EmployeeService;
