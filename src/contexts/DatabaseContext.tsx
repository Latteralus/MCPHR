import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { SeedService } from '../services/SeedService';

interface DatabaseContextType {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

const defaultDatabaseContext: DatabaseContextType = {
  isInitialized: false,
  isLoading: false,
  error: null,
  initialize: async () => {},
};

export const DatabaseContext = createContext<DatabaseContextType>(defaultDatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dbService = new DatabaseService();
  const seedService = new SeedService();
  
  const initialize = async (): Promise<void> => {
    if (isInitialized) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize database
      await dbService.openDatabase();
      
      // Seed database with test data
      await seedService.seedDatabase();
      
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database');
      console.error('Database initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Initialize database when the provider mounts
    initialize();
    
    // Close database connection when the provider unmounts
    return () => {
      dbService.closeDatabase();
    };
  }, []);
  
  const contextValue: DatabaseContextType = {
    isInitialized,
    isLoading,
    error,
    initialize,
  };
  
  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};