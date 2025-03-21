import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import DatabaseService from '../services/DatabaseService';

interface DatabaseContextProps {
  dbReady: boolean;
  initDatabase: () => Promise<void>;
  exportDatabase: () => Promise<Uint8Array>;
  importDatabase: (data: Uint8Array) => Promise<void>;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextProps | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dbReady, setDbReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dbService = DatabaseService.getInstance();

  useEffect(() => {
    initDatabase();
    
    // Cleanup function to close the database connection when the component is unmounted
    return () => {
      dbService.close();
    };
  }, []);

  const initDatabase = async (): Promise<void> => {
    try {
      setError(null);
      await dbService.init();
      setDbReady(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize database';
      console.error('Database initialization error:', err);
      setError(errorMessage);
      setDbReady(false);
    }
  };

  const exportDatabase = async (): Promise<Uint8Array> => {
    if (!dbReady) {
      throw new Error('Database not initialized');
    }
    
    try {
      return dbService.exportDatabase();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export database';
      console.error('Database export error:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const importDatabase = async (data: Uint8Array): Promise<void> => {
    try {
      setError(null);
      await dbService.importDatabase(data);
      setDbReady(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to import database';
      console.error('Database import error:', err);
      setError(errorMessage);
      throw err;
    }
  };

  const contextValue: DatabaseContextProps = {
    dbReady,
    initDatabase,
    exportDatabase,
    importDatabase,
    error
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextProps => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};