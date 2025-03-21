// client/src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated, isElectron } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const result = await login(email, password, rememberMe);
      
      if (!result.success) {
        setLoginError(result.message);
      }
      // If successful, the auth context will update and useEffect will redirect
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred during login. Please try again.');
    }
  };

  const handleSSOLogin = () => {
    console.log('Initiating SSO authentication flow');
    // Implement SSO logic here (OAuth or SAML)
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className="app-environment">
          <i className={`fas fa-${isElectron ? 'desktop' : 'globe'}`}></i>
          {isElectron ? ' Desktop App' : ' Web App'}
        </div>
        <div className="login-logo">
          <img src="/assets/logo.png" alt="Mountain Care Logo" />
          <span>Mountain Care</span>
        </div>
        <div className="login-sidebar-content">
          <h2>Welcome to<br />Mountain Care HR Portal</h2>
          <p>Log in to access your healthcare information</p>
        </div>
      </div>
      <div className="login-main">
        <h1>Sign In</h1>
        <p className="login-subtitle">Enter your credentials to access your account</p>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope"></i>
              <input 
                type="email" 
                id="email" 
                className="form-input input-with-icon" 
                placeholder="name@mountaincare.org" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock"></i>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="form-input input-with-icon" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={togglePasswordVisibility}
              >
                <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
              </button>
            </div>
          </div>
          
          <div className="form-footer">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          </div>
          
          {loginError && (
            <div className="alert alert-danger mb-3">{loginError}</div>
          )}
          
          <button type="submit" className="btn btn-primary">Sign In</button>
          
          <div className="login-divider">or continue with</div>
          
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={handleSSOLogin}
          >
            <i className="fas fa-building"></i> Single Sign-On (SSO)
          </button>
        </form>
        
        <div className="login-footer">
          <p>Having trouble? <a href="/support">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;