
import { supabase, cleanSessionData } from '@/integrations/supabase/client';

/**
 * Comprehensive function to sign out and clean up user data
 * Used throughout the application for consistent logout behavior
 */
export const signOutAndCleanup = async (): Promise<void> => {
  try {
    console.log("Starting signout process...");
    
    // First, sign out from Supabase
    const { error } = await supabase.auth.signOut({
      scope: 'local' // Only clear local session, not other tabs
    });
    
    if (error) {
      console.error("Error during Supabase signout:", error);
      throw error;
    }
    
    console.log("Supabase signout successful, cleaning up local data...");
    
    // Then clean up all local storage items
    cleanSessionData();
    
    // For security, clear any session storage as well
    sessionStorage.clear();
    
    console.log("Signout and cleanup complete");
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

/**
 * Function to resend confirmation email
 * Used in login process when user has not confirmed their email yet
 */
export const resendConfirmationEmail = async (email: string): Promise<void> => {
  try {
    console.log("Attempting to resend confirmation email to:", email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth-callback`,
      }
    });
    
    if (error) {
      console.error("Error resending confirmation email:", error);
      throw error;
    }
    
    console.log("Confirmation email resent successfully");
  } catch (error) {
    console.error('Error resending confirmation email:', error);
    throw error;
  }
};
