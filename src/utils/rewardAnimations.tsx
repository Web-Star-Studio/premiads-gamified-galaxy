import { Player } from "@lottiefiles/react-lottie-player";
import { toast } from "sonner";
import React from "react";

export interface RewardDetails {
  points: number;
  badge_earned?: boolean;
  badge_name?: string;
  loot_box_reward?: string;
  loot_box_amount?: number;
  loot_box_display_name?: string;
  loot_box_description?: string;
  streak_bonus?: number;
  current_streak?: number;
}

const getRewardAnimation = (rewardType: string): string => {
  const animations: Record<string, string> = {
    credit_bonus: "https://assets5.lottiefiles.com/packages/lf20_rkfesiwm.json",
    random_badge: "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json",
    multiplier: "https://assets2.lottiefiles.com/packages/lf20_npi0slet.json",
    level_up: "https://assets3.lottiefiles.com/packages/lf20_zkgnnlia.json",
    daily_streak_bonus: "https://assets1.lottiefiles.com/packages/lf20_fnjha2ed.json",
    raffle_ticket: "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json",
    badge: "https://assets3.lottiefiles.com/packages/lf20_2cwdcjsd.json",
    default: "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json",
  };

  return animations[rewardType] || animations.default;
};

export const useRewardAnimations = () => {
  const showRewardNotification = (rewardDetails: RewardDetails) => {
    let animationUrl = "https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json";
    let title = "Recompensa Recebida!";
    let description = "";

    // Determine which reward to emphasize
    if (rewardDetails.badge_earned) {
      animationUrl = getRewardAnimation("badge");
      title = "Nova Badge Desbloqueada!";
      description = `Você ganhou a badge "${rewardDetails.badge_name || 'Especial'}"`;
    } else if (rewardDetails.loot_box_reward) {
      animationUrl = getRewardAnimation(rewardDetails.loot_box_reward);
      title = "Loot Box Desbloqueada!";
      description = rewardDetails.loot_box_description || 
                   `Recompensa: ${rewardDetails.loot_box_display_name || rewardDetails.loot_box_reward} (${rewardDetails.loot_box_amount})`;
    } else if (rewardDetails.streak_bonus && rewardDetails.streak_bonus > 0) {
      animationUrl = getRewardAnimation("daily_streak_bonus");
      title = "Bônus de Sequência!";
      description = `+${rewardDetails.streak_bonus} pontos por ${rewardDetails.current_streak} dias consecutivos`;
    }

    // Show animation toast
    toast(title, {
      description,
      duration: 5000,
      icon: (
        <Player
          src={animationUrl}
          className="h-12 w-12"
          autoplay={true}
          loop={true}
        />
      ),
      className: "bg-gray-900 border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,255,231,0.15)]",
    });
  };

  return {
    showRewardNotification
  };
};
