/**
 * Force logout with complete state cleanup and page reload
 * This ensures that all auth states are properly cleared
 */
export const forceLogoutWithReload = () => {
  // Clear all auth-related localStorage items
  localStorage.removeItem("userName");
  localStorage.removeItem("userType");
  localStorage.removeItem("supabase.auth.token");
  localStorage.removeItem("sb-zfryjwaeojccskfiibtq-auth-token");
  
  // Clear any potential session storage
  sessionStorage.clear();
  
  // Force complete page reload to auth page
  window.location.href = "/auth";
};

/**
 * Safe logout with fallback to force reload
 * @param signOutFunction The signOut function from auth hook
 * @param timeoutMs Timeout in milliseconds before force reload (default: 1500ms)
 */
export const safeLogoutWithFallback = async (
  signOutFunction: () => Promise<any>,
  timeoutMs: number = 1500
) => {
  try {
    await signOutFunction();
    
    // Set a fallback timeout to force reload if navigation doesn't work
    setTimeout(() => {
      if (window.location.pathname !== "/auth") {
        forceLogoutWithReload();
      }
    }, timeoutMs);
  } catch (error) {
    console.error("Logout error:", error);
    // Force reload immediately on error
    forceLogoutWithReload();
  }
}; 