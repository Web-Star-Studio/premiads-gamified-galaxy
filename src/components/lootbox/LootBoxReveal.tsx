
import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Gift } from "lucide-react";

export interface LootBoxReward {
  id: string;
  user_id: string;
  mission_id: string;
  reward_type: string;
  reward_amount: number;
  awarded_at: string;
  created_at?: string;
  description?: string;
  display_name?: string;
  missions?: {
    title: string;
  };
  is_claimed?: boolean;
}

interface LootBoxRevealProps {
  isOpen: boolean;
  onClose: () => void;
  reward: LootBoxReward | null;
  onClaim: (rewardId: string) => void;
}

const ANIMATIONS: Record<string, string> = {
  credit_bonus: "https://assets5.lottiefiles.com/packages/lf20_rkfesiwm.json",
  random_badge: "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json",
  multiplier: "https://assets2.lottiefiles.com/packages/lf20_npi0slet.json",
  level_up: "https://assets3.lottiefiles.com/packages/lf20_zkgnnlia.json",
  daily_streak_bonus: "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json",
  raffle_ticket: "https://assets10.lottiefiles.com/packages/lf20_uomoou11.json",
  default: "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json"
};

const getRewardDescription = (reward: LootBoxReward): string => {
  return reward.description || `Recompensa: ${reward.reward_type}`;
};

const getDisplayName = (reward: LootBoxReward): string => {
  return reward.display_name || reward.reward_type;
};

const getAnimation = (rewardType: string): string => {
  return ANIMATIONS[rewardType] || ANIMATIONS.default;
};

export const LootBoxReveal: React.FC<LootBoxRevealProps> = ({ isOpen, onClose, reward, onClaim }) => {
  const handleClaim = () => {
    if (reward) {
      onClaim(reward.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-galaxy-deepPurple/95 border-galaxy-purple/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            {reward ? getDisplayName(reward) : "Loot Box"}
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-center">
            {reward ? "Recompensa desbloqueada" : "Carregando sua recompensa..."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6">
          <div className="h-40 w-40 mb-6">
            <Player
              src={reward ? getAnimation(reward.reward_type) : ANIMATIONS.default}
              className="h-full w-full"
              autoplay
              loop
            />
          </div>
          
          <div className="text-center max-w-sm">
            {reward ? (
              <div>
                <p className="text-white text-xl font-bold mb-2">
                  {getRewardDescription(reward)}
                </p>
                <p className="text-gray-400">
                  Esta recompensa foi aplicada à sua conta.
                </p>
              </div>
            ) : (
              <p className="text-white">
                Carregando sua recompensa surpresa...
              </p>
            )}
            
            {reward && !reward.is_claimed && (
              <Button 
                onClick={handleClaim}
                className="mt-6 w-full bg-gradient-to-r from-neon-pink to-neon-cyan hover:opacity-90"
              >
                <Gift className="mr-2 h-4 w-4" />
                Receber Recompensa
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LootBoxReveal;
