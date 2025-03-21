import DatabaseService from './DatabaseService';
import EmployeeService from './EmployeeService';
import { License, LicenseStatus } from '../types';

class LicenseService {
  private db: DatabaseService;
  private employeeService: EmployeeService;

  constructor() {
    this.db = DatabaseService.getInstance();
    this.employeeService = new EmployeeService();
  }

  /**
   * Get all licenses with optional filters
   * @param options Filter options
   * @returns Array of licenses
   */
  public async getAllLicenses(options: {
    includeEmployee?: boolean;
    employeeId?: number;
    licenseType?: string;
    status?: LicenseStatus;
    expiringWithinDays?: number;
  } = {}): Promise<License[]> {
    try {
      let query = `
        SELECT 
          id, 
          employee_id as employeeId, 
          license_type as licenseType, 
          license_number as licenseNumber, 
          issue_date as issueDate, 
          expiration_date as expirationDate, 
          issuing_authority as issuingAuthority, 
          status, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM licenses
      `;

      const params: any[] = [];
      const conditions: string[] = [];

      if (options.employeeId) {
        conditions.push('employee_id = ?');
        params.push(options.employeeId);
      }

      if (options.licenseType) {
        conditions.push('license_type = ?');
        params.push(options.licenseType);
      }

      if (options.status) {
        conditions.push('status = ?');
        params.push(options.status);
      }

      if (options.expiringWithinDays) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + options.expiringWithinDays);
        conditions.push('expiration_date <= ? AND expiration_date >= date("now")');
        params.push(futureDate.toISOString().split('T')[0]);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY expiration_date';

      const rows = this.db.query<any>(query, params);
      const licenses = rows.map(row => this.mapLicenseFromRow(row));

      // Include employee data if requested
      if (options.includeEmployee) {
        for (const license of licenses) {
          license.employee = await this.employeeService.getEmployeeById(license.employeeId, true);
        }
      }

      return licenses;
    } catch (error) {
      console.error('Error getting all licenses:', error);
      throw error;
    }
  }

  /**
   * Get a license by ID
   * @param id License ID
   * @param includeEmployee Whether to include employee data
   * @returns License object or null if not found
   */
  public async getLicenseById(id: number, includeEmployee: boolean = false): Promise<License | null> {
    try {
      const rows = this.db.query<any>(`
        SELECT 
          id, 
          employee_id as employeeId, 
          license_type as licenseType, 
          license_number as licenseNumber, 
          issue_date as issueDate, 
          expiration_date as expirationDate, 
          issuing_authority as issuingAuthority, 
          status, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM licenses
        WHERE id = ?
      `, [id]);

      if (rows.length === 0) {
        return null;
      }

      const license = this.mapLicenseFromRow(rows[0]);

      // Include employee data if requested
      if (includeEmployee) {
        license.employee = await this.employeeService.getEmployeeById(license.employeeId, true);
      }

      return license;
    } catch (error) {
      console.error(`Error getting license by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all licenses for an employee
   * @param employeeId Employee ID
   * @param includeEmployee Whether to include employee data
   * @returns Array of licenses for the employee
   */
  public async getLicensesByEmployeeId(employeeId: number, includeEmployee: boolean = false): Promise<License[]> {
    return this.getAllLicenses({ employeeId, includeEmployee });
  }

  /**
   * Get all licenses expiring within a certain number of days
   * @param days Number of days to check
   * @param includeEmployee Whether to include employee data
   * @returns Array of licenses expiring within the specified days
   */
  public async getLicensesExpiringWithinDays(days: number, includeEmployee: boolean = false): Promise<License[]> {
    return this.getAllLicenses({ expiringWithinDays: days, includeEmployee });
  }

  /**
   * Create a new license
   * @param license License data
   * @returns Created license with ID
   */
  public async createLicense(license: Omit<License, 'id' | 'createdAt' | 'updatedAt'>): Promise<License> {
    try {
      const now = new Date().toISOString();
      // Format the dates as ISO strings
      const issueDate = license.issueDate instanceof Date
        ? license.issueDate.toISOString().split('T')[0]
        : license.issueDate.toString();
      
      const expirationDate = license.expirationDate instanceof Date
        ? license.expirationDate.toISOString().split('T')[0]
        : license.expirationDate.toString();

      const id = this.db.insert(`
        INSERT INTO licenses (
          employee_id, 
          license_type, 
          license_number, 
          issue_date, 
          expiration_date, 
          issuing_authority, 
          status, 
          created_at, 
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        license.employeeId,
        license.licenseType,
        license.licenseNumber,
        issueDate,
        expirationDate,
        license.issuingAuthority,
        license.status,
        now,
        now
      ]);

      return {
        ...license,
        id,
        createdAt: new Date(now),
        updatedAt: new Date(now)
      };
    } catch (error) {
      console.error('Error creating license:', error);
      throw error;
    }
  }

  /**
   * Update an existing license
   * @param id License ID
   * @param license License data to update
   * @returns Updated license
   */
  public async updateLicense(id: number, license: Partial<Omit<License, 'id' | 'createdAt' | 'updatedAt'>>): Promise<License> {
    try {
      // Get the current license to merge with updates
      const currentLicense = await this.getLicenseById(id);
      if (!currentLicense) {
        throw new Error(`License with ID ${id} not found`);
      }

      // Build the SQL SET clause dynamically
      const updates: string[] = [];
      const values: any[] = [];

      if (license.employeeId !== undefined) {
        updates.push('employee_id = ?');
        values.push(license.employeeId);
      }
      
      if (license.licenseType !== undefined) {
        updates.push('license_type = ?');
        values.push(license.licenseType);
      }
      
      if (license.licenseNumber !== undefined) {
        updates.push('license_number = ?');
        values.push(license.licenseNumber);
      }
      
      if (license.issueDate !== undefined) {
        updates.push('issue_date = ?');
        const issueDate = license.issueDate instanceof Date
          ? license.issueDate.toISOString().split('T')[0]
          : license.issueDate.toString();
        values.push(issueDate);
      }
      
      if (license.expirationDate !== undefined) {
        updates.push('expiration_date = ?');
        const expirationDate = license.expirationDate instanceof Date
          ? license.expirationDate.toISOString().split('T')[0]
          : license.expirationDate.toString();
        values.push(expirationDate);
      }
      
      if (license.issuingAuthority !== undefined) {
        updates.push('issuing_authority = ?');
        values.push(license.issuingAuthority);
      }
      
      if (license.status !== undefined) {
        updates.push('status = ?');
        values.push(license.status);
      }

      // Only update if there are changes
      if (updates.length > 0) {
        const now = new Date().toISOString();
        updates.push('updated_at = ?');
        values.push(now);
        
        // Add the ID as the last parameter
        values.push(id);

        // Execute the update
        this.db.run(`
          UPDATE licenses
          SET ${updates.join(', ')}
          WHERE id = ?
        `, values);

        // Return the updated license
        return {
          ...currentLicense,
          ...license,
          updatedAt: new Date(now)
        };
      }

      return currentLicense;
    } catch (error) {
      console.error(`Error updating license with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a license
   * @param id License ID
   * @returns True if deleted, false if not found
   */
  public async deleteLicense(id: number): Promise<boolean> {
    try {
      const result = this.db.run('DELETE FROM licenses WHERE id = ?', [id]);
      return result > 0;
    } catch (error) {
      console.error(`Error deleting license with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Map a database row to a License object
   * @param row Database row
   * @returns License object
   */
  private mapLicenseFromRow(row: any): License {
    return {
      id: row.id,
      employeeId: row.employeeId,
      licenseType: row.licenseType,
      licenseNumber: row.licenseNumber,
      issueDate: new Date(row.issueDate),
      expirationDate: new Date(row.expirationDate),
      issuingAuthority: row.issuingAuthority,
      status: row.status as LicenseStatus,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
}

export default LicenseService;