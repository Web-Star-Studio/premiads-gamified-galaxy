
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility function to sign out a user and perform cleanup
 */
export const signOutAndCleanup = async () => {
  console.log("Performing signOut and cleanup");
  
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear any local storage items
    localStorage.removeItem("userName");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userType");
    
    // Force reload to clear any in-memory state
    window.location.href = "/";
    
    return true;
  } catch (error) {
    console.error("Error during signOut and cleanup:", error);
    return false;
  }
};
