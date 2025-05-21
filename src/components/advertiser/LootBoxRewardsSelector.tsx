
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Sparkles, Award, DollarSign, TrendingUp, Repeat, Ticket } from "lucide-react";
import { CheckboxGroup, useCheckboxGroupContext } from "@/components/ui/checkbox-group";

export type LootBoxRewardType = 
  | "credit_bonus" 
  | "random_badge" 
  | "multiplier" 
  | "level_up" 
  | "daily_streak_bonus" 
  | "raffle_ticket";

interface LootBoxRewardsSelectorProps {
  isOpen: boolean;
  selectedRewards: LootBoxRewardType[];
  onChange: (rewards: LootBoxRewardType[]) => void;
}

interface RewardOption {
  id: LootBoxRewardType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const rewardOptions: RewardOption[] = [
  {
    id: "credit_bonus",
    label: "Bônus de Créditos (+500)",
    description: "O participante recebe 500 créditos extras",
    icon: <Sparkles className="h-4 w-4 text-yellow-400" />
  },
  {
    id: "random_badge",
    label: "Badge Aleatória",
    description: "Uma badge aleatória de outro desafio",
    icon: <Award className="h-4 w-4 text-neon-cyan" />
  },
  {
    id: "multiplier",
    label: "Multiplicador de Créditos (1.5x)",
    description: "Multiplica os créditos atuais por 1.5",
    icon: <DollarSign className="h-4 w-4 text-green-400" />
  },
  {
    id: "level_up",
    label: "Level Up Instantâneo",
    description: "Pontos de experiência para subir de nível",
    icon: <TrendingUp className="h-4 w-4 text-neon-pink" />
  },
  {
    id: "daily_streak_bonus",
    label: "Bônus de Sequência Diária",
    description: "+1 na sequência atual para o usuário",
    icon: <Repeat className="h-4 w-4 text-purple-400" />
  },
  {
    id: "raffle_ticket",
    label: "Ticket para Sorteio",
    description: "Um número para o próximo sorteio",
    icon: <Ticket className="h-4 w-4 text-blue-400" />
  }
];

// Custom checkbox item that uses the group context
const CheckboxItem = ({ id, value, children }: { id: string, value: string, children: React.ReactNode }) => {
  const { value: groupValue, onValueChange } = useCheckboxGroupContext();
  
  const handleCheckedChange = (checked: boolean) => {
    if (checked) {
      onValueChange([...groupValue, value]);
    } else {
      onValueChange(groupValue.filter(v => v !== value));
    }
  };

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/40 transition-colors">
      <Checkbox 
        id={id}
        checked={groupValue.includes(value)}
        onCheckedChange={handleCheckedChange}
        value={value}
        className="mt-1"
      />
      {children}
    </div>
  );
};

const LootBoxRewardsSelector: React.FC<LootBoxRewardsSelectorProps> = ({ 
  isOpen, 
  selectedRewards, 
  onChange 
}) => {
  if (!isOpen) return null;

  return (
    <Card className="border-neon-cyan/20 bg-gray-900/60">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Recompensas Possíveis na Loot Box</CardTitle>
        <CardDescription>
          Selecione quais recompensas podem ser sorteadas quando o usuário completar esta missão
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CheckboxGroup 
          value={selectedRewards} 
          onValueChange={(values) => onChange(values as LootBoxRewardType[])}
          className="space-y-3"
        >
          {rewardOptions.map(option => (
            <CheckboxItem 
              key={option.id}
              id={`reward-${option.id}`}
              value={option.id}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-800/60 flex items-center justify-center">
                  {option.icon}
                </div>
                <div>
                  <Label 
                    htmlFor={`reward-${option.id}`}
                    className="font-medium text-white"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </CheckboxItem>
          ))}
        </CheckboxGroup>
      </CardContent>
    </Card>
  );
};

export default LootBoxRewardsSelector;
