
import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Calendar, PiggyBank, Sparkles, ZapIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { LootBoxReward, LootBoxReveal } from "./LootBoxReveal";
import { supabase } from "@/integrations/supabase/client";
import { useRewardAnimations } from "@/utils/rewardAnimations";

interface LootBoxListProps {
  lootBoxes: LootBoxReward[];
  onLootBoxClaimed?: (rewardId: string) => void;
  refreshData?: () => void;
}

export const LootBoxList: React.FC<LootBoxListProps> = ({ 
  lootBoxes, 
  onLootBoxClaimed,
  refreshData
}) => {
  const [selectedLootBox, setSelectedLootBox] = useState<LootBoxReward | null>(null);
  const [showingReward, setShowingReward] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const { showRewardNotification } = useRewardAnimations();

  const handleOpenLootBox = (lootBox: LootBoxReward) => {
    setSelectedLootBox(lootBox);
    setShowingReward(true);
    playSound("success");
  };

  const handleClaimReward = async (rewardId: string) => {
    try {
      if (claimingReward) return; // Prevent double-clicking
      setClaimingReward(true);
      
      // Call the RPC function to claim the reward
      const { data, error } = await supabase
        .rpc('claim_loot_box_reward', { p_loot_box_id: rewardId });
        
      if (error) throw error;
      
      if (!data.success) {
        if (data.code === 'ALREADY_CLAIMED') {
          toast({
            title: "Recompensa já reivindicada",
            description: "Esta recompensa já foi reivindicada anteriormente.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.message || 'Não foi possível reivindicar a recompensa');
        }
        setClaimingReward(false);
        return;
      }
      
      // Show notification with details of what changed
      let notificationTitle = "Recompensa recebida!";
      let notificationDescription = "";
      
      if (data.points_difference > 0) {
        notificationDescription = `Você recebeu ${data.points_difference} pontos de experiência!`;
      } else if (data.credits_difference > 0) {
        notificationDescription = `Você recebeu ${data.credits_difference} créditos!`;
      } else {
        notificationDescription = "A recompensa foi adicionada à sua conta.";
      }
      
      // Call the callback if provided to update local state
      if (onLootBoxClaimed) {
        onLootBoxClaimed(rewardId);
      }
      
      // Refresh data if needed
      if (refreshData) {
        refreshData();
      }
      
      playSound("reward");
      
      toast({
        title: notificationTitle,
        description: notificationDescription,
        variant: "default",
        className: "bg-gradient-to-br from-purple-600/90 to-neon-pink/60 text-white border-neon-cyan"
      });
      
      // Show reward notification with animation based on reward type
      if (selectedLootBox) {
        showRewardNotification({
          points: data.points_difference || 0,
          loot_box_reward: selectedLootBox.reward_type,
          loot_box_amount: selectedLootBox.reward_amount,
          loot_box_display_name: selectedLootBox.display_name,
          loot_box_description: notificationDescription
        });
      }
      
      // Close dialog after a short delay
      setTimeout(() => {
        setSelectedLootBox(null);
        setClaimingReward(false);
      }, 1500);
      
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      toast({
        title: "Erro ao receber recompensa",
        description: err.message || "Ocorreu um erro ao receber sua recompensa",
        variant: "destructive",
      });
      setClaimingReward(false);
    }
  };

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'credit_bonus':
        return <Sparkles className="h-5 w-5 text-yellow-400" />;
      case 'multiplier':
        return <PiggyBank className="h-5 w-5 text-green-400" />;
      case 'level_up':
        return <ZapIcon className="h-5 w-5 text-neon-pink" />;
      default:
        return <Gift className="h-5 w-5 text-neon-cyan" />;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lootBoxes.map((lootBox) => (
          <motion.div 
            key={lootBox.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => !lootBox.is_claimed && handleOpenLootBox(lootBox)}
            className={lootBox.is_claimed ? "cursor-default" : "cursor-pointer"}
          >
            <Card className={`border-galaxy-purple/30 bg-galaxy-deepPurple/20 transition-all duration-300 overflow-hidden ${!lootBox.is_claimed ? "hover:bg-galaxy-deepPurple/40" : "opacity-80"}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 rounded-full bg-galaxy-purple/20 flex items-center justify-center">
                    {lootBox.is_claimed ? (
                      getRewardIcon(lootBox.reward_type)
                    ) : (
                      <Gift className="h-8 w-8 text-neon-cyan" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate">
                      {lootBox.is_claimed 
                        ? (lootBox.display_name || lootBox.reward_type) 
                        : "Loot Box"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 truncate">
                      {lootBox.is_claimed 
                        ? (lootBox.description || `Recompensa: ${lootBox.reward_type}`)
                        : `Da missão "${lootBox.missions?.title || 'Desconhecida'}"`}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(lootBox.awarded_at).toLocaleDateString('pt-BR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      {lootBox.is_claimed && (
                        <span className="ml-1 px-1.5 py-0.5 text-xs bg-green-500/20 text-green-300 rounded-sm">
                          Reivindicada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* LootBox Reveal Dialog */}
      <LootBoxReveal 
        isOpen={!!selectedLootBox && !claimingReward}
        onClose={() => setSelectedLootBox(null)}
        reward={selectedLootBox}
        onClaim={handleClaimReward}
        isClaimingReward={claimingReward}
      />
    </>
  );
};

export default LootBoxList;
