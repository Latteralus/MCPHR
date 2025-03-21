import DatabaseService from './DatabaseService';
import EmployeeService from './EmployeeService';
import { License, LicenseStatus } from '../types';

/**
 * Converts a value (string or Date) into an ISO date string (YYYY-MM-DD).
 * If the value is a Date, it is formatted accordingly; otherwise, the value is cast to a string.
 */
function formatDate(date: unknown): string {
  return date instanceof Date ? date.toISOString().split('T')[0] : String(date);
}

class LicenseService {
  private db: DatabaseService;
  private employeeService: EmployeeService;

  constructor() {
    this.db = new DatabaseService();
    this.employeeService = new EmployeeService();
  }

  /**
   * Get all licenses with optional filters
   */
  public async getAllLicenses(options: {
    includeEmployee?: boolean;
    employeeId?: number;
    licenseType?: string;
    status?: LicenseStatus;
    expiringWithinDays?: number;
  } = {}): Promise<License[]> {
    try {
      await this.db.openDatabase();

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

      if (options.employeeId !== undefined) {
        conditions.push('employee_id = ?');
        params.push(options.employeeId);
      }

      if (options.licenseType !== undefined) {
        conditions.push('license_type = ?');
        params.push(options.licenseType);
      }

      if (options.status !== undefined) {
        conditions.push('status = ?');
        params.push(options.status);
      }

      if (options.expiringWithinDays !== undefined) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + options.expiringWithinDays);
        conditions.push('expiration_date <= ? AND expiration_date >= date("now")');
        params.push(futureDate.toISOString().split('T')[0]);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY expiration_date';

      const rows = await this.db.executeQuery(query, params);
      const licenses = rows.map((row: any) => this.mapLicenseFromRow(row));

      if (options.includeEmployee) {
        for (const license of licenses) {
          // Since License doesn’t include an "employee" property, we cast it to any here.
          (license as any).employee = await this.employeeService.getEmployeeById(license.employeeId, true);
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
   */
  public async getLicenseById(id: number, includeEmployee: boolean = false): Promise<License | null> {
    try {
      await this.db.openDatabase();

      const rows = await this.db.executeQuery(`
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

      if (includeEmployee) {
        (license as any).employee = await this.employeeService.getEmployeeById(license.employeeId, true);
      }

      return license;
    } catch (error) {
      console.error(`Error getting license by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all licenses for an employee
   */
  public async getLicensesByEmployeeId(employeeId: number, includeEmployee: boolean = false): Promise<License[]> {
    return this.getAllLicenses({ employeeId, includeEmployee });
  }

  /**
   * Get all licenses expiring within a certain number of days
   */
  public async getLicensesExpiringWithinDays(days: number, includeEmployee: boolean = false): Promise<License[]> {
    return this.getAllLicenses({ expiringWithinDays: days, includeEmployee });
  }

  /**
   * Create a new license
   */
  public async createLicense(license: Omit<License, 'id' | 'createdAt' | 'updatedAt'>): Promise<License> {
    try {
      await this.db.openDatabase();

      const now = new Date().toISOString();
      const issueDate = formatDate(license.issueDate);
      const expirationDate = formatDate(license.expirationDate);

      const id = await this.db.executeInsert(`
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
        createdAt: now,
        updatedAt: now
      };
    } catch (error) {
      console.error('Error creating license:', error);
      throw error;
    }
  }

  /**
   * Update an existing license
   */
  public async updateLicense(id: number, license: Partial<Omit<License, 'id' | 'createdAt' | 'updatedAt'>>): Promise<License> {
    try {
      await this.db.openDatabase();

      const currentLicense = await this.getLicenseById(id);
      if (!currentLicense) {
        throw new Error(`License with ID ${id} not found`);
      }

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
        values.push(formatDate(license.issueDate));
      }

      if (license.expirationDate !== undefined) {
        updates.push('expiration_date = ?');
        values.push(formatDate(license.expirationDate));
      }

      if (license.issuingAuthority !== undefined) {
        updates.push('issuing_authority = ?');
        values.push(license.issuingAuthority);
      }

      if (license.status !== undefined) {
        updates.push('status = ?');
        values.push(license.status);
      }

      if (updates.length > 0) {
        const now = new Date().toISOString();
        updates.push('updated_at = ?');
        values.push(now);

        // Add the ID as the final parameter.
        values.push(id);

        await this.db.executeUpdate(`
          UPDATE licenses
          SET ${updates.join(', ')}
          WHERE id = ?
        `, values);

        return {
          ...currentLicense,
          ...license,
          updatedAt: now
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
   */
  public async deleteLicense(id: number): Promise<boolean> {
    try {
      await this.db.openDatabase();

      const result = await this.db.executeUpdate('DELETE FROM licenses WHERE id = ?', [id]);
      return result > 0;
    } catch (error) {
      console.error(`Error deleting license with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Map a database row to a License object
   */
  private mapLicenseFromRow(row: any): License {
    return {
      id: row.id,
      employeeId: row.employeeId,
      licenseType: row.licenseType,
      licenseNumber: row.licenseNumber,
      issueDate: row.issue_date,
      expirationDate: row.expiration_date,
      issuingAuthority: row.issuing_authority,
      status: row.status as LicenseStatus,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

export default LicenseService;
