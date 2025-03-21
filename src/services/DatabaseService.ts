import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import * as fs from 'fs';
import * as path from 'path';

// For TypeScript - extend Process interface for Electron
declare global {
  namespace NodeJS {
    interface Process {
      type?: string;
    }
  }
  interface Window {
    process?: NodeJS.Process;
  }
}

export class DatabaseService {
  private static SQL: SqlJsStatic | null = null;
  private static instance: DatabaseService | null = null;
  private db: Database | null = null;
  private dbFilePath: string;
  
  // A promise that resolves when the database is opened and ready
  public ready: Promise<void>;

  constructor() {
    // Get the app data directory path
    // Handle both main process and renderer process
    let userDataDir: string;
    try {
      // Check if we're in Electron
      if (typeof window !== 'undefined' && window.process && window.process.type) {
        // Try to access remote
        try {
          const { remote } = require('@electron/remote');
          userDataDir = remote.app.getPath('userData');
        } catch (remoteError) {
          // Fallback if remote is not available
          userDataDir = path.join(process.cwd(), 'userData');
        }
      } else if (typeof process !== 'undefined' && process.type === 'browser') {
        // Main Electron process
        const { app } = require('electron');
        userDataDir = app.getPath('userData');
      } else {
        // Web environment or other
        userDataDir = path.join(process.cwd(), 'userData');
      }
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
      }
    } catch (error) {
      // Fallback for any environment
      userDataDir = path.join(process.cwd(), 'userData');
      // Create directory if it doesn't exist
      if (!fs.existsSync(userDataDir)) {
        fs.mkdirSync(userDataDir, { recursive: true });
      }
    }
    
    // Set the database file path
    this.dbFilePath = path.join(userDataDir, 'mcphr-database.sqlite');
    
    // Automatically open the database so that consumers can await readiness
    this.ready = this.init().catch(error => {
      console.error('Error initializing database in constructor:', error);
      throw error;
    });
  }

  /**
   * Get the singleton instance of DatabaseService.
   */
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize SQL.js and the database.
   */
  private async init(): Promise<void> {
    try {
      await this.initSql();
      await this.openDatabase();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Initialize SQL.js library.
   */
  private async initSql(): Promise<void> {
    try {
      // For Electron, we can try to load the WASM file from a known location
      let wasmPath: string;
      
      // In production, look for the wasm file in a standard location
      if (typeof process !== 'undefined' && process.type === 'renderer') {
        wasmPath = path.join(__dirname, './sql-wasm.wasm');
      } else {
        // In development, check node_modules
        wasmPath = path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm');
      }
      
      // Try to initialize with the local path
      try {
        DatabaseService.SQL = await initSqlJs({
          locateFile: () => wasmPath
        });
      } catch (localError) {
        console.warn('Failed to load SQL.js from local path, trying CDN fallback:', localError);
        
        // Fallback to CDN
        DatabaseService.SQL = await initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
      }
    } catch (error) {
      console.error('Failed to initialize SQL.js:', error);
      throw error;
    }
  }

  /**
   * Opens the database, creating it if it doesn't exist.
   */
  async openDatabase(): Promise<void> {
    try {
      if (!DatabaseService.SQL) {
        await this.initSql();
      }

      // Close any existing connection
      if (this.db) {
        this.closeDatabase();
      }

      // Check if database file exists
      let dbBuffer: Buffer | null = null;
      
      try {
        if (fs.existsSync(this.dbFilePath)) {
          dbBuffer = fs.readFileSync(this.dbFilePath);
        }
      } catch (err) {
        console.warn('Could not read database file, creating new database:', err);
      }

      if (dbBuffer) {
        // Load existing database from file
        this.db = new DatabaseService.SQL!.Database(dbBuffer);
      } else {
        // Create a new database
        this.db = new DatabaseService.SQL!.Database();
        await this.createSchema();
      }
    } catch (error) {
      console.error('Failed to open database:', error);
      throw error;
    }
  }

  /**
   * Closes the database connection.
   */
  closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  /**
   * Saves the current state of the database to file.
   */
  async saveDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }
    try {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      
      // Ensure the directory exists
      const dirname = path.dirname(this.dbFilePath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }
      
      // Write to a temp file first and then rename to avoid corruption if the app crashes
      const tempPath = `${this.dbFilePath}.tmp`;
      fs.writeFileSync(tempPath, buffer);
      fs.renameSync(tempPath, this.dbFilePath);
    } catch (error) {
      console.error('Failed to save database:', error);
      throw error;
    }
  }

  /**
   * Creates the initial database schema.
   */
  private async createSchema(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }

    const schemaSQL = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      // Employees table
      `CREATE TABLE IF NOT EXISTS employees (
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
      )`,
      // Licenses table
      `CREATE TABLE IF NOT EXISTS licenses (
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
      )`,
      // Attendance table
      `CREATE TABLE IF NOT EXISTS attendance (
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
      )`,
      // Documents table
      `CREATE TABLE IF NOT EXISTS documents (
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
      )`
    ];

    // Execute each schema SQL statement robustly
    for (const sql of schemaSQL) {
      try {
        this.db.exec(sql);
      } catch (error) {
        console.error(`Failed to execute schema SQL: ${sql}`, error);
        throw error;
      }
    }

    await this.saveDatabase();
  }

  /**
   * Executes a SQL query and returns the results.
   */
  executeQuery(sql: string, params: any[] = []): any[] {
    if (!this.db) {
      throw new Error('Database not opened. Ensure you await the ready promise before executing queries.');
    }
    try {
      const statement = this.db.prepare(sql);
      if (params.length > 0) {
        statement.bind(params);
      }
      const results: any[] = [];
      while (statement.step()) {
        results.push(statement.getAsObject());
      }
      statement.free();
      return results;
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }

  /**
   * Executes an insert query and returns the ID of the inserted row.
   */
  executeInsert(sql: string, params: any[] = []): number {
    if (!this.db) {
      throw new Error('Database not opened. Ensure you await the ready promise before executing queries.');
    }
    try {
      this.executeQuery(sql, params);
      const lastIdResult = this.executeQuery('SELECT last_insert_rowid() as id');
      this.saveDatabase().catch(error => {
        console.error('Failed to save database after insert:', error);
      });
      return lastIdResult[0].id;
    } catch (error) {
      console.error('Insert execution error:', error);
      throw error;
    }
  }

  /**
   * Executes an update query and returns the number of affected rows.
   */
  executeUpdate(sql: string, params: any[] = []): number {
    if (!this.db) {
      throw new Error('Database not opened. Ensure you await the ready promise before executing queries.');
    }
    try {
      this.executeQuery(sql, params);
      const changesResult = this.executeQuery('SELECT changes() as changes');
      this.saveDatabase().catch(error => {
        console.error('Failed to save database after update:', error);
      });
      return changesResult[0].changes;
    } catch (error) {
      console.error('Update execution error:', error);
      throw error;
    }
  }
}

// Also export as default for imports like: import DatabaseService from './DatabaseService'
export default DatabaseService;