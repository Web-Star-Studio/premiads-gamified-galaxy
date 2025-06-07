
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Definir interface baseada em dados reais disponíveis
export interface LootBoxReward {
  id: string;
  user_id: string;
  mission_id: string;
  reward_type: string;
  reward_amount: number;
  description: string;
  display_name: string;
  awarded_at: string;
  created_at: string;
  missions?: {
    title: string;
  };
  is_claimed: boolean;
}

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
      // Como a tabela loot_box_rewards não existe, vamos simular dados vazios
      // ou buscar de mission_rewards se necessário
      const { data, error } = await supabase
        .from("mission_rewards")
        .select("*, missions(title)")
        .eq("user_id", userId)
        .order("rewarded_at", { ascending: false });

      if (error) throw error;

      // Converter dados de mission_rewards para formato LootBoxReward
      const formattedData = data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        mission_id: item.mission_id,
        reward_type: 'mission_completion',
        reward_amount: item.rifas_earned || 0,
        description: `Recompensa por completar missão`,
        display_name: `Rifas Ganhas`,
        awarded_at: item.rewarded_at,
        created_at: item.rewarded_at,
        missions: item.missions,
        is_claimed: true // Todas as recompensas de missão são automaticamente "claimed"
      })) || [];

      setLootBoxes(formattedData);
    } catch (err: any) {
      console.error("Error fetching loot box rewards:", err);
      toast({
        title: "Erro ao carregar recompensas",
        description: err.message || "Ocorreu um erro ao buscar as recompensas",
        variant: "destructive",
      });
      // Em caso de erro, definir array vazio ao invés de falhar
      setLootBoxes([]);
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
