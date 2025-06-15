
import { NavigateFunction } from "react-router-dom";
import { useUserProfile } from "./useUserProfile";
import { useSessionManagement } from "./dashboard/useSessionManagement";
import { useProfileData } from "./dashboard/useProfileData";
import { useOnboarding } from "./dashboard/useOnboarding";

export const useClientDashboard = (navigate?: NavigateFunction) => {
  const { userName, loading: profileLoading } = useUserProfile();
  const { handleExtendSession, handleSessionTimeout } = useSessionManagement(navigate);
  const { 
    loading: dataLoading, 
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
    loading: profileLoading || dataLoading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout,
    authError,
    isProfileCompleted,
    profileData
  };
};
