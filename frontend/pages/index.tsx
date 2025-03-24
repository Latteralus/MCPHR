import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  
  // Redirect to dashboard for now (since this is just a landing page)
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <Layout>
      <Head>
        <title>Mountain Care HR Dashboard</title>
      </Head>
      <div className="page-title">
        <h1>Welcome to Mountain Care HR Dashboard</h1>
        <p className="page-subtitle">
          This is the landing page for the HR Dashboard. You'll be redirected to the dashboard shortly.
        </p>
      </div>
    </Layout>
  );
}