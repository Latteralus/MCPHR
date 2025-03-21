import { DatabaseService } from './DatabaseService';

export class SeedService {
  private dbService: DatabaseService;
  
  constructor() {
    this.dbService = new DatabaseService();
  }
  
  /**
   * Seeds the database with initial test data
   */
  async seedDatabase(): Promise<void> {
    try {
      // Open database connection
      await this.dbService.openDatabase();
      
      // Check if data already exists
      const userCount = this.dbService.executeQuery('SELECT COUNT(*) as count FROM users')[0].count;
      
      if (userCount > 0) {
        console.log('Database already seeded, skipping...');
        return;
      }
      
      console.log('Seeding database with test data...');
      
      // Seed users
      await this.seedUsers();
      
      // Seed employees
      await this.seedEmployees();
      
      // Seed licenses
      await this.seedLicenses();
      
      // Seed attendance
      await this.seedAttendance();
      
      console.log('Database seeding completed successfully');
    } catch (error) {
      console.error('Database seeding failed:', error);
      throw error;
    }
  }
  
  /**
   * Seeds the users table with test data
   */
  private async seedUsers(): Promise<void> {
    const users = [
      {
        email: 'admin@mountaincarepr.com',
        password: 'admin123', // In a real app, this would be hashed
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin'
      },
      {
        email: 'manager@mountaincarepr.com',
        password: 'manager123', // In a real app, this would be hashed
        first_name: 'John',
        last_name: 'Manager',
        role: 'manager'
      },
      {
        email: 'user@mountaincarepr.com',
        password: 'user123', // In a real app, this would be hashed
        first_name: 'Jane',
        last_name: 'Employee',
        role: 'user'
      },
      {
        email: 'sarah@mountaincarepr.com',
        password: 'sarah123', // In a real app, this would be hashed
        first_name: 'Sarah',
        last_name: 'Smith',
        role: 'user'
      },
      {
        email: 'mike@mountaincarepr.com',
        password: 'mike123', // In a real app, this would be hashed
        first_name: 'Mike',
        last_name: 'Johnson',
        role: 'user'
      }
    ];
    
    for (const user of users) {
      const insertSql = `
        INSERT INTO users (email, password, first_name, last_name, role)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      this.dbService.executeInsert(insertSql, [
        user.email,
        user.password,
        user.first_name,
        user.last_name,
        user.role
      ]);
    }
  }
  
  /**
   * Seeds the employees table with test data
   */
  private async seedEmployees(): Promise<void> {
    // Get user IDs for reference
    const users = this.dbService.executeQuery('SELECT id, email FROM users');
    const userMap = new Map(users.map(user => [user.email, user.id]));
    
    // Sample employees
    const employees = [
      {
        user_id: userMap.get('manager@mountaincarepr.com'),
        employee_id: 'EMP001',
        department: 'Management',
        position: 'HR Manager',
        hire_date: '2022-01-15',
        manager_id: null,
        employment_status: 'active',
        emergency_contact_name: 'Emily Manager',
        emergency_contact_phone: '555-123-4567'
      },
      {
        user_id: userMap.get('user@mountaincarepr.com'),
        employee_id: 'EMP002',
        department: 'HR',
        position: 'HR Specialist',
        hire_date: '2022-03-10',
        manager_id: 1, // Will be manager (EMP001)
        employment_status: 'active',
        emergency_contact_name: 'John Employee',
        emergency_contact_phone: '555-234-5678'
      },
      {
        user_id: userMap.get('sarah@mountaincarepr.com'),
        employee_id: 'EMP003',
        department: 'Nursing',
        position: 'Registered Nurse',
        hire_date: '2022-05-20',
        manager_id: 1, // Will be manager (EMP001)
        employment_status: 'active',
        emergency_contact_name: 'Robert Smith',
        emergency_contact_phone: '555-345-6789'
      },
      {
        user_id: userMap.get('mike@mountaincarepr.com'),
        employee_id: 'EMP004',
        department: 'Facilities',
        position: 'Maintenance Supervisor',
        hire_date: '2023-01-10',
        manager_id: 1, // Will be manager (EMP001)
        employment_status: 'active',
        emergency_contact_name: 'Lisa Johnson',
        emergency_contact_phone: '555-456-7890'
      }
    ];
    
    for (const employee of employees) {
      const insertSql = `
        INSERT INTO employees (
          user_id, employee_id, department, position, hire_date, 
          manager_id, employment_status, emergency_contact_name, emergency_contact_phone
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.dbService.executeInsert(insertSql, [
        employee.user_id,
        employee.employee_id,
        employee.department,
        employee.position,
        employee.hire_date,
        employee.manager_id,
        employee.employment_status,
        employee.emergency_contact_name,
        employee.emergency_contact_phone
      ]);
    }
  }
  
  /**
   * Seeds the licenses table with test data
   */
  private async seedLicenses(): Promise<void> {
    // Get employee IDs for reference
    const employees = this.dbService.executeQuery('SELECT id, employee_id FROM employees');
    const employeeMap = new Map(employees.map(emp => [emp.employee_id, emp.id]));
    
    // Sample licenses
    const licenses = [
      {
        employee_id: employeeMap.get('EMP003'), // Sarah (Nurse)
        license_type: 'Registered Nurse',
        license_number: 'RN123456',
        issue_date: '2021-06-01',
        expiration_date: '2025-05-31',
        issuing_authority: 'State Nursing Board',
        status: 'active'
      },
      {
        employee_id: employeeMap.get('EMP003'), // Sarah (Nurse)
        license_type: 'Basic Life Support',
        license_number: 'BLS789012',
        issue_date: '2022-01-15',
        expiration_date: '2024-01-14',
        issuing_authority: 'American Heart Association',
        status: 'active'
      },
      {
        employee_id: employeeMap.get('EMP004'), // Mike (Maintenance)
        license_type: 'HVAC Certification',
        license_number: 'HVAC34567',
        issue_date: '2022-03-10',
        expiration_date: '2024-03-09',
        issuing_authority: 'State Professional Board',
        status: 'active'
      }
    ];
    
    for (const license of licenses) {
      const insertSql = `
        INSERT INTO licenses (
          employee_id, license_type, license_number, issue_date, 
          expiration_date, issuing_authority, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      this.dbService.executeInsert(insertSql, [
        license.employee_id,
        license.license_type,
        license.license_number,
        license.issue_date,
        license.expiration_date,
        license.issuing_authority,
        license.status
      ]);
    }
  }
  
  /**
   * Seeds the attendance table with test data
   */
  private async seedAttendance(): Promise<void> {
    // Get employee IDs for reference
    const employees = this.dbService.executeQuery('SELECT id, employee_id FROM employees');
    const employeeMap = new Map(employees.map(emp => [emp.employee_id, emp.id]));
    
    // Current date for generating recent attendance records
    const today = new Date();
    
    // Sample attendance records for the last 5 days
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (date.getDay() === 0 || date.getDay() === 6) {
        continue;
      }
      
      // Create attendance for each employee
      for (const [employeeId, empDbId] of employeeMap.entries()) {
        // Randomize slightly for realism
        const isPresent = Math.random() > 0.1; // 10% chance of absence
        const isLate = Math.random() > 0.8; // 20% chance of being late
        
        let status = 'present';
        let clockIn = null;
        let clockOut = null;
        let notes = null;
        
        if (!isPresent) {
          status = 'absent';
          notes = 'Personal leave';
        } else {
          // Set clock in time (8:00 AM + random minutes for variation)
          const inHour = isLate ? 9 : 8;
          const inMinutes = Math.floor(Math.random() * 30);
          const clockInDate = new Date(date);
          clockInDate.setHours(inHour, inMinutes, 0, 0);
          clockIn = clockInDate.toISOString();
          
          // Set clock out time (5:00 PM + random minutes for variation)
          const outMinutes = Math.floor(Math.random() * 30);
          const clockOutDate = new Date(date);
          clockOutDate.setHours(17, outMinutes, 0, 0);
          clockOut = clockOutDate.toISOString();
          
          if (isLate) {
            status = 'late';
            notes = 'Traffic delay';
          }
        }
        
        const insertSql = `
          INSERT INTO attendance (
            employee_id, date, clock_in, clock_out, status, notes
          )
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        this.dbService.executeInsert(insertSql, [
          empDbId,
          dateStr,
          clockIn,
          clockOut,
          status,
          notes
        ]);
      }
    }
  }
}