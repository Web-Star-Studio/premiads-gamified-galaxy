
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSounds } from "@/hooks/use-sounds";
import { useAuth } from "@/context/AuthContext";
import { UserProfile, UserType } from "@/types/auth";

export const useFetchUserData = () => {
  const { playSound } = useSounds();
  const { refreshProfile } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchAttempts, setFetchAttempts] = useState(0);

  const fetchUserData = async () => {
    console.log("Fetching user data, attempt:", fetchAttempts + 1);
    
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        setAuthError("Error checking your session. Please log in again.");
        setLoading(false);
        return false;
      }
      
      if (!session) {
        console.log("No active session found");
        if (fetchAttempts >= 2) {
          setAuthError("No session found. Please log in again.");
        }
        setLoading(false);
        return false;
      }
      
      const userId = session.user.id;
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Profile error:", profileError);
        if (fetchAttempts >= 2) {
          setAuthError("Problem loading your profile. Please reload the page.");
        }
        setLoading(false);
        return false;
      }
      
      if (profileData) {
        // Make sure to update the auth context
        await refreshProfile();
        
        // Cast the profile data to our UserProfile type
        const typedProfile: UserProfile = {
          id: profileData.id,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          website: profileData.website,
          user_type: profileData.user_type as UserType,
          points: profileData.points || 0,
          credits: profileData.credits || 0,
          profile_completed: profileData.profile_completed || false,
          email_notifications: profileData.email_notifications || false,
          push_notifications: profileData.push_notifications || false,
          description: profileData.description,
          phone: profileData.phone,
          profile_data: typeof profileData.profile_data === 'object' ? profileData.profile_data : {},
          created_at: profileData.created_at,
          updated_at: profileData.updated_at
        };
        
        localStorage.setItem("lastActivity", Date.now().toString());
        setLoading(false);
        playSound("chime");
        return { success: true, profile: typedProfile };
      }
      
      setLoading(false);
      return false;
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (fetchAttempts >= 2) {
        setAuthError("Error fetching your data. Please try again.");
      }
      setLoading(false);
      return false;
    }
  };

  return {
    fetchUserData,
    authError,
    setAuthError,
    loading,
    setLoading,
    fetchAttempts,
    setFetchAttempts
  };
};
