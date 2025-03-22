import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  return (
    <Layout>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem' }}
            required
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Login</button>
      </form>
    </Layout>
  );
}
