# Mountain Care HR App - Electron-First Plan

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Desktop Framework**: Electron
- **Authentication**: JWT (JSON Web Tokens)
- **UI Framework**: Custom styling with CSS variables

## Architecture Overview

The application will follow an Electron-first architecture that works both as a desktop application and a web application with minimal code duplication.

### Key Architecture Components:

1. **Shared React Frontend**: Core UI components used in both web and desktop
2. **Dual-mode Backend**:
   - API mode for web deployment
   - Direct integration for Electron
3. **Database Strategy**:
   - Desktop: Local SQLite with PostgreSQL schema compatibility
   - Web: Remote PostgreSQL server
4. **Synchronization Layer**: For offline-to-online data sync

## Project Structure

```
mountain-care-hr/
├── package.json             # Root package with shared dependencies
├── client/                  # React frontend
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── index.js         # Entry point for web
│   │   ├── electron-index.js # Entry point for Electron
│   │   ├── App.js
│   │   ├── components/      # Shared components
│   │   ├── contexts/        # Shared contexts
│   │   ├── hooks/           # Shared hooks
│   │   ├── pages/           # Shared pages
│   │   ├── services/
│   │   │   ├── api/         # Web API services
│   │   │   └── electron/    # Electron IPC services
│   │   ├── utils/
│   │   └── styles/
├── server/                  # Express backend
│   ├── api/                 # API routes and controllers
│   ├── db/                  # Database models and migrations
│   │   ├── models/          # Sequelize models
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/         # Seed data
│   ├── services/            # Business logic services
│   └── utils/               # Utility functions
├── electron/                # Electron-specific code
│   ├── main.js              # Main process
│   ├── preload.js           # Preload script (secure bridge)
│   ├── db/                  # Electron database handler
│   │   ├── sqlite-handler.js # SQLite implementation
│   │   └── sync-manager.js  # Sync with remote PostgreSQL
│   ├── services/            # Electron-specific services
│   │   ├── auth-service.js  # Local authentication
│   │   ├── file-service.js  # File handling
│   │   └── ipc-handlers.js  # IPC communication
│   └── utils/
├── shared/                  # Code shared between all layers
│   ├── constants.js
│   ├── validation.js
│   └── types.js
└── configs/                 # Configuration files
    ├── webpack.config.js    # Web build config
    ├── electron-forge.config.js # Electron build config
    ├── sequelize.config.js  # Database config
    └── jest.config.js       # Testing config
```

## Database Design

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
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     sync_status VARCHAR(50) DEFAULT 'synced'
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
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     sync_status VARCHAR(50) DEFAULT 'synced'
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
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     sync_status VARCHAR(50) DEFAULT 'synced'
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
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     sync_status VARCHAR(50) DEFAULT 'synced'
   );
   ```

5. **documents**
   ```sql
   CREATE TABLE documents (
     id SERIAL PRIMARY KEY,
     employee_id INTEGER REFERENCES employees(id),
     document_type VARCHAR(100) NOT NULL,
     file_name VARCHAR(255) NOT NULL,
     file_path VARCHAR(255) NOT NULL,
     file_hash VARCHAR(255) NOT NULL,
     upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     uploaded_by INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     sync_status VARCHAR(50) DEFAULT 'synced'
   );
   ```

> Note: All tables include a `sync_status` field to manage synchronization between local and remote databases.

## Electron Implementation Details

### Main Process (main.js)

The main process handles:
- Application lifecycle (startup, shutdown)
- Window management
- Local database initialization
- IPC (Inter-Process Communication) setup
- System tray integration
- Auto-updates

```javascript
// Example main.js structure
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { setupDatabase } = require('./db/sqlite-handler');
const { registerIpcHandlers } = require('./services/ipc-handlers');
const { checkForUpdates } = require('./services/updater');

let mainWindow;

async function createWindow() {
  // Initialize the database
  await setupDatabase();
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../client/build/index.html'));
  }

  // Register IPC handlers
  registerIpcHandlers(mainWindow);
  
  // Check for updates
  checkForUpdates();
}

app.whenReady().then(createWindow);

// App lifecycle events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

### Preload Script (preload.js)

The preload script creates a secure bridge between the renderer process (React) and the main process:

```javascript
// Example preload.js structure
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Authentication
  login: (credentials) => ipcRenderer.invoke('auth:login', credentials),
  logout: () => ipcRenderer.invoke('auth:logout'),
  
  // Database operations
  getEmployee: (id) => ipcRenderer.invoke('db:getEmployee', id),
  getEmployees: () => ipcRenderer.invoke('db:getEmployees'),
  createEmployee: (data) => ipcRenderer.invoke('db:createEmployee', data),
  updateEmployee: (id, data) => ipcRenderer.invoke('db:updateEmployee', id, data),
  
  // File operations
  saveDocument: (employeeId, file) => ipcRenderer.invoke('file:saveDocument', employeeId, file),
  getDocuments: (employeeId) => ipcRenderer.invoke('file:getDocuments', employeeId),
  
  // Synchronization
  syncData: () => ipcRenderer.invoke('sync:syncData'),
  getSyncStatus: () => ipcRenderer.invoke('sync:getStatus'),
  
  // App information
  getAppVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // Listen to events
  onSyncUpdate: (callback) => {
    const listener = (_, status) => callback(status);
    ipcRenderer.on('sync:status', listener);
    return () => ipcRenderer.removeListener('sync:status', listener);
  }
});
```

### React Service Adapters

Create service adapters to abstract the data access layer, allowing the React code to work in both web and Electron environments:

```javascript
// Example service adapter for employees
export const employeeService = {
  async getAll() {
    if (window.electronAPI) {
      // Electron environment
      return window.electronAPI.getEmployees();
    } else {
      // Web environment
      const response = await fetch('/api/employees');
      return response.json();
    }
  },
  
  async getById(id) {
    if (window.electronAPI) {
      return window.electronAPI.getEmployee(id);
    } else {
      const response = await fetch(`/api/employees/${id}`);
      return response.json();
    }
  },
  
  async create(data) {
    if (window.electronAPI) {
      return window.electronAPI.createEmployee(data);
    } else {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    }
  },
  
  // Additional methods...
};
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

1. **Windows/macOS Native Elements**
   - Window controls (minimize, maximize, close)
   - Native menus
   - Title bar consistent with OS
   - System notifications integration

2. **Cards**
   - White background (#FFFFFF)
   - Border radius: 8px
   - Box shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
   - Padding: 24px (1.5rem)

3. **Buttons**
   - Border radius: 8px
   - Font weight: 600
   - Padding: 8px 16px (0.5rem 1rem)
   - Primary Button: Background #00796B, Text White
   - Secondary Button: Background White, Border #E0E0E0, Text #616161

4. **Forms**
   - Input height: 40px
   - Border radius: 8px
   - Border color: #E0E0E0
   - Focus border color: #00796B
   - Label color: #616161
   - Input padding: 8px 16px

5. **Tables**
   - Header background: #F5F5F5
   - Border color: #E0E0E0
   - Zebra striping: Even rows #FFFFFF, Odd rows #F9F9F9
   - Row hover: #F5F5F5

## Electron-Specific UI Elements

1. **Title Bar**
   - Custom title bar with app logo and name
   - Window controls matching OS style
   - Connection status indicator

2. **System Tray**
   - App icon in system tray
   - Quick actions menu
   - Notification indicators

3. **Offline Mode Indicators**
   - Sync status badge
   - Last synced timestamp
   - Pending changes counter

4. **Desktop Notifications**
   - License expiration alerts
   - Sync completion notifications
   - New task assignments

## Implementation Plan (7 Weeks)

### Phase 1: Project Setup and Core Architecture (2 weeks)

1. **Week 1: Project Initialization**
   - Set up React project structure
   - Set up Electron configuration
   - Configure PostgreSQL and SQLite databases
   - Create shared data models
   - Set up build scripts

2. **Week 2: Core Services**
   - Implement authentication services
   - Create data access layer
   - Implement IPC communication
   - Set up synchronization framework
   - Create service adapters

### Phase 2: Authentication and Database (1 week)

1. **Authentication System**
   - Implement login/logout functionality
   - Create user session management
   - Set up JWT for web authentication
   - Implement secure storage for Electron

2. **Database Setup**
   - Create database migrations
   - Set up SQLite for desktop
   - Configure PostgreSQL for web
   - Implement initial seed data

### Phase 3: Dashboard and UI Implementation (2 weeks)

1. **Week 4: UI Framework**
   - Implement shared component library
   - Create layout components (sidebar, header)
   - Implement responsive design
   - Create form components

2. **Week 5: Dashboard Implementation**
   - Create dashboard page
   - Implement stat cards
   - Create license expiration component
   - Implement activity feed
   - Add quick access module cards

### Phase 4: Electron-Specific Features (1 week)

1. **Desktop Integration**
   - Implement system tray functionality
   - Create native menu options
   - Set up auto-updates
   - Add desktop notifications
   - Implement offline mode

### Phase 5: Testing and Refinement (1 week)

1. **Testing**
   - Unit tests for core services
   - Integration tests for data flow
   - UI testing for both web and desktop
   - Offline synchronization testing

2. **Refinement**
   - Performance optimization
   - Bug fixes
   - UX improvements
   - Documentation

## Deployment Strategy

### Desktop Application
- Use Electron Forge for packaging
- Create installers for Windows, macOS, Linux
- Implement auto-update system
- Code signing for macOS and Windows

### Web Application
- Deploy Express backend to a Node.js hosting service
- Set up PostgreSQL database on a managed service
- Configure HTTPS and security headers
- Set up CI/CD pipeline

## Future Expansion

After the MVP is completed, additional modules can be added in this order:

1. Employee Management
2. Attendance Tracking
3. Leave Management
4. License and Compliance Tracking
5. Document Management
6. Onboarding/Offboarding
7. Reporting and Analytics

Each module will follow the established architecture and styling to maintain consistency across both web and desktop platforms.