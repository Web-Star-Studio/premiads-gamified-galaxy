
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility function to sign out a user and perform robust cleanup
 */
export const signOutAndCleanup = async () => {
  try {
    // Actual sign-out from Supabase
    await supabase.auth.signOut();

    // Try to clear all possible session data
    localStorage.removeItem("userName");
    localStorage.removeItem("userCredits");
    localStorage.removeItem("userType");
    localStorage.removeItem("lastActivity");

    // Extra: Remove the Supabase session token storage
    localStorage.removeItem("sb-lidnkfffqkpfwwdrifyt-auth-token");
    localStorage.removeItem("supabase.auth.token"); // Smaller possibility
    sessionStorage.clear();

    // Extra: Safeguard, clear all localStorage keys related to Supabase
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });

    // Force reload (bypass cache) to reset React state and prevent auto-login
    window.location.replace("/");
    return true;
  } catch (error) {
    console.error("Error during signOutAndCleanup:", error);
    // Fallback: try to clean and reload anyway
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/");
    return false;
  }
};
