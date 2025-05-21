
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, BadgeCheck, Gift } from "lucide-react";
import LootBoxRewardsSelector, { LootBoxRewardType } from "./LootBoxRewardsSelector";

interface MissionRewardsStepProps {
  hasBadge: boolean;
  onHasBadgeChange: (value: boolean) => void;
  hasLootBox: boolean;
  onHasLootBoxChange: (value: boolean) => void;
  sequenceBonus: boolean;
  onSequenceBonusChange: (value: boolean) => void;
  selectedLootBoxRewards: LootBoxRewardType[];
  onSelectedLootBoxRewardsChange: (rewards: LootBoxRewardType[]) => void;
}

export function MissionRewardsStep({
  hasBadge,
  onHasBadgeChange,
  hasLootBox,
  onHasLootBoxChange,
  sequenceBonus,
  onSequenceBonusChange,
  selectedLootBoxRewards,
  onSelectedLootBoxRewardsChange
}: MissionRewardsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Tipos de Recompensa</h2>
        <p className="text-sm text-muted-foreground">
          Escolha os tipos de recompensa que quer oferecer para esta missão
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="h-5 w-5 text-neon-pink" />
              <div>
                <Label htmlFor="has-badge" className="font-medium">Badge ao Completar</Label>
                <p className="text-xs text-muted-foreground">
                  Os participantes ganham uma badge exclusiva
                </p>
              </div>
            </div>
            <Switch
              id="has-badge"
              checked={hasBadge}
              onCheckedChange={onHasBadgeChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-neon-cyan" />
              <div>
                <Label htmlFor="has-lootbox" className="font-medium">Loot Box Surpresa</Label>
                <p className="text-xs text-muted-foreground">
                  Os participantes ganham uma recompensa aleatória
                </p>
              </div>
            </div>
            <Switch
              id="has-lootbox"
              checked={hasLootBox}
              onCheckedChange={onHasLootBoxChange}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-green-500" />
              <div>
                <Label htmlFor="sequence-bonus" className="font-medium">Bônus por Sequência</Label>
                <p className="text-xs text-muted-foreground">
                  Recompensas incrementais por completar missões consecutivamente
                </p>
              </div>
            </div>
            <Switch
              id="sequence-bonus"
              checked={sequenceBonus}
              onCheckedChange={onSequenceBonusChange}
            />
          </div>
        </CardContent>
      </Card>
      
      {hasLootBox && (
        <LootBoxRewardsSelector
          isOpen={true}
          selectedRewards={selectedLootBoxRewards}
          onChange={onSelectedLootBoxRewardsChange}
        />
      )}
    </div>
  );
}

export default MissionRewardsStep;
