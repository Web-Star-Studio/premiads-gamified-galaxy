
import { verifyDatabaseConnection } from '@/integrations/supabase/client';

/**
 * Run essential checks to ensure the application is ready for production
 * @returns Promise<boolean> - true if all checks pass
 */
export const runProductionChecks = async (): Promise<{ 
  success: boolean; 
  issues: string[] 
}> => {
  const issues: string[] = [];
  
  // Check database connection
  const dbConnected = await verifyDatabaseConnection();
  if (!dbConnected) {
    issues.push('Database connection failed');
  }
  
  // Check environment variables
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    issues.push('Missing essential environment variables');
  }
  
  // More checks can be added here as needed
  
  return {
    success: issues.length === 0,
    issues
  };
};

/**
 * Check if we're in production environment
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD === true || 
         import.meta.env.MODE === 'production' || 
         import.meta.env.VITE_ENVIRONMENT === 'production';
};

/**
 * Log production startup information
 */
export const logProductionInfo = (): void => {
  if (isProduction()) {
    console.log('🚀 Application running in production mode');
    console.log(`📅 Build date: ${new Date().toISOString()}`);
    
    // Disable console.log in production if needed
    if (isProduction() && typeof window !== 'undefined') {
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        if (import.meta.env.VITE_ENABLE_PROD_LOGS === 'true') {
          originalConsoleLog(...args);
        }
      };
    }
  } else {
    console.log('🔧 Application running in development mode');
  }
};

