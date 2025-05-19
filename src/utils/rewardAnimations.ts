
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

export interface RewardDetails {
  points: number;
  streak_bonus?: number;
  current_streak?: number;
  badge_earned?: boolean;
  badge_name?: string;
  loot_box_reward?: string;
  loot_box_amount?: number;
}

export const useRewardAnimations = () => {
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  const showRewardNotification = (reward: RewardDetails) => {
    // Play appropriate sound
    if (reward.badge_earned || reward.loot_box_reward) {
      playSound("reward");
    } else {
      playSound("success");
    }
    
    // Basic point reward notification
    let title = `+${reward.points} pontos!`;
    let description = "Missão completada com sucesso!";
    
    // Add streak bonus information if applicable
    if (reward.streak_bonus && reward.streak_bonus > 0) {
      title = `+${reward.points} pontos (inclui bônus de sequência)!`;
      description = `Sequência atual: ${reward.current_streak || 1} dia(s). Continue completando esta missão diariamente para aumentar seu bônus!`;
    }
    
    // Show badge notification
    if (reward.badge_earned) {
      toast({
        title: "Nova Conquista Desbloqueada!",
        description: `Você ganhou o badge: ${reward.badge_name || "Missão Completa"}`,
        variant: "default",
        className: "bg-gradient-to-br from-purple-600/90 to-neon-pink/60 text-white border-neon-cyan"
      });
    }
    
    // Show loot box reward notification
    if (reward.loot_box_reward) {
      const rewardType = getRewardTypeLabel(reward.loot_box_reward);
      toast({
        title: "Loot Box Aberta!",
        description: `Você ganhou: ${rewardType} ${getRewardValueLabel(reward.loot_box_reward, reward.loot_box_amount)}`,
        variant: "default",
        className: "bg-gradient-to-br from-purple-600/90 to-neon-pink/60 text-white border-neon-cyan"
      });
    }
    
    // Show the basic points notification last
    setTimeout(() => {
      toast({
        title,
        description,
        variant: "default"
      });
    }, reward.badge_earned || reward.loot_box_reward ? 1000 : 0);
  };
  
  // Helper function to get user-friendly label for reward type
  const getRewardTypeLabel = (rewardType: string): string => {
    switch (rewardType) {
      case 'xp_bonus':
        return 'Bônus de XP:';
      case 'token_multiplier':
        return 'Multiplicador de Tokens:';
      case 'instant_level_up':
        return 'Aumento de Nível:';
      default:
        return 'Recompensa:';
    }
  };
  
  // Helper function to format the reward value based on type
  const getRewardValueLabel = (rewardType: string, amount?: number): string => {
    if (!amount) return '';
    
    switch (rewardType) {
      case 'xp_bonus':
        return `${amount} XP extra`;
      case 'token_multiplier':
        return `${amount}x`;
      case 'instant_level_up':
        return `+${amount} pontos`;
      default:
        return `${amount}`;
    }
  };
  
  return {
    showRewardNotification
  };
};
