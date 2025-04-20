
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Profile } from "@/types";

export const useUserProfile = (userId?: string) => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);

  const createUserProfile = useCallback(async (userId: string, userData: any) => {
    try {
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: userData?.full_name,
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
        full_name: userData?.full_name,
        points: 0,
        credits: 0,
        profile_completed: false
      };
    } catch (error) {
      console.error("Error in createUserProfile:", error);
      return null;
    }
  }, []);

  return {
    profileData,
    setProfileData,
    loading,
    setLoading,
    retrying,
    setRetrying,
    isProfileCompleted,
    setIsProfileCompleted,
    createUserProfile
  };
};
