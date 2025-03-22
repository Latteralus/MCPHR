import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
  faGlobe,
  faBuilding
} from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, we'll simulate a login.
    // Later, replace this with a call to your NestJS /auth/login endpoint.
    if (email && password) {
      // Simulate authentication delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  };

  const handleSSOLogin = () => {
    console.log('Initiating SSO authentication flow');
    // In a real app, implement SSO logic here using OAuth or SAML
  };

  return (
    <>
      <Head>
        <title>Mountain Care HR Portal - Login</title>
      </Head>
      
      <div className="login-page">
        <div className="login-container">
          <div className="login-sidebar">
            <div className="app-environment">
              <FontAwesomeIcon icon={faGlobe} /> Web App
            </div>
            <div className="login-logo">
              {/* Replace with your actual logo */}
              <div className="logo-placeholder"></div>
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
            
            <form id="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
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
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
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
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
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
                <Link href="/auth/forgot-password" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>
              
              <button type="submit" className="btn btn-primary">Sign In</button>
              
              <div className="login-divider">or continue with</div>
              
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={handleSSOLogin}
              >
                <FontAwesomeIcon icon={faBuilding} /> Single Sign-On (SSO)
              </button>
            </form>
            
            <div className="login-footer">
              <p>Having trouble? <Link href="/support">Contact Support</Link></p>
            </div>
          </div>
        </div>
      </div>
      
      {/* @ts-ignore */}
      <style jsx>{`
        .login-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--gray-100);
          padding: 1rem;
        }

        .login-container {
          display: flex;
          width: 900px;
          max-width: 95%;
          max-height: 95vh;
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .login-sidebar {
          width: 40%;
          background-color: var(--primary);
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .app-environment {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.25rem 0.5rem;
          background-color: rgba(255, 255, 255, 0.15);
          color: white;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .app-environment :global(svg) {
          margin-right: 0.25rem;
        }

        .login-logo {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
        }

        .logo-placeholder {
          height: 30px;
          width: 30px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          margin-right: 0.5rem;
        }

        .login-logo span {
          font-size: 22px;
          font-weight: 600;
          color: white;
        }

        .login-sidebar-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-top: 2rem;
        }

        .login-sidebar h2 {
          font-size: 1.75rem;
          color: white;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }

        .login-sidebar p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          line-height: 1.6;
        }

        .login-main {
          width: 60%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .login-main h1 {
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .login-subtitle {
          color: var(--gray-600);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--gray-700);
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--gray-300);
          border-radius: var(--radius);
          font-size: 1rem;
          color: var(--gray-800);
          transition: all 0.2s ease;
        }

        .input-with-icon {
          padding-left: 2.5rem;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(0, 121, 107, 0.1);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-500);
          cursor: pointer;
          background: none;
          border: none;
          font-size: 1rem;
          padding: 0;
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .remember-me {
          display: flex;
          align-items: center;
        }

        .remember-me input {
          margin-right: 0.5rem;
        }

        .forgot-password {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .forgot-password:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: var(--radius);
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          width: 100%;
        }

        .btn-primary {
          background-color: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-dark);
        }

        .login-divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: var(--gray-500);
          text-align: center;
        }

        .login-divider::before, 
        .login-divider::after {
          content: '';
          flex-grow: 1;
          height: 1px;
          background-color: var(--gray-300);
        }

        .login-divider::before {
          margin-right: 1rem;
        }

        .login-divider::after {
          margin-left: 1rem;
        }

        .btn-outline {
          background-color: transparent;
          border: 1px solid var(--gray-300);
          color: var(--gray-700);
        }

        .btn-outline:hover {
          background-color: var(--gray-100);
          border-color: var(--gray-400);
        }

        .btn-outline :global(svg) {
          margin-right: 0.5rem;
        }

        .login-footer {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--gray-600);
          font-size: 0.875rem;
        }

        .login-footer a {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .login-container {
            flex-direction: column;
            height: auto;
            width: 100%;
            max-width: 450px;
          }

          .login-sidebar, 
          .login-main {
            width: 100%;
          }

          .login-sidebar {
            padding: 1.5rem;
            order: 1;
            border-radius: 0 0 var(--radius) var(--radius);
          }

          .login-main {
            padding: 1.5rem;
            order: 0;
            border-radius: var(--radius) var(--radius) 0 0;
          }

          .login-sidebar-content {
            padding-top: 1rem;
          }
        }
      `}</style>
    </>
  );
}