import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserBadges, BadgeRecord } from '@/lib/services/badges'

export type Badge = BadgeRecord

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
      const badgeList = await getUserBadges({ userId })
      setBadges(badgeList)
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
