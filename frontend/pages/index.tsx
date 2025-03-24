import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  
  // Optional: Redirect to dashboard
  // useEffect(() => {
  //   router.push('/dashboard');
  // }, [router]);

  return (
    <Layout>
      <Head>
        <title>Mountain Care HR Dashboard</title>
      </Head>
      <div className="page-welcome">
        <h1>Welcome to Mountain Care HR Dashboard</h1>
        <p className="page-subtitle">
          This is the landing page for the HR Dashboard. Use the navigation links above to login or view your dashboard.
        </p>
        
        {/* Quick links section */}
        <div className="quick-links">
          <h2>Quick Links</h2>
          <div className="links-grid">
            <a href="/dashboard" className="quick-link-card">
              <div className="card-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              <h3>Dashboard</h3>
              <p>View your HR dashboard</p>
            </a>
            
            <a href="/employees" className="quick-link-card">
              <div className="card-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Employees</h3>
              <p>Manage employee records</p>
            </a>
            
            <a href="/onboarding" className="quick-link-card">
              <div className="card-icon">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <h3>Onboarding</h3>
              <p>Start employee onboarding</p>
            </a>
          </div>
        </div>
      </div>

      {/* Additional inline styles for this page */}
      <style jsx>{`
        .page-welcome {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .quick-links {
          margin-top: 3rem;
        }
        
        .quick-links h2 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
        }
        
        .links-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .quick-link-card {
          background-color: white;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 1.5rem;
          text-decoration: none;
          color: var(--gray-800);
          transition: all 0.2s ease;
        }
        
        .quick-link-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        
        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(0, 121, 107, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .card-icon i {
          font-size: 1.25rem;
          color: var(--primary);
        }
        
        .quick-link-card h3 {
          margin-bottom: 0.5rem;
          font-size: 1.125rem;
        }
        
        .quick-link-card p {
          font-size: 0.875rem;
          color: var(--gray-600);
        }
      `}</style>
    </Layout>
  );
}