
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Gift, Coins, Award, TrendingUp, Repeat, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type LootBoxRewardType = 
  | "credit_bonus" 
  | "random_badge" 
  | "multiplier" 
  | "level_up" 
  | "daily_streak_bonus" 
  | "raffle_ticket";

interface LootBoxRewardOption {
  id: LootBoxRewardType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const REWARD_OPTIONS: LootBoxRewardOption[] = [
  {
    id: "credit_bonus",
    label: "Bônus de Créditos",
    description: "O participante ganha 500 créditos extras",
    icon: <Coins className="h-5 w-5 text-yellow-500" />
  },
  {
    id: "random_badge",
    label: "Badge Aleatória",
    description: "O participante ganha uma badge exclusiva aleatória",
    icon: <Award className="h-5 w-5 text-purple-500" />
  },
  {
    id: "multiplier",
    label: "Multiplicador de Créditos",
    description: "Os créditos do participante são multiplicados por 1.5x",
    icon: <TrendingUp className="h-5 w-5 text-green-500" />
  },
  {
    id: "level_up",
    label: "Level Up Instantâneo",
    description: "O participante ganha pontos suficientes para subir de nível",
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />
  },
  {
    id: "daily_streak_bonus",
    label: "Bônus de Sequência",
    description: "A sequência diária do participante é incrementada em +1",
    icon: <Repeat className="h-5 w-5 text-orange-500" />
  },
  {
    id: "raffle_ticket",
    label: "Ticket de Sorteio",
    description: "O participante ganha um número para o próximo sorteio",
    icon: <Ticket className="h-5 w-5 text-pink-500" />
  }
];

interface LootBoxRewardsSelectorProps {
  isOpen: boolean;
  selectedRewards: LootBoxRewardType[];
  onChange: (rewards: LootBoxRewardType[]) => void;
}

export const LootBoxRewardsSelector: React.FC<LootBoxRewardsSelectorProps> = ({
  isOpen,
  selectedRewards,
  onChange
}) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(isOpen);

  const handleRewardToggle = (rewardId: LootBoxRewardType) => {
    if (selectedRewards.includes(rewardId)) {
      onChange(selectedRewards.filter(id => id !== rewardId));
    } else {
      onChange([...selectedRewards, rewardId]);
    }
  };

  const handleSelectAll = () => {
    onChange(REWARD_OPTIONS.map(option => option.id));
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <div className="space-y-2 rounded-md border border-border p-4 bg-card/50">
      <Collapsible
        open={isCollapsibleOpen}
        onOpenChange={setIsCollapsibleOpen}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-neon-cyan" />
            <h4 className="text-sm font-medium">Recompensas da Loot Box</h4>
            <Badge 
              variant="outline" 
              className="text-xs bg-muted/50"
            >
              {selectedRewards.length} selecionadas
            </Badge>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isCollapsibleOpen ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="space-y-4">
          <div className="flex flex-wrap gap-4 mt-2">
            {REWARD_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-start space-x-2 basis-[calc(50%-0.5rem)]">
                <Checkbox
                  id={`reward-${option.id}`}
                  checked={selectedRewards.includes(option.id)}
                  onCheckedChange={() => handleRewardToggle(option.id)}
                  className="mt-1"
                />
                <div className="space-y-1">
                  <Label 
                    htmlFor={`reward-${option.id}`}
                    className="flex items-center gap-1.5 font-medium"
                  >
                    {option.icon}
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
              className="text-xs h-8"
            >
              Limpar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
              className="text-xs h-8"
            >
              Selecionar todos
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default LootBoxRewardsSelector;
