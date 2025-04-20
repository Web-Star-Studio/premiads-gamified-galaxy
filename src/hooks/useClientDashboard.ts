
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
    // Check if onboarding has been completed
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (!onboardingComplete) {
      // Only show after loading finishes
      setTimeout(() => {
        setShowOnboarding(true);
      }, 2000);
    }

    // Fetch user data from Supabase
    const fetchUserData = async () => {
      try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.log("Session error or no session - using test data");
          // Use test data for demo mode
          setPoints(1500);
          setCredits(1500); // Set credits equal to points for the 1:1 conversion
          setStreak(3);
          setIsProfileCompleted(false);
          setLoading(false);
          playSound("chime");
          return;
        }
        
        const userId = session.user.id;
        
        if (!userId) {
          console.log("No authenticated user found - using test data");
          // Use test data for non-authenticated users
          setPoints(1500);
          setCredits(1500); // Set credits equal to points for the 1:1 conversion
          setStreak(3);
          setIsProfileCompleted(false);
          setLoading(false);
          playSound("chime");
          return;
        }
        
        console.log("Fetching user data for:", userId);
        
        // Get user profile with points
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) {
          console.error("Profile error:", profileError);
          // Still use test data instead of throwing error
          setPoints(1500);
          setCredits(1500); // Set credits equal to points for the 1:1 conversion
          setStreak(3);
          setIsProfileCompleted(false);
          setLoading(false);
          playSound("chime");
          return;
        }
        
        if (profileData) {
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
        
        // For streak, we would ideally have a user_activity table
        // For now, let's use a placeholder value
        setStreak(3);
        
        // Update last activity
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        // For testing, don't redirect on error and still show data
        setPoints(1500);
        setCredits(1500); // Set credits equal to points for the 1:1 conversion
        setStreak(3);
        setIsProfileCompleted(false);
      } finally {
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
      }
    };

    // Simulate loading
    setTimeout(() => {
      fetchUserData();
    }, 1500);
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
