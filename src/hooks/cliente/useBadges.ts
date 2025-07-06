
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Badge {
  id: string;
  user_id: string;
  mission_id: string;
  badge_name: string;
  badge_description?: string;
  badge_image_url?: string;
  earned_at: string;
}

export const useBadges = (userId?: string | null) => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBadges = async () => {
    if (!userId) {
      setBadges([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error) throw error;

      setBadges(data || []);
    } catch (err: any) {
      console.error("Error fetching badges:", err);
      toast({
        title: "Erro ao carregar badges",
        description: err.message || "Ocorreu um erro ao buscar as badges",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    badges,
    loading,
    refreshBadges: fetchBadges
  };
};

export default useBadges;
