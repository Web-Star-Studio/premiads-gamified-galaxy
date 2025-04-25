import { useState, useEffect } from "react";
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

  useEffect(() => {
    // Check if onboarding has been completed immediately
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      setShowOnboarding(true);
    }

    // Fetch user data from Supabase without artificial delays
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setPoints(0);
          setCredits(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        const userId = session.user.id;
        
        if (!userId) {
          setPoints(0);
          setCredits(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        // Get user profile with points - removed timeout
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) {
          console.error("Profile error:", profileError);
          setPoints(0);
          setCredits(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        if (profileData) {
          setProfileData(profileData);
          setPoints(profileData.points || 0);
          setCredits(profileData.credits !== null ? profileData.credits : profileData.points || 0);
          setIsProfileCompleted(profileData.profile_completed || false);
          
          if (profileData.full_name && !userName) {
            setUserName(profileData.full_name);
          }
        }
        
        setStreak(0);
        
        // Update last activity without delay
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setPoints(0);
        setCredits(0);
        setStreak(0);
        setIsProfileCompleted(false);
      } finally {
        setLoading(false);
        playSound("chime");
        
        const lastActivity = localStorage.getItem("lastActivity");
        if (lastActivity && Date.now() - parseInt(lastActivity) > 86400000) {
          toast({
            title: "Streak em risco!",
            description: "Você está há mais de 24h sem atividade. Complete uma missão hoje!",
          });
        }
      }
    };

    fetchUserData();
  }, [userType, navigate, toast, playSound, userName, setUserName]);

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
    // For this demo, we'll just redirect to home
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
