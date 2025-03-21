You are an expert in full-stack development. I have a project plan that needs refining and code suggestions. The project is a browser-based HR app called "Mountain Care HR" (MCPHR). I want to start with a local, in-browser SQLite database using `sql.js` but ensure it can be easily ported to PostgreSQL later. Below are all the relevant details:

================================================================================
# Mountain Care HR App (Browser-Based)

## Technology Stack

- **Frontend**: React.js with TypeScript 
- **Backend**: Node.js with Express (optional, for future expansion)  
- **Database (Initial)**: `sql.js` (WebAssembly port of SQLite)  
- **Database (Future)**: PostgreSQL (for production or remote usage)  
- **Authentication**: JWT (JSON Web Tokens)  
- **UI Framework**: Custom styling with CSS variables  
- **Desktop Framework**: *(Removed Electron; this is purely browser-based)*

## Architecture Overview

The application will be a **browser-based** application that can **later** integrate with a Node/Express backend and PostgreSQL. Initially, it stores data with `sql.js` entirely in the client. Once we move to a real server, the same schema can be used on PostgreSQL.

### Key Architecture Components:

1. **Shared React Frontend**:  
   - Core UI built with React and TypeScript.  
   - `sql.js` runs in the browser, storing data in memory and persisting via IndexedDB.

2. **Optional/Future Node.js Backend** (not needed immediately):  
   - When we need multi-user functionality or a production environment, we can introduce an Express server that connects to a remote PostgreSQL database.

3. **Database Strategy**:  
   - **Initial**: `sql.js` in the browser (compatible with the same schemas we'll use in PostgreSQL).  
   - **Future**: PostgreSQL for robust data storage.

4. **Synchronization Layer**:  
   - If you eventually want offline to online sync, you can store local data in `sql.js` and sync to PostgreSQL. (Not essential in the first phase.)

## Project Structure

```
MCPHR/
├── package.json             # Root package for client
├── tsconfig.json            # TypeScript configuration with path aliases
├── public/                  # Static assets
│   ├── index.html
│   └── assets/
├── src/                     # React frontend source code
│   ├── index.tsx            # Entry point
│   ├── App.tsx              # Main App component with routing
│   ├── components/          # Shared components
│   │   ├── Layout/          # Layout components
│   │   │   ├── MainLayout.tsx  # Main layout with sidebar/header
│   │   │   └── Layout.css      # Layout styles
│   │   └── LoadingSpinner.tsx # Loading indicator
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.tsx  # Authentication state management
│   │   └── DatabaseContext.tsx # Database connection management
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Application pages
│   │   ├── Login/           # Login page
│   │   ├── Dashboard/       # Dashboard page
│   │   ├── Employees/       # Employees pages
│   │   ├── Licenses/        # License tracking pages
│   │   ├── Attendance/      # Attendance tracking
│   │   └── Settings/        # Application settings
│   ├── services/            # Services layer for data access
│   │   ├── DatabaseService.ts # sql.js connection management
│   │   ├── UserService.ts   # User data operations
│   │   ├── EmployeeService.ts # Employee data operations
│   │   ├── LicenseService.ts # License data operations
│   │   └── AuthService.ts   # Authentication services
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts         # Shared types (User, Employee, etc.)
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
│       └── global.css       # CSS variables and base styles
└── shared/                  # Code shared between front & future server
    ├── constants.js         # Shared constants
    ├── validation.js        # Validation rules
    └── types.js             # Shared type definitions
```

## Database Design

### Core Database Tables (Compatible with sql.js / PostgreSQL)

1. **users**
   ```sql
   CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     role TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **employees**
   ```sql
   CREATE TABLE IF NOT EXISTS employees (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     user_id INTEGER,
     employee_id TEXT UNIQUE NOT NULL,
     department TEXT NOT NULL,
     position TEXT NOT NULL,
     hire_date DATE NOT NULL,
     manager_id INTEGER,
     employment_status TEXT NOT NULL,
     emergency_contact_name TEXT,
     emergency_contact_phone TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id),
     FOREIGN KEY (manager_id) REFERENCES employees(id)
   );
   ```

3. **licenses**
   ```sql
   CREATE TABLE IF NOT EXISTS licenses (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     employee_id INTEGER,
     license_type TEXT NOT NULL,
     license_number TEXT NOT NULL,
     issue_date DATE NOT NULL,
     expiration_date DATE NOT NULL,
     issuing_authority TEXT NOT NULL,
     status TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (employee_id) REFERENCES employees(id)
   );
   ```

4. **attendance**
   ```sql
   CREATE TABLE IF NOT EXISTS attendance (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     employee_id INTEGER,
     date DATE NOT NULL,
     clock_in TIMESTAMP,
     clock_out TIMESTAMP,
     status TEXT NOT NULL,
     notes TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (employee_id) REFERENCES employees(id)
   );
   ```

5. **documents**
   ```sql
   CREATE TABLE IF NOT EXISTS documents (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     employee_id INTEGER,
     document_type TEXT NOT NULL,
     file_name TEXT NOT NULL,
     file_path TEXT NOT NULL,
     file_hash TEXT NOT NULL,
     upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     uploaded_by INTEGER,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (employee_id) REFERENCES employees(id),
     FOREIGN KEY (uploaded_by) REFERENCES users(id)
   );
   ```

*(Removed `sync_status` fields, as we're focusing on a straightforward local approach. You can reintroduce them if you want an offline-online sync system.)*

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

2. **Buttons**
   - Border radius: 8px
   - Font weight: 600
   - Padding: 8px 16px
   - Primary Button: Background #00796B, Text White
   - Secondary Button: Background White, Border #E0E0E0, Text #616161

3. **Forms**
   - Input height: 40px
   - Border radius: 8px
   - Border color: #E0E0E0
   - Focus border color: #00796B
   - Label color: #616161
   - Input padding: 8px 16px

4. **Tables**
   - Header background: #F5F5F5
   - Border color: #E0E0E0
   - Zebra striping: Even rows #FFFFFF, Odd rows #F9F9F9
   - Row hover: #F5F5F5

5. **Responsive Layout**
   - Use CSS grid or flex for layout
   - Ensure breakpoints for mobile, tablet, desktop

*(Removed references to OS-specific or Electron-specific UIs.)*

## Implementation Plan (Approx. 7 Weeks)

### Phase 1: Project Setup and Core Architecture (2 weeks) - COMPLETED

- ~~**Week 1**:~~  
  1. ~~Initialize React project with TypeScript.~~
  2. ~~Install `sql.js` and other dependencies.~~
  3. ~~Set up local in-browser database logic (open DB in memory, store in IndexedDB).~~
  4. ~~Basic folder structure.~~

- **Week 2**:  
  1. ~~Create core services (UserService, EmployeeService, LicenseService).~~
  2. ~~Set up authentication services with JWT.~~
  3. ~~Create React contexts for state management.~~
  4. Build UI components for layout and navigation.

### Phase 2: Authentication and Core Pages (1 week)

- Implement authentication flows:
  - Build login page with forms.
  - Create protected routes.
  - Store JWT token in localStorage.
- Create initial database seed data for development.
- Build dashboard and navigation.

### Phase 3: Employee and License Management (2 weeks)

- **Week 4**:
  1. Employee listing page with search/filter
  2. Employee detail/edit forms
  3. Employee creation flow

- **Week 5**:
  1. License tracking pages
  2. License expiry notifications
  3. License detail/edit forms

### Phase 4: Additional Features (1 week)

- Attendance tracking module
- Document upload/management (file storage in IndexedDB)
- Reporting and data visualization

### Phase 5: Testing and Refinement (1 week)

- **Testing**:
  1. Unit tests for core React components
  2. Integration tests for `sql.js` data flows
  3. End-to-end testing of key workflows
- **Refinement**:
  1. Performance optimization
  2. Bug fixes
  3. UX improvements
  4. Documentation

*(Removed references to Electron packaging, offline sync manager, or auto-updates.)*

## Deployment Strategy

- **Browser-Only Prototype**:
  - Simply build your React app (`npm run build`) and deploy the static files to Netlify, GitHub Pages, or any static hosting.
- **Future Node Hosting**:
  - Host your Express server (if used) on Heroku, Render, AWS, etc.
  - Use a managed PostgreSQL service for production data.
- **Security**:
  - For purely local usage in the browser, data is stored inside the user's browser. Not recommended for sensitive production data without encryption or a secure server.

## Future Expansion

1. **Attendance Tracking & Reports**
2. **Leave Management**
3. **Document Management** (like upload, versioning)
4. **Analytics & Dashboards**
5. **Multi-user environment** (requires a real server + DB)
6. **Offline to online sync** (if you keep `sql.js` as a local cache)

================================================================================

# Sample package.json (React + TypeScript)

```json
{
  "name": "mcphr",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/jest": "^27.5.2",
    "@types/node": "^16.18.61",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "idb": "^7.1.1",
    "jsonwebtoken": "^9.0.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.18.0",
    "react-scripts": "5.0.1",
    "sql.js": "^1.8.0",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.3",
    "@types/sql.js": "^1.4.5",
    "wasm-loader": "^1.3.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

================================================================================

## Progress Update (Week 1)

The following items have been completed in the initial setup phase:

1. **Project Structure and Configuration**
   - Created React + TypeScript project with proper folder structure
   - Set up TypeScript configuration with path aliases
   - Added global CSS styles and design system
   
2. **Database Implementation**
   - Implemented DatabaseService using sql.js for in-browser SQLite
   - Added persistence with IndexedDB for data storage between sessions
   - Created database tables with proper schemas
   - Added indexing for performance optimization
   
3. **Core Services**
   - Created UserService for user management
   - Created EmployeeService for employee data
   - Created LicenseService for license tracking
   - Implemented AuthService with JWT authentication
   
4. **State Management**
   - Created AuthContext for managing authentication state
   - Created DatabaseContext for database connection management
   
5. **UI Components**
   - Implemented MainLayout component with responsive sidebar
   - Created LoadingSpinner component for handling loading states
   
6. **Routing**
   - Set up router with protected routes
   - Added route configuration for main app sections

## Next Steps (Week 2)

1. Implement the Login page with forms and authentication
2. Build the Dashboard with widgets and metrics
3. Create employee listing and detail pages
4. Implement license tracking views
5. Add seed data for testing

================================================================================

**Task**:
1. Continue building the HR app according to the plan above.
2. Implement the Login page as the next step, reusing the designs from login.html provided earlier.
3. Create database seed functions to populate initial test data.

```

---

**Instructions**:  
- Use this updated plan as a guide for continuing the development of your browser-based HR app.
- The structure now reflects the actual implementation with TypeScript and the service pattern.
- Follow the "Next Steps" section to prioritize upcoming development tasks.