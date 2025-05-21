
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Gift, Percent, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type LootBoxRewardType = 
  | "credit_bonus" 
  | "random_badge" 
  | "multiplier" 
  | "level_up" 
  | "daily_streak_bonus" 
  | "raffle_ticket";

interface LootBoxRewardOption {
  type: LootBoxRewardType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const rewardOptions: LootBoxRewardOption[] = [
  {
    type: "credit_bonus",
    label: "Bônus de Créditos",
    description: "Créditos extras para os usuários que completarem a missão",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    type: "random_badge",
    label: "Badge Aleatória",
    description: "Uma badge exclusiva aleatória como recompensa",
    icon: <Star className="h-5 w-5" />,
  },
  {
    type: "multiplier",
    label: "Multiplicador",
    description: "Multiplica os pontos obtidos em missões futuras",
    icon: <Percent className="h-5 w-5" />,
  },
  {
    type: "level_up",
    label: "Level Up",
    description: "Ganho instantâneo de XP para subir de nível",
    icon: <Zap className="h-5 w-5" />,
  },
  {
    type: "daily_streak_bonus",
    label: "Bônus de Sequência",
    description: "Aumenta a sequência de logins diários",
    icon: <Check className="h-5 w-5" />,
  },
  {
    type: "raffle_ticket",
    label: "Ticket de Sorteio",
    description: "Tickets para participar de sorteios especiais",
    icon: <Gift className="h-5 w-5" />,
  },
];

interface LootBoxRewardsSelectorProps {
  isOpen?: boolean;
  selectedRewards: LootBoxRewardType[];
  onChange: (rewards: LootBoxRewardType[]) => void;
}

const LootBoxRewardsSelector: React.FC<LootBoxRewardsSelectorProps> = ({
  isOpen = false,
  selectedRewards,
  onChange,
}) => {
  const toggleReward = (type: LootBoxRewardType) => {
    if (selectedRewards.includes(type)) {
      onChange(selectedRewards.filter((r) => r !== type));
    } else {
      onChange([...selectedRewards, type]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-base font-medium">Possíveis Recompensas da Loot Box</h3>
        <p className="text-sm text-muted-foreground">
          Selecione quais tipos de recompensas podem ser encontradas nas loot boxes desta missão
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {rewardOptions.map((option) => (
          <div
            key={option.type}
            className={cn(
              "p-4 border rounded-md cursor-pointer transition-all",
              selectedRewards.includes(option.type)
                ? "border-neon-cyan bg-neon-cyan/10"
                : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
            )}
            onClick={() => toggleReward(option.type)}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-full",
                  selectedRewards.includes(option.type)
                    ? "bg-neon-cyan/20 text-neon-cyan"
                    : "bg-gray-700 text-gray-400"
                )}
              >
                {option.icon}
              </div>
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-400">{option.description}</div>
              </div>
            </div>
            {selectedRewards.includes(option.type) && (
              <Badge className="mt-2 bg-neon-cyan text-black">Selecionado</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LootBoxRewardsSelector;
