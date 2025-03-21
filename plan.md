# Mountain Care HR App - Revised MVP Plan

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: PostgreSQL (replacing MongoDB)
- **ORM**: Sequelize (for database interactions)
- **Authentication**: JWT (JSON Web Tokens)
- **UI Framework**: Custom styling with CSS variables (as demonstrated in the dashboard)

## Database Design - PostgreSQL

Switching to PostgreSQL provides several advantages for an HR application:
- Strong data integrity with ACID compliance
- Powerful querying capabilities
- Robust transaction support
- Well-suited for relational data (common in HR systems)

### Core Database Tables

1. **users**
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     first_name VARCHAR(100) NOT NULL,
     last_name VARCHAR(100) NOT NULL,
     role VARCHAR(50) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **employees**
   ```sql
   CREATE TABLE employees (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id),
     employee_id VARCHAR(50) UNIQUE NOT NULL,
     department VARCHAR(100) NOT NULL,
     position VARCHAR(100) NOT NULL,
     hire_date DATE NOT NULL,
     manager_id INTEGER REFERENCES employees(id),
     employment_status VARCHAR(50) NOT NULL,
     emergency_contact_name VARCHAR(100),
     emergency_contact_phone VARCHAR(20),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **licenses**
   ```sql
   CREATE TABLE licenses (
     id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES employees(id),
     license_type VARCHAR(100) NOT NULL,
     license_number VARCHAR(100) NOT NULL,
     issue_date DATE NOT NULL,
     expiration_date DATE NOT NULL,
     issuing_authority VARCHAR(100) NOT NULL,
     status VARCHAR(50) NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. **attendance**
   ```sql
   CREATE TABLE attendance (
     id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES employees(id),
     date DATE NOT NULL,
     clock_in TIMESTAMP,
     clock_out TIMESTAMP,
     status VARCHAR(50) NOT NULL,
     notes TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. **leave_requests**
   ```sql
   CREATE TABLE leave_requests (
     id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES employees(id),
     leave_type VARCHAR(50) NOT NULL,
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     status VARCHAR(50) NOT NULL,
     approved_by INTEGER REFERENCES users(id),
     reason TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

6. **documents**
   ```sql
   CREATE TABLE documents (
     id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES employees(id),
     document_type VARCHAR(100) NOT NULL,
     file_name VARCHAR(255) NOT NULL,
     file_path VARCHAR(255) NOT NULL,
     upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     uploaded_by INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Style Guide

### Color Palette

- **Primary Color**: Teal (#00796B)
  - Dark shade: #004D40
  - Light shade: #4DB6AC
- **Secondary Color**: Soft Blue (#4FC3F7)
- **Accent Color**: Amber (#FFC107)
- **Alert Colors**:
  - Success: #4CAF50
  - Warning: #FF9800
  - Danger: #F44336
- **Neutral Colors**:
  - White: #FFFFFF
  - Gray-100: #F5F5F5
  - Gray-200: #EEEEEE
  - Gray-300: #E0E0E0
  - Gray-400: #BDBDBD
  - Gray-500: #9E9E9E
  - Gray-600: #757575
  - Gray-700: #616161
  - Gray-800: #424242
  - Gray-900: #212121

### Typography

- **Heading Font**: Inter (sans-serif)
  - h1: 28px (1.75rem), font-weight: 700
  - h2: 24px (1.5rem), font-weight: 700
  - h3: 20px (1.25rem), font-weight: 600
  - h4: 18px (1.125rem), font-weight: 600
  - h5: 16px (1rem), font-weight: 600
  - h6: 14px (0.875rem), font-weight: 600

- **Body Font**: Nunito (sans-serif)
  - Base size: 16px (1rem)
  - Small text: 14px (0.875rem)
  - Extra small text: 12px (0.75rem)
  - Line height: 1.5

### UI Components

1. **Cards**
   - White background (#FFFFFF)
   - Border radius: 8px
   - Box shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
   - Padding: 24px (1.5rem)
   - Margin bottom: 24px (1.5rem)

2. **Buttons**
   - Border radius: 8px
   - Font weight: 600
   - Padding: 8px 16px (0.5rem 1rem)
   - Primary Button:
     - Background: #00796B
     - Text: White
     - Hover: #004D40
   - Secondary Button:
     - Background: White
     - Border: 1px solid #E0E0E0
     - Text: #616161
     - Hover: Background #F5F5F5

3. **Forms**
   - Input height: 40px
   - Border radius: 8px
   - Border color: #E0E0E0
   - Focus border color: #00796B
   - Error color: #F44336
   - Label color: #616161
   - Label font size: 14px
   - Input padding: 8px 16px

4. **Tables**
   - Header background: #F5F5F5
   - Border color: #E0E0E0
   - Zebra striping: Even rows #FFFFFF, Odd rows #F9F9F9
   - Row hover: #F5F5F5
   - Cell padding: 12px 16px

5. **Navigation**
   - Sidebar background: White
   - Active link: Text #00796B, Background #F5F5F5
   - Hover link: Text #00796B, Background #F5F5F5
   - Icon + Text alignment
   - Proper spacing: 12px vertical padding

## Extremely MVP Implementation Plan

For the initial MVP focusing on authentication and dashboard:

### Phase 1: Project Setup (1 week)

1. **Project Initialization**
   - Set up React frontend project
   - Set up Node.js backend with Express
   - Configure PostgreSQL database
   - Set up Sequelize ORM
   - Create repository and initial commit

2. **Initial Configuration**
   - Set up environment variables
   - Configure database connection
   - Set up authentication middleware
   - Create basic folder structure

### Phase 2: Authentication System (1 week)

1. **Backend Development**
   - Create users table migration
   - Implement user model with Sequelize
   - Implement authentication controllers:
     - Login
     - Logout
     - Password reset (basic)
   - Set up JWT token generation and validation

2. **Frontend Development**
   - Create Login page with form validation
   - Implement authentication context
   - Setup protected routes
   - Create logout functionality

### Phase 3: Dashboard Implementation (2 weeks)

1. **Backend Development**
   - Create initial database seed data
   - Implement basic APIs for dashboard data:
     - Employee count stats
     - Attendance stats
     - Leave request stats
     - License expiration data
     - Recent activity data

2. **Frontend Development**
   - Implement the dashboard layout:
     - Sidebar navigation
     - Header with search and notifications
     - Main content area
   - Create dashboard components:
     - Stat cards
     - License expiration cards
     - Activity feed
     - Quick access module cards

### Phase 4: Testing and Refinement (1 week)

1. **Testing**
   - Implement unit tests for authentication
   - Test dashboard data retrieval
   - Perform UI testing
   - Cross-browser compatibility testing

2. **Refinement**
   - Address any bugs or issues
   - Optimize performance
   - Improve responsive design
   - Final styling adjustments

## File Structure

### Frontend (React)

```
client/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       └── logo.svg              # Mountain Care logo
├── src/
│   ├── index.js
│   ├── App.js
│   ├── config/
│   │   └── config.js
│   ├── api/
│   │   ├── axios.js
│   │   └── auth.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Button.jsx
│   │   │   └── Loader.jsx
│   │   └── dashboard/
│   │       ├── Dashboard.jsx
│   │       ├── StatCard.jsx
│   │       ├── ActivityFeed.jsx
│   │       ├── LicenseExpirations.jsx
│   │       └── ModuleCard.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Dashboard.jsx
│   ├── utils/
│   │   └── helpers.js
│   └── styles/
│       ├── index.css
│       ├── variables.css
│       └── components/
│           ├── login.css
│           └── dashboard.css
└── package.json
```

### Backend (Node.js + PostgreSQL)

```
server/
├── server.js
├── config/
│   ├── database.js               # PostgreSQL configuration
│   ├── config.js
│   └── passport.js
├── api/
│   ├── routes/
│   │   └── auth.js
│   ├── controllers/
│   │   └── auth.js
│   └── middleware/
│       └── auth.js
├── models/
│   ├── index.js                  # Sequelize initialization
│   └── user.js                   # User model
├── migrations/                   # Sequelize migrations
│   └── 20250321000000-create-users.js
├── seeders/                      # Sequelize seeders
│   └── 20250321000000-demo-users.js
├── utils/
│   └── helpers.js
├── package.json
└── README.md
```

## Timeline

- **Week 1**: Project setup and initial configuration
- **Week 2**: Authentication system implementation
- **Weeks 3-4**: Dashboard implementation 
- **Week 5**: Testing, refinement, and deployment

Total time for extremely MVP: **5 weeks**

## Future Expansion

After the extremely MVP is completed, the system can be expanded module by module in this order of priority:

1. Employee Management
2. Attendance Tracking
3. Leave Management
4. License and Compliance Tracking
5. Document Management
6. Onboarding/Offboarding
7. Reporting and Analytics

Each module will follow the established architecture and styling to maintain consistency throughout the application.