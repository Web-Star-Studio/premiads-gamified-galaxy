
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LootBoxReward } from "@/components/lootbox/LootBoxReveal";

export const useLootBoxRewards = (userId?: string | null) => {
  const [lootBoxes, setLootBoxes] = useState<LootBoxReward[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchLootBoxes = async () => {
    if (!userId) {
      setLootBoxes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("loot_box_rewards")
        .select("*")
        .eq("user_id", userId)
        .order("awarded_at", { ascending: false });

      if (error) throw error;

      setLootBoxes(data || []);
    } catch (err: any) {
      console.error("Error fetching loot box rewards:", err);
      toast({
        title: "Erro ao carregar recompensas",
        description: err.message || "Ocorreu um erro ao buscar as recompensas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLootBoxes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const markLootBoxAsClaimed = (rewardId: string) => {
    setLootBoxes(prevLootBoxes =>
      prevLootBoxes.map(box => 
        box.id === rewardId ? { ...box, is_claimed: true } : box
      )
    );
  };

  return {
    lootBoxes,
    loading,
    refreshLootBoxes: fetchLootBoxes,
    markLootBoxAsClaimed
  };
};
