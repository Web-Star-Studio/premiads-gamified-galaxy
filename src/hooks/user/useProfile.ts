
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let targetUserId = userId;
        
        if (!targetUserId) {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.user) {
            throw new Error("No authenticated user");
          }
          targetUserId = session.user.id;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", targetUserId)
          .single();

        if (error) throw error;

        setProfile(data as Profile);
      } catch (e) {
        setError(e as Error);
        console.error("Error fetching profile:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
};
