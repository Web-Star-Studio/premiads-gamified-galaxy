
import { NavigateFunction } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useSessionManagement } from "./dashboard/useSessionManagement";
import { useProfileData } from "./dashboard/useProfileData";
import { useOnboarding } from "./dashboard/useOnboarding";

export const useClientDashboard = (navigate?: NavigateFunction) => {
  const { userName } = useUser();
  const { handleExtendSession, handleSessionTimeout } = useSessionManagement(navigate);
  const { 
    loading, 
    points, 
    credits, 
    streak, 
    isProfileCompleted, 
    profileData, 
    authError 
  } = useProfileData();
  const { showOnboarding, setShowOnboarding } = useOnboarding();

  return {
    userName,
    points,
    credits,
    streak,
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout,
    authError,
    isProfileCompleted,
    profileData
  };
};
