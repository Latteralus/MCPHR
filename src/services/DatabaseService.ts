import initSqlJs, { Database } from 'sql.js';
import { openDB, IDBPDatabase } from 'idb';

// SQLite tables creation SQL statements
const CREATE_USERS_TABLE = `
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
`;

const CREATE_EMPLOYEES_TABLE = `
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
`;

const CREATE_LICENSES_TABLE = `
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
`;

const CREATE_ATTENDANCE_TABLE = `
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
`;

const CREATE_DOCUMENTS_TABLE = `
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
`;

const INDEXES = [
  `CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);`,
  `CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON employees(manager_id);`,
  `CREATE INDEX IF NOT EXISTS idx_licenses_employee_id ON licenses(employee_id);`,
  `CREATE INDEX IF NOT EXISTS idx_licenses_expiration_date ON licenses(expiration_date);`,
  `CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);`,
  `CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);`,
  `CREATE INDEX IF NOT EXISTS idx_documents_employee_id ON documents(employee_id);`
];

class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;
  private idb: IDBPDatabase | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize the database
   * @returns Promise that resolves when the database is ready
   */
  public async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize IndexedDB for persistence
      this.idb = await openDB('mcphr-db', 1, {
        upgrade(db) {
          // Create object store for the SQLite database
          if (!db.objectStoreNames.contains('sqlite')) {
            db.createObjectStore('sqlite');
          }
        }
      });

      // Initialize sql.js
      const SQL = await initSqlJs({
        // Fetch the wasm file
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });

      // Try to load the database from IndexedDB
      const storedData = await this.idb.get('sqlite', 'database');
      if (storedData) {
        // If we have a saved database, load it
        this.db = new SQL.Database(storedData);
        console.log('Loaded database from IndexedDB');
      } else {
        // Otherwise create a new database
        this.db = new SQL.Database();
        console.log('Created new SQLite database');
        
        // Create the tables
        this.exec(CREATE_USERS_TABLE);
        this.exec(CREATE_EMPLOYEES_TABLE);
        this.exec(CREATE_LICENSES_TABLE);
        this.exec(CREATE_ATTENDANCE_TABLE);
        this.exec(CREATE_DOCUMENTS_TABLE);
        
        // Create indexes
        INDEXES.forEach(index => this.exec(index));
        
        // Save the initial database
        await this.persistDatabase();
      }

      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  /**
   * Execute a SQL statement
   * @param sql The SQL statement to execute
   * @param params The parameters for the statement (optional)
   * @returns The result of the execution
   */
  public exec(sql: string, params: any[] = []): any {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      return this.db.exec(sql, params);
    } catch (error) {
      console.error('SQL Execution Error:', error, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }

  /**
   * Prepare and execute a SQL statement that returns rows
   * @param sql The SQL statement to execute
   * @param params The parameters for the statement (optional)
   * @returns The rows returned by the query
   */
  public query<T>(sql: string, params: any[] = []): T[] {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const stmt = this.db.prepare(sql);
      const results: T[] = [];

      if (params.length > 0) {
        stmt.bind(params);
      }

      while (stmt.step()) {
        const row = stmt.getAsObject();
        results.push(row as T);
      }

      stmt.free();
      return results;
    } catch (error) {
      console.error('Query Error:', error, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }

  /**
   * Execute an INSERT statement and return the ID of the inserted row
   * @param sql The SQL statement to execute
   * @param params The parameters for the statement (optional)
   * @returns The ID of the inserted row
   */
  public insert(sql: string, params: any[] = []): number {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      this.exec(sql, params);
      const lastIdResult = this.query<{id: number}>('SELECT last_insert_rowid() as id');
      const lastId = lastIdResult[0]?.id || 0;
      
      // Persist changes to IndexedDB
      this.persistDatabase();
      
      return lastId;
    } catch (error) {
      console.error('Insert Error:', error, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }

  /**
   * Execute an UPDATE or DELETE statement and return the number of affected rows
   * @param sql The SQL statement to execute
   * @param params The parameters for the statement (optional)
   * @returns The number of affected rows
   */
  public run(sql: string, params: any[] = []): number {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const result = this.exec(sql, params);
      
      // Persist changes to IndexedDB
      this.persistDatabase();
      
      return result.length > 0 ? result[0].values.length : 0;
    } catch (error) {
      console.error('Run Error:', error, 'SQL:', sql, 'Params:', params);
      throw error;
    }
  }

  /**
   * Get a single row by ID
   * @param table The table to query
   * @param id The ID to look for
   * @returns The row with the given ID, or null if not found
   */
  public getById<T>(table: string, id: number): T | null {
    const rows = this.query<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Save the current database state to IndexedDB
   */
  private async persistDatabase(): Promise<void> {
    if (!this.db || !this.idb) {
      return;
    }

    try {
      const data = this.db.export();
      await this.idb.put('sqlite', data, 'database');
      console.log('Database persisted to IndexedDB');
    } catch (error) {
      console.error('Error persisting database:', error);
    }
  }

  /**
   * Close the database connection
   */
  public close(): void {
    if (this.db) {
      this.persistDatabase();
      this.db.close();
      this.db = null;
    }
    
    if (this.idb) {
      this.idb.close();
      this.idb = null;
    }
    
    this.initialized = false;
  }

  /**
   * Export the database as a Uint8Array
   * @returns The database as a Uint8Array
   */
  public exportDatabase(): Uint8Array {
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    
    return this.db.export();
  }

  /**
   * Import a database from a Uint8Array
   * @param data The database as a Uint8Array
   */
  public async importDatabase(data: Uint8Array): Promise<void> {
    try {
      // Initialize sql.js if needed
      if (!this.initialized) {
        await this.init();
      }
      
      const SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
      
      // Close the existing database if it's open
      if (this.db) {
        this.db.close();
      }
      
      // Create a new database from the data
      this.db = new SQL.Database(data);
      
      // Save to IndexedDB
      await this.persistDatabase();
      
      this.initialized = true;
      console.log('Database imported successfully');
    } catch (error) {
      console.error('Error importing database:', error);
      throw error;
    }
  }
}

export default DatabaseService;