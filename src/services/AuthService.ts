import jwt from 'jsonwebtoken';
import UserService from './UserService';
import EmployeeService from './EmployeeService';
import { User, Employee, LoginCredentials, ApiResponse } from '../types';

// Secret key for JWT signing - in a real app, this would be in environment variables
const JWT_SECRET = 'mountain-care-hr-secret-key';
const TOKEN_EXPIRY = '8h';

class AuthService {
  private userService: UserService;
  private employeeService: EmployeeService;

  constructor() {
    this.userService = new UserService();
    this.employeeService = new EmployeeService();
  }

  /**
   * Login a user with email and password
   * @param credentials User credentials
   * @returns ApiResponse with token, user, and employee data if successful
   */
  public async login(credentials: LoginCredentials): Promise<ApiResponse<{
    token: string;
    user: User;
    employee: Employee | null;
  }>> {
    try {
      const { email, password } = credentials;
      
      // Find user by email
      const user = await this.userService.getUserByEmail(email);
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      // Check password (in a real app, we would use bcrypt or similar)
      if (user.password !== password) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }
      
      // Get associated employee data if it exists
      const employee = await this.employeeService.getEmployeeByUserId(user.id);
      
      // Generate JWT token
      const token = this.generateToken(user);
      
      return {
        success: true,
        data: {
          token,
          user,
          employee
        },
        message: 'Login successful'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during login'
      };
    }
  }

  /**
   * Verify a JWT token and get the associated user
   * @param token JWT token
   * @returns ApiResponse with user and employee data if valid
   */
  public async verifyToken(token: string): Promise<ApiResponse<{
    user: User;
    employee: Employee | null;
  }>> {
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      
      if (!decoded || !decoded.userId) {
        return {
          success: false,
          error: 'Invalid token'
        };
      }
      
      // Get user data
      const user = await this.userService.getUserById(decoded.userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      // Get associated employee data if it exists
      const employee = await this.employeeService.getEmployeeByUserId(user.id);
      
      return {
        success: true,
        data: {
          user,
          employee
        }
      };
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    }
  }

  /**
   * Register a new user
   * @param userData User data for registration
   * @returns ApiResponse with token, user data if successful
   */
  public async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<{
    token: string;
    user: User;
  }>> {
    try {
      // Check if email already exists
      const existingUser = await this.userService.getUserByEmail(userData.email);
      
      if (existingUser) {
        return {
          success: false,
          error: 'Email already in use'
        };
      }
      
      // Create new user
      const user = await this.userService.createUser(userData);
      
      // Generate JWT token
      const token = this.generateToken(user);
      
      return {
        success: true,
        data: {
          token,
          user
        },
        message: 'Registration successful'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred during registration'
      };
    }
  }

  /**
   * Change a user's password
   * @param userId User ID
   * @param currentPassword Current password for verification
   * @param newPassword New password
   * @returns ApiResponse indicating success or failure
   */
  public async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    try {
      // Get user
      const user = await this.userService.getUserById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      // Verify current password (in a real app, we would use bcrypt or similar)
      if (user.password !== currentPassword) {
        return {
          success: false,
          error: 'Current password is incorrect'
        };
      }
      
      // Update password
      await this.userService.updateUser(userId, { password: newPassword });
      
      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while changing password'
      };
    }
  }

  /**
   * Generate a JWT token for a user
   * @param user User object
   * @returns JWT token
   */
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }
}

export default AuthService;