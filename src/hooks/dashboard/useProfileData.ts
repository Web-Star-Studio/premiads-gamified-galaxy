
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
  const [points, setPoints] = useState(0);
  const [credits, setCredits] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [userName, setUserName, playSound, toast]);

  return {
    loading,
    points,
    credits,
    streak,
    isProfileCompleted,
    profileData,
    authError
  };
};
