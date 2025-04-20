
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
  const [fetchAttempts, setFetchAttempts] = useState(0);

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
      console.log("Fetching user data, attempt:", fetchAttempts + 1);
      
      try {
        // Check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuthError("Erro ao verificar sua sessão. Por favor, faça login novamente.");
          setLoading(false);
          return;
        }
        
        if (!session) {
          console.log("No active session found");
          // Still show the dashboard with mock data for demo purposes
          setPoints(0);
          setCredits(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          
          // If we're not in a demo mode and need strict auth, uncomment below
          // setAuthError("Sessão expirada. Por favor, faça login novamente.");
          return;
        }
        
        const userId = session.user.id;
        console.log("Fetching user data for:", userId);
        
        // Get user profile with points
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) {
          console.error("Profile error:", profileError);
          
          // If profile doesn't exist yet, we can create one
          if (profileError.code === 'PGRST116') {
            try {
              // Create a new profile
              const { error: insertError } = await supabase
                .from("profiles")
                .insert({
                  id: userId,
                  full_name: session.user.user_metadata?.full_name || userName,
                  points: 0,
                  credits: 0,
                  profile_completed: false
                });
                
              if (insertError) throw insertError;
              
              // Use default values
              setPoints(0);
              setCredits(0);
              setIsProfileCompleted(false);
              setProfileData({
                id: userId,
                full_name: session.user.user_metadata?.full_name || userName,
                points: 0,
                credits: 0,
                profile_completed: false
              });
            } catch (error) {
              console.error("Failed to create profile:", error);
              setAuthError("Falha ao criar seu perfil. Por favor, tente novamente.");
            }
          } else {
            // For other profile errors, we still show the dashboard with mock data
            setPoints(0);
            setCredits(0);
            setStreak(0);
            setIsProfileCompleted(false);
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
        
        // For streak, we would ideally have a user_activity table
        // For now, let's set a default value of 0
        setStreak(0);
        
        // Update last activity
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setAuthError("Erro ao buscar seus dados. Por favor, tente novamente.");
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

    if (fetchAttempts < 3) {
      // Set a short timeout before fetching to allow auth to initialize
      setTimeout(() => {
        fetchUserData().catch(err => {
          console.error("Failed to fetch user data:", err);
          setLoading(false);
          setAuthError("Erro ao carregar seus dados. Por favor, recarregue a página.");
        });
      }, fetchAttempts * 1000); // Increasing delay for each retry
      
      setFetchAttempts(prev => prev + 1);
    } else if (loading) {
      // After 3 attempts, if still loading, stop and show error
      setLoading(false);
      setAuthError("Não foi possível carregar seus dados após várias tentativas. Por favor, recarregue a página.");
    }
  }, [userType, navigate, toast, playSound, userName, setUserName, fetchAttempts]);

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
