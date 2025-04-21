
import { createClient } from '@supabase/supabase-js';

// Use environment variables for production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lidnkfffqkpfwwdrifyt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZG5rZmZmcWtwZnd3ZHJpZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzUxOTYsImV4cCI6MjA2MDI1MTE5Nn0.sZD_dXHgI0larkHDCTgLtWrbtoVGZcWR2nOWffiS2Os';

// Initialize Supabase client with explicit configuration for production
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit'
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  // Add more robust error handling and callbacks
  db: {
    schema: 'public'
  }
});

// Helper function to handle file uploads to Supabase Storage
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<{ path: string | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });
      
    if (error) throw error;
    
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    return { path: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { path: null, error: error as Error };
  }
};

// Helper function to get file public URL
export const getPublicUrl = (
  bucketName: string,
  filePath: string
): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};

// Production-ready function to verify database connection
export const verifyDatabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_levels')
      .select('id')
      .limit(1);
      
    return !error;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

// Helper function to clean session data (useful for logout)
export const cleanSessionData = (): void => {
  localStorage.removeItem("userName");
  localStorage.removeItem("userCredits");
  localStorage.removeItem("userType");
  localStorage.removeItem("lastActivity");
  
  // Clean all Supabase-related storage items
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("sb-") || key.includes("supabase")) {
      localStorage.removeItem(key);
    }
  });
};

