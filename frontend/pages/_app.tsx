import type { AppProps } from 'next/app';
import Head from 'next/head';

// Import styles if external CSS is working
// import '../styles/main.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Mountain Care HR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      
      {/* Inline styles as fallback if CSS isn't loading */}
      <style jsx global>{`
        :root {
          --primary: #00796B;
          --primary-light: #4DB6AC;
          --primary-dark: #004D40;
          --secondary: #4FC3F7;
          --accent: #FFC107;
          --warning: #FF9800;
          --danger: #F44336;
          --success: #4CAF50;
          --gray-100: #F5F5F5;
          --gray-200: #EEEEEE;
          --gray-300: #E0E0E0;
          --gray-400: #BDBDBD;
          --gray-500: #9E9E9E;
          --gray-600: #757575;
          --gray-700: #616161;
          --gray-800: #424242;
          --gray-900: #212121;
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
          --shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
          --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          --radius: 8px;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Nunito', sans-serif;
          background-color: var(--gray-100);
          color: var(--gray-800);
          font-size: 16px;
          line-height: 1.5;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          color: var(--gray-900);
        }

        .container {
          display: flex;
          min-height: 100vh;
        }

        /* Sidebar styles */
        .sidebar {
          width: 250px;
          background-color: white;
          box-shadow: var(--shadow);
          padding: 1.5rem 0;
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 100;
        }

        .sidebar-logo {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .sidebar-logo img {
          height: 40px;
        }

        .sidebar-logo span {
          font-size: 20px;
          font-weight: 700;
          color: var(--primary);
          margin-left: 10px;
        }

        .sidebar-menu {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: var(--gray-700);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }

        .menu-item.active {
          color: var(--primary);
          background-color: var(--gray-100);
          font-weight: 600;
        }

        .menu-item.active::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background-color: var(--primary);
        }

        .menu-item:hover {
          background-color: var(--gray-100);
          color: var(--primary);
        }

        .menu-item svg {
          margin-right: 10px;
          width: 20px;
        }

        .sidebar-footer {
          border-top: 1px solid var(--gray-200);
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
        }

        .sidebar-footer img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 10px;
        }

        .user-info {
          flex-grow: 1;
        }

        .user-name {
          font-weight: 600;
          font-size: 14px;
          color: var(--gray-900);
        }

        .user-role {
          font-size: 12px;
          color: var(--gray-600);
        }

        /* Main content styles */
        .main-content {
          margin-left: 250px;
          flex-grow: 1;
          padding: 2rem;
        }

        .page-title h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          color: var(--gray-600);
          margin-bottom: 1.5rem;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            left: -250px;
            transition: all 0.3s ease;
          }

          .sidebar.active {
            left: 0;
          }

          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
      
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;