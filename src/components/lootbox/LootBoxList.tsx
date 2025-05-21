
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Award, Coins, Calendar, Gift, TrendingUp, Repeat, Ticket } from "lucide-react";
import { LootBoxReveal, LootBoxReward } from "./LootBoxReveal";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LootBoxListProps {
  lootBoxes: LootBoxReward[];
  onLootBoxClaimed?: (id: string) => void;
  refreshData?: () => void;
}

export const LootBoxList: React.FC<LootBoxListProps> = ({ 
  lootBoxes,
  onLootBoxClaimed,
  refreshData
}) => {
  const [selectedReward, setSelectedReward] = useState<LootBoxReward | null>(null);
  const { toast } = useToast();

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'credit_bonus':
        return <Coins className="h-5 w-5 text-yellow-500" />;
      case 'random_badge':
        return <Award className="h-5 w-5 text-purple-500" />;
      case 'multiplier':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'level_up':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'daily_streak_bonus':
        return <Repeat className="h-5 w-5 text-orange-500" />;
      case 'raffle_ticket':
        return <Ticket className="h-5 w-5 text-pink-500" />;
      default:
        return <Gift className="h-5 w-5 text-neon-cyan" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  const handleClaimReward = async (rewardId: string) => {
    try {
      // Mark the reward as claimed
      const { error } = await supabase
        .from('loot_box_rewards')
        .update({ is_claimed: true })
        .eq('id', rewardId);
      
      if (error) throw error;
      
      // Call the callback if provided
      if (onLootBoxClaimed) {
        onLootBoxClaimed(rewardId);
      }
      
      // Refresh data if needed
      if (refreshData) {
        refreshData();
      }
      
      toast({
        title: "Recompensa coletada!",
        description: "Sua recompensa foi coletada com sucesso.",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Erro ao coletar recompensa",
        description: error.message || "Ocorreu um erro ao tentar coletar a recompensa",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  if (lootBoxes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Gift className="w-16 h-16 text-gray-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Nenhuma Loot Box encontrada</h3>
        <p className="text-gray-400 max-w-md">
          Complete missões que oferecem Loot Boxes como recompensa para ganhar itens especiais e bônus!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lootBoxes.map((reward, index) => (
        <motion.div
          key={reward.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-gray-800 bg-gray-900/50 hover:bg-gray-900/70 transition-colors cursor-pointer h-full"
                onClick={() => setSelectedReward(reward)}>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                {getRewardIcon(reward.reward_type)}
                {reward.display_name || "Recompensa Misteriosa"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-2">
              <p className="text-sm text-gray-400">
                {reward.description || "Clique para revelar sua recompensa!"}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(reward.awarded_at)}</span>
                </div>
                
                {reward.is_claimed && (
                  <span className="text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full text-[10px]">
                    Coletado
                  </span>
                )}
                
                {!reward.is_claimed && (
                  <span className="text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full text-[10px]">
                    Pendente
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {selectedReward && (
        <LootBoxReveal 
          reward={selectedReward}
          isOpen={!!selectedReward}
          onClose={() => setSelectedReward(null)}
          onClaim={selectedReward.is_claimed ? undefined : handleClaimReward}
        />
      )}
    </div>
  );
};

export default LootBoxList;
