
import { useEffect } from "react";

// This effect handles demo user cleanup. Import and use in UserProvider.
export function useDemoCleanupEffect() {
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const demoUserEmails = [
      "demo@premiads.com",
      "demo@premiads.app",
      "demo@demo.com"
    ];

    if (
      userName &&
      (userName.toLowerCase().includes("demo") ||
        demoUserEmails.some(email => userName.toLowerCase() === email))
    ) {
      localStorage.removeItem("userName");
      localStorage.removeItem("userCredits");
      localStorage.removeItem("userType");
      localStorage.removeItem("lastActivity");
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith("sb-") || key.includes("supabase")) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
      window.location.replace("/");
    }
  }, []);
}
