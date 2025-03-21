// client/src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    const userAgent = navigator.userAgent.toLowerCase();
    setIsElectron(userAgent.indexOf('electron') !== -1);

    // Load user from storage on initial render
    const loadUserFromStorage = () => {
      const storageMethod = localStorage.getItem('token') ? localStorage : sessionStorage;
      const savedToken = storageMethod.getItem('token');
      const savedUser = storageMethod.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      }

      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  // Login function
  const login = async (email, password, rememberMe) => {
    setLoading(true);
    
    try {
      let response;
      
      if (window.electronAPI) {
        // Electron environment - use IPC
        response = await window.electronAPI.login({ email, password, rememberMe });
      } else {
        // Web environment - use fetch API
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, rememberMe })
        });
        response = await res.json();
      }
      
      if (response.success) {
        // Store user data
        const storageMethod = rememberMe ? localStorage : sessionStorage;
        storageMethod.setItem('token', response.token);
        storageMethod.setItem('user', JSON.stringify(response.user));
        
        // Update state
        setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { 
          success: false, 
          message: response.message || 'Login failed. Please check your credentials.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return { 
        success: false, 
        message: 'An error occurred during login. Please try again.' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    
    try {
      if (window.electronAPI) {
        // Electron environment - use IPC
        await window.electronAPI.logout();
      } else {
        // Web environment - use fetch API
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear storage regardless of API call result
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Reset state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    setLoading(false);
  };

  // Check if token is valid
  const checkAuth = async () => {
    if (!token) return false;
    
    try {
      let response;
      
      if (window.electronAPI) {
        // Electron environment - use IPC
        response = await window.electronAPI.verifyToken(token);
      } else {
        // Web environment - use fetch API
        const res = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        response = await res.json();
      }
      
      return response.valid;
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    }
  };

  // Context value
  const value = {
    user,
    token,
    isAuthenticated,
    isElectron,
    loading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;