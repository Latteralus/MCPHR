// client/src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import './styles/global.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  const [isElectron, setIsElectron] = useState(false);
  
  useEffect(() => {
    // Check if running in Electron
    const userAgent = navigator.userAgent.toLowerCase();
    setIsElectron(userAgent.indexOf('electron') !== -1);
    
    // Set up event listeners for Electron environment
    if (window.electronAPI) {
      // Example: Listen for sync status updates
      const cleanup = window.electronAPI.onSyncUpdate((status) => {
        console.log('Sync status update:', status);
        // Could update a global state or display notifications
      });
      
      return cleanup;
    }
  }, []);
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Placeholder routes for future implementation */}
        <Route 
          path="/employees" 
          element={
            <ProtectedRoute>
              <div>Employees Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute>
              <div>Attendance Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/leave" 
          element={
            <ProtectedRoute>
              <div>Leave Management Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute>
              <div>Onboarding Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/offboarding" 
          element={
            <ProtectedRoute>
              <div>Offboarding Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/compliance" 
          element={
            <ProtectedRoute>
              <div>Compliance Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <div>Documents Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <div>Settings Page - To be implemented</div>
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect to dashboard if logged in, otherwise to login */}
        <Route 
          path="*" 
          element={
            localStorage.getItem('token') || sessionStorage.getItem('token') 
              ? <Navigate to="/dashboard" /> 
              : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;