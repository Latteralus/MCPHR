import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Interface for the IndexedDB schema
interface AppDB extends DBSchema {
  sqliteDB: {
    key: string;
    value: Uint8Array;
  };
}

export class DatabaseService {
  private static SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private static DB_KEY = 'mcphr-db';
  private static idbPromise: Promise<IDBPDatabase<AppDB>> | null = null;
  
  constructor() {
    // Initialize SQL.js if not already done
    if (!DatabaseService.SQL) {
      this.initSql();
    }
    
    // Initialize IndexedDB connection if not already done
    if (!DatabaseService.idbPromise) {
      DatabaseService.idbPromise = this.initIndexedDB();
    }
  }
  
  /**
   * Initialize SQL.js library
   */
  private async initSql(): Promise<void> {
    try {
      // Load SQL.js WebAssembly library
      DatabaseService.SQL = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
      });
    } catch (error) {
      console.error('Failed to initialize SQL.js:', error);
      throw error;
    }
  }
  
  /**
   * Initialize IndexedDB for persistent storage
   */
  private async initIndexedDB(): Promise<IDBPDatabase<AppDB>> {
    try {
      return await openDB<AppDB>('mcphr-database', 1, {
        upgrade(db) {
          // Create the store for the SQLite database
          if (!db.objectStoreNames.contains('sqliteDB')) {
            db.createObjectStore('sqliteDB');
          }
        }
      });
    } catch (error) {
      console.error('Failed to initialize IndexedDB:', error);
      throw error;
    }
  }
  
  /**
   * Opens the database, creating it if it doesn't exist
   */
  async openDatabase(): Promise<void> {
    try {
      // Make sure SQL.js is initialized
      if (!DatabaseService.SQL) {
        await this.initSql();
      }
      
      // If the database is already open, close it first
      if (this.db) {
        this.closeDatabase();
      }
      
      // Get IndexedDB instance
      const idb = await DatabaseService.idbPromise;
      
      if (!idb) {
        throw new Error('Failed to initialize IndexedDB');
      }
      
      // Try to load the database from IndexedDB
      const dbData = await idb.get('sqliteDB', DatabaseService.DB_KEY);
      
      if (dbData) {
        // Load existing database
        this.db = new DatabaseService.SQL!.Database(dbData);
      } else {
        // Create a new database
        this.db = new DatabaseService.SQL!.Database();
        
        // Create the database schema
        await this.createSchema();
      }
    } catch (error) {
      console.error('Failed to open database:', error);
      throw error;
    }
  }
  
  /**
   * Closes the database connection
   */
  closeDatabase(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
  
  /**
   * Saves the current state of the database to IndexedDB
   */
  async saveDatabase(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }
    
    try {
      // Export the database as a Uint8Array
      const data = this.db.export();
      
      // Save to IndexedDB
      const idb = await DatabaseService.idbPromise;
      
      if (!idb) {
        throw new Error('Failed to initialize IndexedDB');
      }
      
      await idb.put('sqliteDB', data, DatabaseService.DB_KEY);
    } catch (error) {
      console.error('Failed to save database:', error);
      throw error;
    }
  }
  
  /**
   * Creates the initial database schema
   */
  private async createSchema(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not opened');
    }
    
    // Define schema SQL statements
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
    
    // Execute each schema SQL statement
    schemaSQL.forEach(sql => {
      this.db!.exec(sql);
    });
    
    // Save the initial schema to IndexedDB
    await this.saveDatabase();
  }
  
  /**
   * Executes a SQL query and returns the results
   */
  executeQuery(sql: string, params: any[] = []): any[] {
    if (!this.db) {
      throw new Error('Database not opened');
    }
    
    try {
      const statement = this.db.prepare(sql);
      
      // Bind parameters to the statement
      if (params.length > 0) {
        statement.bind(params);
      }
      
      // Execute the query and collect results
      const results: any[] = [];
      while (statement.step()) {
        results.push(statement.getAsObject());
      }
      
      // Finalize the statement to prevent memory leaks
      statement.free();
      
      return results;
    } catch (error) {
      console.error('Query execution error:', error);
      throw error;
    }
  }
  
  /**
   * Executes an insert query and returns the ID of the inserted row
   */
  executeInsert(sql: string, params: any[] = []): number {
    if (!this.db) {
      throw new Error('Database not opened');
    }
    
    try {
      // Execute the insert
      this.executeQuery(sql, params);
      
      // Get the last inserted row ID
      const lastIdResult = this.executeQuery('SELECT last_insert_rowid() as id');
      
      // Save the changes to IndexedDB
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
   * Executes an update query and returns the number of affected rows
   */
  executeUpdate(sql: string, params: any[] = []): number {
    if (!this.db) {
      throw new Error('Database not opened');
    }
    
    try {
      // Execute the update
      this.executeQuery(sql, params);
      
      // Get the number of changes
      const changesResult = this.executeQuery('SELECT changes() as changes');
      
      // Save the changes to IndexedDB
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