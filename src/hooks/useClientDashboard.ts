
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";

export const useClientDashboard = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
      // Play welcome sound when dashboard loads
      playSound("chime");
      
      // Check if user has been inactive
      const lastActivity = localStorage.getItem("lastActivity");
      if (lastActivity && Date.now() - parseInt(lastActivity) > 86400000) {
        toast({
          title: "Streak em risco!",
          description: "Você está há mais de 24h sem atividade. Complete uma missão hoje!",
        });
      }
      
      // Update last activity
      localStorage.setItem("lastActivity", Date.now().toString());
    }, 1500);

    return () => clearTimeout(loadTimer);
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
    loading,
    showOnboarding,
    setShowOnboarding,
    handleExtendSession,
    handleSessionTimeout
  };
};
