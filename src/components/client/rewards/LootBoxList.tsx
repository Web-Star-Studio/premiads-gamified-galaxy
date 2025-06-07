import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Calendar, PiggyBank, Sparkles, ZapIcon } from "lucide-react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useRewardAnimations } from "@/utils/rewardAnimations";
import { useUserCredits } from "@/hooks/useUserCredits";

interface LootBox {
  id: string;
  reward_type: string;
  reward_amount: number;
  awarded_at: string;
  mission_id: string;
  missions: {
    title: string;
  };
  is_claimed?: boolean;
}

interface LootBoxListProps {
  lootBoxes: LootBox[];
}

const LOOTBOX_ANIMATIONS: Record<string, string> = {
  default: "https://assets2.lottiefiles.com/packages/lf20_iojqkbz4.json",
  xp_bonus: "https://assets5.lottiefiles.com/packages/lf20_rkfesiwm.json",
  credit_bonus: "https://assets5.lottiefiles.com/packages/lf20_rkfesiwm.json",
  token_multiplier: "https://assets2.lottiefiles.com/packages/lf20_npi0slet.json",
  multiplier: "https://assets2.lottiefiles.com/packages/lf20_npi0slet.json",
  instant_level_up: "https://assets3.lottiefiles.com/packages/lf20_zkgnnlia.json",
  level_up: "https://assets3.lottiefiles.com/packages/lf20_zkgnnlia.json",
  daily_streak_bonus: "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json",
  raffle_ticket: "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json",
  random_badge: "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json",
};

const LootBoxList: React.FC<LootBoxListProps> = ({ lootBoxes }) => {
  const [selectedLootBox, setSelectedLootBox] = useState<LootBox | null>(null);
  const [openedBoxes, setOpenedBoxes] = useState<Record<string, boolean>>({});
  const [showingReward, setShowingReward] = useState(false);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const { refreshCredits } = useUserCredits();
  const { showRewardNotification } = useRewardAnimations();

  const handleOpenLootBox = (lootBox: LootBox) => {
    setSelectedLootBox(lootBox);
    setShowingReward(openedBoxes[lootBox.id] || false);
    playSound("success");
  };

  const handleRevealReward = () => {
    if (!selectedLootBox) return;
    
    playSound("reward");
    
    // Mark this box as opened
    setOpenedBoxes(prev => ({
      ...prev,
      [selectedLootBox.id]: true
    }));
    
    // Show the reward after a short delay
    setTimeout(() => {
      setShowingReward(true);
    }, 1500);
  };

  const handleClaimReward = async () => {
    if (!selectedLootBox || isClaimingReward) return;
    
    setIsClaimingReward(true);
    
    try {
      // Fixed: Use existing function instead of non-existent 'claim_loot_box_reward'
      // Use add_points_to_user which exists in the database functions
      const { data, error } = await supabase
        .rpc('add_points_to_user', { 
          p_user_id: (await supabase.auth.getUser()).data.user?.id,
          p_points_to_add: selectedLootBox.reward_amount 
        });
        
      if (error) throw error;
      
      // Mark this loot box as claimed in our local state
      setOpenedBoxes(prev => ({
        ...prev,
        [selectedLootBox.id]: true
      }));
      
      // Play a celebratory sound
      playSound("reward");
      
      // Show a descriptive toast with the reward details
      const description = getRewardDescription(selectedLootBox);
      
      toast({
        title: "Recompensa Recebida!",
        description,
        variant: "default",
        className: "bg-gradient-to-br from-purple-600/90 to-neon-pink/60 text-white border-neon-cyan"
      });
      
      // Show reward notification with animation
      showRewardNotification({
        points: selectedLootBox.reward_amount || 0,
        loot_box_reward: selectedLootBox.reward_type,
        loot_box_amount: selectedLootBox.reward_amount,
        loot_box_display_name: getRewardLabel(selectedLootBox.reward_type),
        loot_box_description: description
      });
      
      // Refresh user credits to show updated balance
      refreshCredits();
      
      // Close dialog after a short delay
      setTimeout(() => {
        setSelectedLootBox(null);
        setIsClaimingReward(false);
      }, 1500);
      
    } catch (err: any) {
      console.error("Error claiming reward:", err);
      toast({
        title: "Erro ao receber recompensa",
        description: err.message || "Ocorreu um erro ao receber sua recompensa",
        variant: "destructive",
      });
      setIsClaimingReward(false);
    }
  };

  const getRewardDescription = (lootBox: LootBox): string => {
    switch (lootBox.reward_type) {
      case 'xp_bonus':
      case 'credit_bonus':
        return `Você ganhou ${lootBox.reward_amount} ${lootBox.reward_type === 'xp_bonus' ? 'tickets de experiência' : 'créditos'} extra!`;
      case 'token_multiplier':
      case 'multiplier':
        return `Multiplicador de ${lootBox.reward_type === 'token_multiplier' ? 'tokens' : 'créditos'}: ${lootBox.reward_amount}x!`;
      case 'instant_level_up':
      case 'level_up':
        return `Level up instantâneo com bônus de ${lootBox.reward_amount} tickets!`;
      case 'daily_streak_bonus':
        return `Sua sequência diária foi aumentada em ${lootBox.reward_amount}!`;
      case 'raffle_ticket':
        return `Você ganhou ${lootBox.reward_amount} tickets para o próximo sorteio!`;
      case 'random_badge':
        return `Você ganhou uma badge aleatória exclusiva!`;
      default:
        return `Recompensa: ${lootBox.reward_amount}`;
    }
  };

  const getRewardAnimation = (lootBox: LootBox): string => LOOTBOX_ANIMATIONS[lootBox.reward_type] || LOOTBOX_ANIMATIONS.default;

  const getRewardIcon = (rewardType: string) => {
    switch (rewardType) {
      case 'xp_bonus':
      case 'credit_bonus':
        return <Sparkles className="h-5 w-5 text-yellow-400" />;
      case 'token_multiplier':
      case 'multiplier':
        return <PiggyBank className="h-5 w-5 text-green-400" />;
      case 'instant_level_up':
      case 'level_up':
        return <ZapIcon className="h-5 w-5 text-neon-pink" />;
      default:
        return <Gift className="h-5 w-5 text-neon-cyan" />;
    }
  };

  const getRewardLabel = (rewardType: string): string => {
    switch (rewardType) {
      case 'xp_bonus':
      case 'credit_bonus':
        return 'Bônus de Créditos';
      case 'token_multiplier':
      case 'multiplier':
        return 'Multiplicador de Tokens';
      case 'instant_level_up':
      case 'level_up':
        return 'Level Up Instantâneo';
      case 'daily_streak_bonus':
        return 'Bônus de Sequência';
      case 'raffle_ticket':
        return 'Ticket de Sorteio';
      case 'random_badge':
        return 'Badge Aleatória';
      default:
        return 'Recompensa';
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
                    {openedBoxes[lootBox.id] || lootBox.is_claimed ? (
                      getRewardIcon(lootBox.reward_type)
                    ) : (
                      <Gift className="h-8 w-8 text-neon-cyan" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white truncate">
                      {openedBoxes[lootBox.id] || lootBox.is_claimed ? getRewardLabel(lootBox.reward_type) : "Loot Box"}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 truncate">
                      {openedBoxes[lootBox.id] || lootBox.is_claimed
                        ? getRewardDescription(lootBox)
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
                      {(openedBoxes[lootBox.id] || lootBox.is_claimed) && (
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
      
      {/* LootBox Details Dialog */}
      <Dialog open={!!selectedLootBox} onOpenChange={(open) => !open && setSelectedLootBox(null)}>
        {selectedLootBox && (
          <DialogContent className="bg-galaxy-deepPurple/95 border-galaxy-purple/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl text-center">
                {showingReward ? getRewardLabel(selectedLootBox.reward_type) : "Loot Box"}
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-center">
                {showingReward ? "Recompensa desbloqueada" : "Abra para revelar sua recompensa"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-6">
              {isClaimingReward ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="h-40 w-40 flex items-center justify-center">
                    <div className="h-16 w-16 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
                  </div>
                  <p className="text-white text-xl mt-4 animate-pulse">Processando recompensa...</p>
                </div>
              ) : showingReward ? (
                <div className="h-40 w-40 mb-6">
                  <Player
                    src={getRewardAnimation(selectedLootBox)}
                    className="h-full w-full"
                    autoplay
                    loop
                  />
                </div>
              ) : (
                <div className="h-40 w-40 mb-6">
                  <Player
                    src="https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json"
                    className="h-full w-full"
                    autoplay
                    loop
                  />
                </div>
              )}
              
              <div className="text-center max-w-sm">
                {showingReward ? (
                  <div>
                    <p className="text-white text-xl font-bold mb-2">
                      {getRewardDescription(selectedLootBox)}
                    </p>
                    
                    {!(openedBoxes[selectedLootBox.id] === true && selectedLootBox.is_claimed) && (
                      <Button 
                        onClick={handleClaimReward}
                        className="mt-6 w-full bg-gradient-to-r from-neon-pink to-neon-cyan hover:opacity-90"
                        disabled={isClaimingReward}
                      >
                        {isClaimingReward ? (
                          <>
                            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-0 border-white"></span>
                            Processando...
                          </>
                        ) : "Reivindicar Recompensa"}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-white">
                    Esta Loot Box contém uma recompensa surpresa da missão "{selectedLootBox.missions?.title || 'Desconhecida'}"!
                  </p>
                )}
                
                {!showingReward && !(openedBoxes[selectedLootBox.id] || selectedLootBox.is_claimed) && (
                  <Button 
                    onClick={handleRevealReward}
                    className="mt-6 w-full bg-gradient-to-r from-neon-pink to-neon-cyan hover:opacity-90"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Abrir Loot Box
                  </Button>
                )}
                
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>Recebida em {new Date(selectedLootBox.awarded_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default LootBoxList;
