
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSessionCheck = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          setUser(null);
          return;
        }
        
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error in session check:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return { user, setUser, loading, setLoading };
};
