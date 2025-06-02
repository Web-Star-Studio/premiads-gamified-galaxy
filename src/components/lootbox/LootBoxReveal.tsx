
import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Gift, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface LootBoxReward {
  id: string;
  user_id: string;
  mission_id: string;
  reward_type: string;
  reward_amount: number;
  display_name?: string;
  description?: string;
  awarded_at: string;
  created_at: string;
  missions?: {
    title: string;
  };
  is_claimed: boolean;
}

interface LootBoxRevealProps {
  isOpen: boolean;
  onClose: () => void;
  reward: LootBoxReward | null;
  onClaim: (rewardId: string) => void;
  isClaimingReward?: boolean;
}

export const LootBoxReveal: React.FC<LootBoxRevealProps> = ({
  isOpen,
  onClose,
  reward,
  onClaim,
  isClaimingReward = false
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [showReward, setShowReward] = useState(false);

  // Reset state when dialog is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      setIsOpening(false);
      setShowReward(false);
    }
  };

  const handleOpenLootBox = () => {
    if (!reward || reward.is_claimed) return;
    
    setIsOpening(true);
    
    // Simulate opening animation
    setTimeout(() => {
      setShowReward(true);
      setIsOpening(false);
    }, 1500);
  };

  const handleClaimReward = () => {
    if (!reward || reward.is_claimed) return;
    onClaim(reward.id);
  };

  // Get animation URL based on reward type
  const getRewardAnimation = (type: string): string => {
    const animations: Record<string, string> = {
      credit_bonus: "https://assets5.lottiefiles.com/packages/lf20_rkfesiwm.json",
      random_badge: "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json",
      multiplier: "https://assets2.lottiefiles.com/packages/lf20_npi0slet.json",
      level_up: "https://assets3.lottiefiles.com/packages/lf20_zkgnnlia.json",
      daily_streak_bonus: "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json",
      raffle_ticket: "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json",
      default: "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json",
    };
    
    return animations[type] || animations.default;
  };

  // Get human-readable reward name
  const getRewardName = (type: string): string => {
    const names: Record<string, string> = {
      credit_bonus: "Bônus de Créditos",
      random_badge: "Badge Aleatória",
      multiplier: "Multiplicador de Créditos",
      level_up: "Level Up Instantâneo",
      daily_streak_bonus: "Bônus de Sequência Diária",
      raffle_ticket: "Ticket para Sorteio",
    };
    
    return names[type] || "Recompensa";
  };

  // Get reward description
  const getRewardDescription = (reward: LootBoxReward): string => {
    if (reward.description) return reward.description;
    
    switch (reward.reward_type) {
      case 'credit_bonus':
        return `Você ganhou ${reward.reward_amount} créditos extras!`;
      case 'multiplier':
        return `Multiplicador de créditos: ${reward.reward_amount}x!`;
      case 'level_up':
        return `Ganhe ${reward.reward_amount} tickets de experiência instantâneos!`;
      case 'daily_streak_bonus':
        return `Sua sequência diária foi aumentada em ${reward.reward_amount}!`;
      case 'raffle_ticket':
        return `Você ganhou ${reward.reward_amount} tickets para o próximo sorteio!`;
      case 'random_badge':
        return `Você ganhou uma badge aleatória exclusiva!`;
      default:
        return `Recompensa: ${reward.reward_amount}`;
    }
  };

  if (!reward) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-gray-900/95 border border-galaxy-purple/30 text-white max-w-md mx-auto">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl text-center">
            {showReward 
              ? reward.display_name || getRewardName(reward.reward_type)
              : "Loot Box"}
          </DialogTitle>
          <Button 
            className="absolute right-4 top-4 rounded-full p-0 w-6 h-6 text-gray-400"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-4">
          {isOpening ? (
            <div className="flex flex-col items-center justify-center">
              <Player
                src="https://assets1.lottiefiles.com/packages/lf20_mwawjro9.json"
                className="h-40 w-40"
                autoplay
                loop
              />
              <p className="text-lg mt-4 animate-pulse">Abrindo Loot Box...</p>
            </div>
          ) : showReward ? (
            <div className="flex flex-col items-center justify-center">
              <Player
                src={getRewardAnimation(reward.reward_type)}
                className="h-40 w-40"
                autoplay
                loop
              />
              
              <h3 className="text-xl font-bold text-gradient-to-r from-neon-pink to-neon-cyan mt-4">
                {reward.display_name || getRewardName(reward.reward_type)}
              </h3>
              
              <p className="text-center text-gray-300 mt-2 max-w-xs">
                {getRewardDescription(reward)}
              </p>
              
              <Button
                className="mt-6 bg-gradient-to-r from-neon-pink to-neon-cyan hover:opacity-90 w-full"
                onClick={handleClaimReward}
                disabled={isClaimingReward || reward.is_claimed}
              >
                {isClaimingReward ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-0 border-white"></span>
                    Processando...
                  </>
                ) : reward.is_claimed ? 
                  "Recompensa já Reivindicada" : 
                  "Reivindicar Recompensa"}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <Gift className="h-24 w-24 text-neon-cyan animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-cyan/20 rounded-full"></div>
              </div>
              
              <h3 className="text-xl font-medium mt-4">
                Loot Box da Missão
              </h3>
              
              <p className="text-center text-gray-400 mt-2 max-w-xs">
                {reward.missions?.title ? (
                  <>Você ganhou esta Loot Box ao completar a missão <span className="text-neon-cyan">{reward.missions.title}</span>!</>
                ) : (
                  "Abra para descobrir sua recompensa!"
                )}
              </p>
              
              <Button
                className="mt-6 bg-gradient-to-r from-neon-pink to-neon-cyan hover:opacity-90"
                onClick={handleOpenLootBox}
                disabled={reward.is_claimed}
              >
                {reward.is_claimed ? "Já Reivindicada" : "Abrir Loot Box"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
