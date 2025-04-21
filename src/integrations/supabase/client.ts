
import { createClient } from '@supabase/supabase-js';

// Use hardcoded values as fallbacks to ensure the client always has valid values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lidnkfffqkpfwwdrifyt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZG5rZmZmcWtwZnd3ZHJpZnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NzUxOTYsImV4cCI6MjA2MDI1MTE5Nn0.sZD_dXHgI0larkHDCTgLtWrbtoVGZcWR2nOWffiS2Os';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
