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
import styles from '../styles/Login.module.css';

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
      
      <div className={styles.loginPage}>
        <div className={styles.loginContainer}>
          <div className={styles.loginSidebar}>
            <div className={styles.appEnvironment}>
              <FontAwesomeIcon icon={faGlobe} /> Web App
            </div>
            <div className={styles.loginLogo}>
              {/* Replace with your actual logo */}
              <div className={styles.logoPlaceholder}></div>
              <span>Mountain Care</span>
            </div>
            <div className={styles.loginSidebarContent}>
              <h2>Welcome to<br />Mountain Care HR Portal</h2>
              <p>Log in to access your healthcare information</p>
            </div>
          </div>
          
          <div className={styles.loginMain}>
            <h1>Sign In</h1>
            <p className={styles.loginSubtitle}>Enter your credentials to access your account</p>
            
            <form id="login-form" onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
                  <input
                    type="email"
                    id="email"
                    className={`${styles.formInput} ${styles.inputWithIcon}`}
                    placeholder="name@mountaincare.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.formLabel}>Password</label>
                <div className={styles.inputWrapper}>
                  <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`${styles.formInput} ${styles.inputWithIcon}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className={styles.passwordToggle} 
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              
              <div className={styles.formFooter}>
                <div className={styles.rememberMe}>
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link href="/auth/forgot-password" className={styles.forgotPassword}>
                  Forgot Password?
                </Link>
              </div>
              
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Sign In</button>
              
              <div className={styles.loginDivider}>or continue with</div>
              
              <button 
                type="button" 
                className={`${styles.btn} ${styles.btnOutline}`} 
                onClick={handleSSOLogin}
              >
                <FontAwesomeIcon icon={faBuilding} /> Single Sign-On (SSO)
              </button>
            </form>
            
            <div className={styles.loginFooter}>
              <p>Having trouble? <Link href="/support" className={styles.link}>Contact Support</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}