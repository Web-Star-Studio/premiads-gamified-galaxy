
import { supabase, cleanSessionData } from '@/integrations/supabase/client';

/**
 * Comprehensive function to sign out and clean up user data
 * Used throughout the application for consistent logout behavior
 */
export const signOutAndCleanup = async (): Promise<void> => {
  try {
    // First, sign out from Supabase
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Then clean up all local storage items
    cleanSessionData();
    
    // For security, clear any session storage as well
    sessionStorage.clear();
    
  } catch (error) {
    console.error('Error during sign out:', error);
    // Clean up even if there's an error with Supabase signOut
    cleanSessionData();
    sessionStorage.clear();
    throw error;
  }
};

/**
 * Utility function to check if user has admin privileges
 */
export const isUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;
    
    const { data } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();
      
    return data?.user_type === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Function to get user role directly from database
 */
export const getUserRole = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', session.user.id)
      .single();
      
    return data?.user_type || null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

