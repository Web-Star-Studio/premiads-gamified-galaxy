
import { useEffect, useState } from "react";
import { NavigateFunction } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useSounds } from "@/hooks/use-sounds";
import { useUserProfile } from "./user/useUserProfile";
import { useUserPoints } from "./user/useUserPoints";
import { useUserSession } from "./user/useUserSession";
import { Profile } from "@/types";

export const useClientDashboard = (navigate?: NavigateFunction) => {
  const { userName, userType, setUserName } = useUser();
  const { playSound } = useSounds();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  const {
    profileData,
    setProfileData,
    loading,
    setLoading,
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
    authError,
    setAuthError,
    fetchAttempts,
    setFetchAttempts,
    handleExtendSession,
    handleSessionTimeout
  } = useUserSession();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
    }

    // Fetch user data from Supabase with retry logic
    const fetchUserData = async () => {
      console.log("Fetching user data, attempt:", fetchAttempts + 1);
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuthError("Erro ao verificar sua sessão. Por favor, faça login novamente.");
          setLoading(false);
          return false;
        }
        
        if (!session) {
          console.log("No active session found");
          setPoints(0);
          setCredits(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          
          if (fetchAttempts >= 2) {
            setAuthError("Sessão não encontrada. Por favor, faça login novamente.");
          }
          return false;
        }
        
        const userId = session.user.id;
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) {
          if (profileError.code === 'PGRST116' && !retrying) {
            setRetrying(true);
            const newProfile = await createUserProfile(userId, session.user.user_metadata);
            
            if (newProfile) {
              // Make sure we properly type cast the profile data
              setProfileData(newProfile as Profile);
              setPoints(0);
              setCredits(0);
              setIsProfileCompleted(false);
              
              if (newProfile.full_name && !userName) {
                setUserName(newProfile.full_name);
              }
              
              localStorage.setItem("lastActivity", Date.now().toString());
              setLoading(false);
              playSound("chime");
              return true;
            }
          } else {
            setPoints(0);
            setCredits(0);
            setStreak(0);
            setIsProfileCompleted(false);
            setLoading(false);
            
            if (fetchAttempts >= 2) {
              setAuthError("Problema ao carregar seu perfil. Por favor, recarregue a página.");
            }
            return false;
          }
        } else if (profileData) {
          // Convert string user_type to the proper enum type for Profile
          const typedProfile: Profile = {
            ...profileData,
            user_type: (profileData.user_type || "participante") as "participante" | "anunciante" | "admin"
          };
          
          setProfileData(typedProfile);
          setPoints(profileData.points || 0);
          setCredits(profileData.credits !== null ? profileData.credits : profileData.points || 0);
          setIsProfileCompleted(profileData.profile_completed || false);
          
          if (profileData.full_name && !userName) {
            setUserName(profileData.full_name);
          }
        }
        
        setStreak(0);
        localStorage.setItem("lastActivity", Date.now().toString());
        setLoading(false);
        playSound("chime");
        checkInactivity();
        
        return true;
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (fetchAttempts >= 2) {
          setAuthError("Erro ao buscar seus dados. Por favor, tente novamente.");
        }
        setLoading(false);
        return false;
      }
    };

    if (fetchAttempts < 3) {
      const timeout = setTimeout(() => {
        fetchUserData().then(success => {
          if (!success && fetchAttempts < 2) {
            setFetchAttempts(prev => prev + 1);
          }
        });
      }, fetchAttempts * 1000);
      
      return () => clearTimeout(timeout);
    } else if (loading) {
      setLoading(false);
      setAuthError("Não foi possível carregar seus dados após várias tentativas. Por favor, recarregue a página.");
    }
  }, [fetchAttempts, retrying, userName, setUserName, playSound, setPoints, setCredits, setStreak, setAuthError, 
      setIsProfileCompleted, setFetchAttempts, setLoading, setProfileData, loading, checkInactivity, 
      createUserProfile, fetchAttempts, playSound, points, setUserName, userName]);

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
