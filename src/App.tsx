import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './styles/global.css';

// Import pages (to be created later)
// Placeholder imports for now
const Login = () => <div>Login Page</div>;
const Dashboard = () => <div>Dashboard</div>;
const Employees = () => <div>Employees Page</div>;
const EmployeeDetail = () => <div>Employee Detail Page</div>;
const Licenses = () => <div>Licenses Page</div>;
const LicenseDetail = () => <div>License Detail Page</div>;
const NotFound = () => <div>404 Page Not Found</div>;

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { authState } = useAuth();
  
  if (authState.loading) {
    return <div>Loading...</div>;
  }
  
  return authState.isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/employees" element={<ProtectedRoute element={<Employees />} />} />
      <Route path="/employees/:id" element={<ProtectedRoute element={<EmployeeDetail />} />} />
      <Route path="/licenses" element={<ProtectedRoute element={<Licenses />} />} />
      <Route path="/licenses/:id" element={<ProtectedRoute element={<LicenseDetail />} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </DatabaseProvider>
  );
};

export default App;