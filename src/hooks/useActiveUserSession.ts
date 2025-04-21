
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { UserType } from "@/types/auth";

export const useActiveUserSession = () => {
  const { isAuthenticated, userType, checkSession } = useUser();
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMaster, setIsAdminMaster] = useState(false);
  const navigate = useNavigate();

  const refreshSession = useCallback(async () => {
    await checkSession(true);
  }, [checkSession]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        navigate("/", { replace: true });
        return;
      }

      // Check user type for admin access
      setIsAdmin(userType === "admin" || userType === "admin-master");
      
      // Check if user is admin-master
      setIsAdminMaster(userType === "admin-master");
      
      // All checks passed, user is active
      setIsActive(true);
    };

    checkAuthStatus();
  }, [isAuthenticated, userType, navigate]);

  return { isActive, isAdmin, isAdminMaster, refreshSession };
};
