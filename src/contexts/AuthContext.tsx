import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '../services/AuthService';
import { User, Employee, AuthState, LoginCredentials, ApiResponse } from '../types';

interface AuthContextProps {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<any>>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ApiResponse<any>>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<ApiResponse<null>>;
}

const defaultAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  employee: null,
  token: null,
  loading: true,
  error: null
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(defaultAuthState);
  const authService = new AuthService();

  // On mount, check if there's a token in localStorage and try to authenticate with it
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('mcphr_token');
      if (token) {
        try {
          const response = await authService.verifyToken(token);
          if (response.success && response.data) {
            setAuthState({
              isAuthenticated: true,
              user: response.data.user,
              employee: response.data.employee,
              token,
              loading: false,
              error: null
            });
          } else {
            // Token invalid or expired
            localStorage.removeItem('mcphr_token');
            setAuthState({
              ...defaultAuthState,
              loading: false,
              error: response.error || 'Session expired, please login again'
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('mcphr_token');
          setAuthState({
            ...defaultAuthState,
            loading: false,
            error: 'Authentication error'
          });
        }
      } else {
        setAuthState({
          ...defaultAuthState,
          loading: false
        });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        // Store token in localStorage if rememberMe is true
        if (credentials.rememberMe) {
          localStorage.setItem('mcphr_token', response.data.token);
        } else {
          // For session-only storage, we could use sessionStorage instead
          // But for simplicity, we'll still use localStorage
          localStorage.setItem('mcphr_token', response.data.token);
        }
        
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          employee: response.data.employee,
          token: response.data.token,
          loading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Login failed'
        }));
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const logout = (): void => {
    localStorage.removeItem('mcphr_token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      employee: null,
      token: null,
      loading: false,
      error: null
    });
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<any>> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authService.register(userData);
      
      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('mcphr_token', response.data.token);
        
        setAuthState({
          isAuthenticated: true,
          user: response.data.user,
          employee: null, // New users don't have an employee record yet
          token: response.data.token,
          loading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Registration failed'
        }));
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
    if (!authState.user) {
      return {
        success: false,
        error: 'Not authenticated'
      };
    }
    
    try {
      const response = await authService.changePassword(
        authState.user.id,
        currentPassword,
        newPassword
      );
      
      if (!response.success) {
        setAuthState(prev => ({
          ...prev,
          error: response.error || 'Password change failed'
        }));
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password change failed';
      setAuthState(prev => ({
        ...prev,
        error: errorMessage
      }));
      
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const contextValue: AuthContextProps = {
    authState,
    login,
    logout,
    register,
    changePassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};