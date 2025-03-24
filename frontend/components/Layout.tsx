import Link from 'next/link';
import { FC, ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <header style={{ padding: '1rem', background: '#f0f0f0' }}>
        <nav>
          <Link href="/"><a style={{ marginRight: '1rem' }}>Home</a></Link>
          <Link href="/auth/login"><a style={{ marginRight: '1rem' }}>Login</a></Link>
          <Link href="/dashboard"><a>Dashboard</a></Link>
        </nav>
      </header>
      <main style={{ padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
