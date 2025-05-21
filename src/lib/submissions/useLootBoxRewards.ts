
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
        .select("*, missions(title)")
        .eq("user_id", userId)
        .order("awarded_at", { ascending: false });

      if (error) throw error;

      // Convert the data to LootBoxReward format
      const formattedData = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        mission_id: item.mission_id,
        reward_type: item.reward_type,
        reward_amount: item.reward_amount,
        description: item.description,
        display_name: item.display_name,
        awarded_at: item.awarded_at,
        created_at: item.created_at,
        missions: item.missions,
        is_claimed: item.is_claimed || false
      })) || [];

      setLootBoxes(formattedData);
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
