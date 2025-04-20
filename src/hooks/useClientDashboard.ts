
import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Profile } from "@/types";
import { useUserProfile } from "./user/useUserProfile";
import { useUserPoints } from "./user/useUserPoints";
import { useUserSession } from "./user/useUserSession";
import { useFetchUserData } from "./user/useFetchUserData";

export const useClientDashboard = (navigate?: NavigateFunction) => {
  const { userName } = useUser();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const {
    profileData,
    setProfileData,
    loading: profileLoading,
    setLoading: setProfileLoading,
    retrying,
    setRetrying,
    isProfileCompleted,
    setIsProfileCompleted,
    createUserProfile
  } = useUserProfile();

  const {
    points,
    setPoints,
    credits,
    setCredits,
    streak,
    setStreak,
    checkInactivity
  } = useUserPoints();

  const {
    handleExtendSession,
    handleSessionTimeout
  } = useUserSession();

  const {
    fetchUserData,
    authError,
    setAuthError,
    loading,
    setLoading,
    fetchAttempts,
    setFetchAttempts
  } = useFetchUserData();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
    }

    if (fetchAttempts < 3) {
      const timeout = setTimeout(() => {
        fetchUserData().then(result => {
          if (result && result.success) {
            setProfileData(result.profile);
            setPoints(result.profile.points || 0);
            setCredits(result.profile.credits || 0);
            setIsProfileCompleted(result.profile.profile_completed || false);
            checkInactivity();
          } else if (fetchAttempts < 2) {
            setFetchAttempts(prev => prev + 1);
          }
        });
      }, fetchAttempts * 1000);
      
      return () => clearTimeout(timeout);
    } else if (loading) {
      setLoading(false);
      setAuthError("Não foi possível carregar seus dados após várias tentativas. Por favor, recarregue a página.");
    }
  }, [fetchAttempts, retrying, userName]);

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
