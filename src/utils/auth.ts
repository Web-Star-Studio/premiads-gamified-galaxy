
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility function to sign out a user and perform cleanup robustly
 */
export const signOutAndCleanup = async () => {
  try {
    // Actual sign-out from Supabase
    await supabase.auth.signOut();

    // Clear local user data
    localStorage.removeItem("userName");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userType");
    localStorage.removeItem("lastActivity");

    // Force-reload to home after sign-out
    window.location.href = "/";
    return true;
  } catch (error) {
    console.error("Error during signOutAndCleanup:", error);
    // As a fallback, go home
    window.location.href = "/";
    return false;
  }
};
