
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";
import { useSounds } from "@/hooks/use-sounds";

export interface LootBoxReward {
  id: string;
  reward_type: string;
  reward_amount: number;
  display_name: string;
  description: string;
  awarded_at: string;
  is_claimed?: boolean;
}

interface LootBoxRevealProps {
  reward: LootBoxReward;
  isOpen: boolean;
  onClose: () => void;
  onClaim?: (rewardId: string) => Promise<void>;
}

export const LootBoxReveal: React.FC<LootBoxRevealProps> = ({
  reward,
  isOpen,
  onClose,
  onClaim
}) => {
  const [stage, setStage] = useState<'closed' | 'opening' | 'reveal'>('closed');
  const [claimed, setClaimed] = useState(reward.is_claimed || false);
  const { playSound } = useSounds();

  useEffect(() => {
    if (isOpen && stage === 'closed') {
      setTimeout(() => {
        setStage('opening');
        playSound('chime');
      }, 500);
    }
  }, [isOpen, stage, playSound]);

  const handleOpenBox = () => {
    playSound('reward');
    setStage('reveal');
  };

  const handleClaimReward = async () => {
    if (onClaim && !claimed) {
      await onClaim(reward.id);
      setClaimed(true);
      playSound('success');
    }
  };

  // Helper for getting appropriate icon
  const getRewardIcon = () => {
    switch (reward.reward_type) {
      case 'credit_bonus':
        return '💰';
      case 'random_badge':
        return '🏅';
      case 'multiplier':
        return '✨';
      case 'level_up':
        return '⬆️';
      case 'daily_streak_bonus':
        return '🔥';
      case 'raffle_ticket':
        return '🎫';
      default:
        return '🎁';
    }
  };

  // Helper for getting appropriate color
  const getRewardColor = () => {
    switch (reward.reward_type) {
      case 'credit_bonus':
        return 'from-yellow-500 to-amber-600';
      case 'random_badge':
        return 'from-purple-500 to-indigo-600';
      case 'multiplier':
        return 'from-green-500 to-emerald-600';
      case 'level_up':
        return 'from-blue-500 to-cyan-600';
      case 'daily_streak_bonus':
        return 'from-orange-500 to-red-600';
      case 'raffle_ticket':
        return 'from-pink-500 to-rose-600';
      default:
        return 'from-neon-cyan to-neon-pink';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 border-neon-cyan/30">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-bold text-center mb-2">
            {stage === 'reveal' ? reward.display_name : 'Loot Box Misteriosa'}
          </DialogTitle>
        </div>

        <div className="p-6 flex flex-col items-center justify-center min-h-[350px]">
          <AnimatePresence mode="wait">
            {stage === 'closed' && (
              <motion.div
                key="closed"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="text-center text-gray-400 text-sm mb-4">
                  Preparando sua recompensa...
                </div>
                <div className="w-16 h-16 border-4 border-t-neon-cyan border-gray-700 rounded-full animate-spin"></div>
              </motion.div>
            )}

            {stage === 'opening' && (
              <motion.div
                key="opening"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <Gift className="w-32 h-32 text-neon-cyan" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 opacity-50"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity
                    }}
                  >
                    <Sparkles className="w-32 h-32 text-neon-pink" />
                  </motion.div>
                </div>
                <Button
                  onClick={handleOpenBox}
                  className="bg-gradient-to-r from-neon-cyan to-neon-pink hover:from-neon-cyan/90 hover:to-neon-pink/90 text-white px-8 py-2 rounded-full shadow-glow"
                >
                  Abrir Loot Box
                </Button>
              </motion.div>
            )}

            {stage === 'reveal' && (
              <motion.div
                key="reveal"
                initial={{ scale: 0.8, opacity: 0, rotateY: 180 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${getRewardColor()} flex items-center justify-center mb-6 shadow-glow`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <span className="text-6xl">{getRewardIcon()}</span>
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-2">
                  {reward.display_name}
                </h3>
                
                <p className="text-gray-300 mb-6">
                  {reward.description}
                </p>
                
                {reward.reward_amount && (
                  <div className="text-neon-cyan text-xl font-bold mb-6">
                    {reward.reward_type === 'multiplier' 
                      ? `${reward.reward_amount}x` 
                      : `+${reward.reward_amount}`}
                  </div>
                )}

                {onClaim && (
                  <Button
                    onClick={handleClaimReward}
                    className={`transition-all ${claimed 
                      ? 'bg-gray-700 text-gray-300' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'}`}
                    disabled={claimed}
                  >
                    {claimed ? 'Recompensa Coletada' : 'Coletar Recompensa'}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LootBoxReveal;
