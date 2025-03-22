import { DatabaseService } from './DatabaseService';
import { User } from '../types';
import jwt from 'jsonwebtoken';

// JWT secret key - in a real app, this would be in a secure environment variable
const JWT_SECRET = 'mcphr-local-jwt-secret';
const TOKEN_EXPIRY = '24h';

export interface AuthResult {
  token: string;
  user: User;
}

export class AuthService {
  private dbService: DatabaseService;
  
  constructor() {
    this.dbService = new DatabaseService();
  }
  
  /**
   * Authenticates a user by email and password
   */
  async login(email: string, password: string): Promise<AuthResult | null> {
    try {
      // Open database connection
      await this.dbService.openDatabase();
      
      // In a real app, passwords would be hashed
      const query = `
        SELECT id, email, first_name, last_name, role
        FROM users
        WHERE email = ? AND password = ?
        LIMIT 1
      `;
      
      const results = this.dbService.executeQuery(query, [email, password]);
      
      if (results.length > 0) {
        const user: User = {
          id: results[0].id,
          email: results[0].email,
          firstName: results[0].first_name,
          lastName: results[0].last_name,
          role: results[0].role,
        };
        
        // Generate JWT token
        const token = this.generateToken(user);
        
        return { token, user };
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Validates a JWT token and returns the associated user
   */
  async validateToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
      
      if (!decoded || !decoded.userId) {
        return null;
      }
      
      // Get user from database
      await this.dbService.openDatabase();
      const query = `
        SELECT id, email, first_name, last_name, role
        FROM users
        WHERE id = ?
        LIMIT 1
      `;
      
      const results = this.dbService.executeQuery(query, [decoded.userId]);
      
      if (results.length > 0) {
        return {
          id: results[0].id,
          email: results[0].email,
          firstName: results[0].first_name,
          lastName: results[0].last_name,
          role: results[0].role,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
  
  /**
   * Generates a JWT token for a user
   */
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }
}