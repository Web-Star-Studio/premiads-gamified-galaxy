
import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Calendar, PiggyBank, Sparkles, ZapIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { LootBoxReward, LootBoxReveal } from "./LootBoxReveal";
import { supabase } from "@/integrations/supabase/client";

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
  const { playSound } = useSounds();
  const { toast } = useToast();

  const handleOpenLootBox = (lootBox: LootBoxReward) => {
    setSelectedLootBox(lootBox);
    setShowingReward(true);
    playSound("success");
  };

  const handleClaimReward = async (rewardId: string) => {
    try {
      // Update the loot box as claimed in the database
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
      
      playSound("reward");
      
      toast({
        title: "Recompensa recebida!",
        description: "A recompensa foi adicionada à sua conta.",
        variant: "default",
        className: "bg-gradient-to-br from-purple-600/90 to-neon-pink/60 text-white border-neon-cyan"
      });
      
      // Close dialog
      setSelectedLootBox(null);
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      toast({
        title: "Erro ao receber recompensa",
        description: err.message || "Ocorreu um erro ao receber sua recompensa",
        variant: "destructive",
      });
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
            onClick={() => handleOpenLootBox(lootBox)}
            className="cursor-pointer"
          >
            <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20 hover:bg-galaxy-deepPurple/40 transition-all duration-300 overflow-hidden">
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
        isOpen={!!selectedLootBox}
        onClose={() => setSelectedLootBox(null)}
        reward={selectedLootBox}
        onClaim={handleClaimReward}
      />
    </>
  );
};

export default LootBoxList;
