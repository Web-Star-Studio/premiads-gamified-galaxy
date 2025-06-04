
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

export const useProfileData = () => {
  const { userName, setUserName } = useUser();
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rifas, setRifas] = useState(0);
  const [cashback, setCashback] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setRifas(0);
          setCashback(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        const userId = session.user.id;
        
        if (!userId) {
          setRifas(0);
          setCashback(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (profileError) {
          console.error("Profile error:", profileError);
          setRifas(0);
          setCashback(0);
          setStreak(0);
          setIsProfileCompleted(false);
          setLoading(false);
          return;
        }
        
        if (profileData) {
          setProfileData(profileData);
          setRifas(profileData.rifas || 0);
          setCashback(profileData.cashback_balance || 0);
          setIsProfileCompleted(profileData.profile_completed || false);
          
          if (profileData.full_name && !userName) {
            setUserName(profileData.full_name);
          }
        }
        
        setStreak(0);
        localStorage.setItem("lastActivity", Date.now().toString());
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        setRifas(0);
        setCashback(0);
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
  }, [userName, setUserName, playSound, toast]);

  return {
    loading,
    points: rifas, // Alias for compatibility
    credits: cashback, // Alias for compatibility  
    rifas,
    cashback,
    streak,
    isProfileCompleted,
    profileData,
    authError
  };
};
