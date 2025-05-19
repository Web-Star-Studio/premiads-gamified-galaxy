import { NavigateFunction } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useSessionManagement } from "./dashboard/useSessionManagement";
import { useProfileData } from "./dashboard/useProfileData";
import { useOnboarding } from "./dashboard/useOnboarding";

export const useClientDashboard = (navigate?: NavigateFunction) => {
  const { userName, setUserName } = useUser();
  const { handleExtendSession, handleSessionTimeout } = useSessionManagement(navigate);
  const {
    data: profileData,
    isLoading: loading,
    error: profileError,
  } = useProfileData();
  const { showOnboarding, setShowOnboarding } = useOnboarding();

  const points = profileData?.points || 0;
  const credits = profileData?.credits || 0;
  const isProfileCompleted = profileData?.profile_completed || false;
  const authError = profileError?.message || null;

  const streak = 0;

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
