
import { useState, useEffect, useCallback } from "react";
import { NavigateFunction } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

export const useClientDashboard = (navigate?: NavigateFunction) => {
  const { userName, userType, setUserName } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [points, setPoints] = useState(0);
  const [credits, setCredits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [fetchAttempts, setFetchAttempts] = useState(0);
  const [retrying, setRetrying] = useState(false);

  // Create profile function that we can reuse
  const createUserProfile = useCallback(async (userId: string, userData: any) => {
    try {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: userData?.full_name || userName,
          points: 0,
          credits: 0,
          profile_completed: false
        });
        
      if (insertError) {
        console.error("Failed to create profile:", insertError);
        return null;
      }
      
      return {
        id: userId,
        full_name: userData?.full_name || userName,
        points: 0,
        credits: 0,
        profile_completed: false
      };
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      return null;
    }
  }, [userName]);

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      // Only show after loading finishes
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
    }

    // Fetch user data from Supabase with retry logic
    const fetchUserData = async () => {
      console.log("Fetching user data, attempt:", fetchAttempts + 1);
      
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuthError("Erro ao verificar sua sessão. Por favor, faça login novamente.");
          setLoading(false);
          return false;
        }
        
        if (!session) {
          console.log("No active session found");
          // Use default values for demo
          setPoints(0);
          setCredits(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          
          // If we need strict auth checking, set auth error
          if (fetchAttempts >= 2) {
            setAuthError("Sessão não encontrada. Por favor, faça login novamente.");
          }
          return false;
        }
        
        const userId = session.user.id;
        console.log("Fetching user data for:", userId);
        
        // Try to get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) {
          console.error("Profile error:", profileError);
          
          // If profile doesn't exist yet, create one
          if (profileError.code === 'PGRST116' && !retrying) {
            console.log("Profile not found, creating new profile");
            setRetrying(true);
            
            // Create a new profile
            const newProfile = await createUserProfile(userId, session.user.user_metadata);
            
            if (newProfile) {
              // Use values from new profile
              setProfileData(newProfile);
              setPoints(0);
              setCredits(0);
              setIsProfileCompleted(false);
              
              if (newProfile.full_name && !userName) {
                setUserName(newProfile.full_name);
              }
              
              // Update last activity
              localStorage.setItem("lastActivity", Date.now().toString());
              setLoading(false);
              playSound("chime");
              return true;
            }
          } else {
            // For other profile errors, we still show the dashboard with default values
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
          setProfileData(profileData);
          setPoints(profileData.points || 0);
          // If credits exist in the database, use them, otherwise use points (1:1 conversion)
          setCredits(profileData.credits !== null ? profileData.credits : profileData.points || 0);
          setIsProfileCompleted(profileData.profile_completed || false);
          
          // Update username if available in the profile
          if (profileData.full_name && !userName) {
            setUserName(profileData.full_name);
          }
          
          console.log("User points:", profileData.points);
          console.log("User credits:", profileData.credits);
          console.log("Profile completed:", profileData.profile_completed);
        }
        
        // For streak, set a default value of 0 for now
        setStreak(0);
        
        // Update last activity
        localStorage.setItem("lastActivity", Date.now().toString());
        setLoading(false);
        playSound("chime");
        
        // Check if user has been inactive
        const lastActivity = localStorage.getItem("lastActivity");
        if (lastActivity && Date.now() - parseInt(lastActivity) > 86400000) {
          toast({
            title: "Streak em risco!",
            description: "Você está há mais de 24h sem atividade. Complete uma missão hoje!",
          });
        }
        
        return true;
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        
        if (fetchAttempts >= 2) {
          setAuthError("Erro ao buscar seus dados. Por favor, tente novamente.");
        }
        
        setLoading(false);
        return false;
      }
    };

    // Implement backoff retry logic
    if (fetchAttempts < 3) {
      // Set a timeout with increasing delay before each retry
      const timeout = setTimeout(() => {
        fetchUserData().then(success => {
          if (!success && fetchAttempts < 2) {
            setFetchAttempts(prev => prev + 1);
          }
        }).catch(err => {
          console.error("Failed to fetch user data:", err);
          setLoading(false);
          if (fetchAttempts >= 2) {
            setAuthError("Erro ao carregar seus dados. Por favor, recarregue a página.");
          }
        });
      }, fetchAttempts * 1000); // Increasing delay for each retry
      
      return () => clearTimeout(timeout);
    } else if (loading) {
      // After 3 attempts, if still loading, stop and show error
      setLoading(false);
      setAuthError("Não foi possível carregar seus dados após várias tentativas. Por favor, recarregue a página.");
    }
  }, [userType, navigate, toast, playSound, userName, setUserName, fetchAttempts, retrying, createUserProfile]);

  const handleExtendSession = () => {
    toast({
      title: "Sessão estendida",
      description: "Sua sessão foi estendida com sucesso.",
    });
  };

  const handleSessionTimeout = () => {
    toast({
      title: "Sessão expirada",
      description: "Você foi desconectado devido à inatividade.",
      variant: "destructive",
    });
    
    // In a real app, this would log the user out
    if (navigate) {
      navigate("/");
    }
  };

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
