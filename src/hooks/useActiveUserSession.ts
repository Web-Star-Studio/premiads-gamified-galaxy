
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";

export const useActiveUserSession = () => {
  const { isAuthenticated, userType, checkSession } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const navigate = useNavigate();

  const refreshSession = useCallback(async () => {
    await checkSession(true);
  }, [checkSession]);

  useEffect(() => {
    console.log("useActiveUserSession: Checking auth status", { isAuthenticated, userType });
    
    const checkAuthStatus = async () => {
      setCheckingStatus(true);
      
      if (!isAuthenticated) {
        console.log("useActiveUserSession: Not authenticated, redirecting to login");
        // Redirect to login if not authenticated
        navigate("/", { replace: true });
        setCheckingStatus(false);
        return;
      }

      // Check user type for admin access
      const hasAdminAccess = userType === "admin";
      setIsAdmin(hasAdminAccess);
      
      // All checks passed, user is active
      setIsActive(true);
      setCheckingStatus(false);
      
      console.log("useActiveUserSession: Auth status checked", { 
        isActive: true, 
        isAdmin: hasAdminAccess
      });
    };

    checkAuthStatus();
  }, [isAuthenticated, userType, navigate]);

  return { 
    isActive, 
    isAdmin, 
    refreshSession,
    isChecking: checkingStatus
  };
};
