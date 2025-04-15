
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";

export const useClientDashboard = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Redirect if user is not a participant
    if (userType !== "participante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

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
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        
        // Get user profile with points
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("points")
          .eq("id", userId)
          .single();
        
        if (profileError) throw profileError;
        
        if (profileData) {
          setPoints(profileData.points || 0);
        }
        
        // For streak, we would ideally have a user_activity table
        // For now, let's use a placeholder value
        setStreak(3);
        
        // Update last activity
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (error) {
        console.error("Error fetching user data:", error);
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

  }, [userType, navigate, toast, playSound]);

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
    navigate("/");
  };

  return {
    userName,
    points,
    streak,
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout
  };
};
