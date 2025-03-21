import DatabaseService from './DatabaseService';
import { User, UserRole } from '../types';

class UserService {
  private db: DatabaseService;

  constructor() {
    this.db = DatabaseService.getInstance();
  }

  /**
   * Get all users
   * @returns Array of users
   */
  public async getAllUsers(): Promise<User[]> {
    try {
      const rows = this.db.query<any>(`
        SELECT 
          id, 
          email, 
          password, 
          first_name as firstName, 
          last_name as lastName, 
          role, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM users
        ORDER BY last_name, first_name
      `);

      return rows.map(row => this.mapUserFromRow(row));
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param id User ID
   * @returns User object or null if not found
   */
  public async getUserById(id: number): Promise<User | null> {
    try {
      const rows = this.db.query<any>(`
        SELECT 
          id, 
          email, 
          password, 
          first_name as firstName, 
          last_name as lastName, 
          role, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM users
        WHERE id = ?
      `, [id]);

      if (rows.length === 0) {
        return null;
      }

      return this.mapUserFromRow(rows[0]);
    } catch (error) {
      console.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a user by email
   * @param email User email
   * @returns User object or null if not found
   */
  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const rows = this.db.query<any>(`
        SELECT 
          id, 
          email, 
          password, 
          first_name as firstName, 
          last_name as lastName, 
          role, 
          created_at as createdAt, 
          updated_at as updatedAt
        FROM users
        WHERE email = ?
      `, [email]);

      if (rows.length === 0) {
        return null;
      }

      return this.mapUserFromRow(rows[0]);
    } catch (error) {
      console.error(`Error getting user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param user User data
   * @returns Created user with ID
   */
  public async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const now = new Date().toISOString();
      const id = this.db.insert(`
        INSERT INTO users (
          email, 
          password, 
          first_name, 
          last_name, 
          role, 
          created_at, 
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.role,
        now,
        now
      ]);

      return {
        ...user,
        id,
        createdAt: new Date(now),
        updatedAt: new Date(now)
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update an existing user
   * @param id User ID
   * @param user User data to update
   * @returns Updated user
   */
  public async updateUser(id: number, user: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    try {
      // Get the current user to merge with updates
      const currentUser = await this.getUserById(id);
      if (!currentUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      // Build the SQL SET clause dynamically
      const updates: string[] = [];
      const values: any[] = [];

      if (user.email !== undefined) {
        updates.push('email = ?');
        values.push(user.email);
      }
      
      if (user.password !== undefined) {
        updates.push('password = ?');
        values.push(user.password);
      }
      
      if (user.firstName !== undefined) {
        updates.push('first_name = ?');
        values.push(user.firstName);
      }
      
      if (user.lastName !== undefined) {
        updates.push('last_name = ?');
        values.push(user.lastName);
      }
      
      if (user.role !== undefined) {
        updates.push('role = ?');
        values.push(user.role);
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
          UPDATE users
          SET ${updates.join(', ')}
          WHERE id = ?
        `, values);

        // Return the updated user
        return {
          ...currentUser,
          ...user,
          updatedAt: new Date(now)
        };
      }

      return currentUser;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param id User ID
   * @returns True if deleted, false if not found
   */
  public async deleteUser(id: number): Promise<boolean> {
    try {
      const result = this.db.run('DELETE FROM users WHERE id = ?', [id]);
      return result > 0;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Map a database row to a User object
   * @param row Database row
   * @returns User object
   */
  private mapUserFromRow(row: any): User {
    return {
      id: row.id,
      email: row.email,
      password: row.password,
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role as UserRole,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }
}

export default UserService;