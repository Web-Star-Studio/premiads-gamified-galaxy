
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormData } from './types';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Loader2 } from 'lucide-react';

interface RewardsStepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: any) => void;
}

const RewardsStep: React.FC<RewardsStepProps> = ({ formData, updateFormData }) => {
  const { userCredits, loading } = useUserCredits();
  
  const totalCost = formData.rifas * (formData.maxParticipants || 100);
  const hasInsufficientBalance = userCredits < totalCost;

  return (
    <div className="space-y-6">
      <Card className="bg-galaxy-darkPurple border-galaxy-purple">
        <CardHeader>
          <CardTitle className="text-white">Recompensas da Campanha</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Balance Display */}
          {loading ? (
            <div className="flex items-center gap-2 p-3 bg-galaxy-dark/50 rounded-lg border border-galaxy-purple/30">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Carregando saldo...</span>
            </div>
          ) : (
            <div className="bg-galaxy-dark/50 p-3 rounded-lg border border-galaxy-purple/30">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Custo total:</span>
                <span className="font-semibold text-neon-cyan">
                  {totalCost.toLocaleString()} rifas
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-muted-foreground">Seu saldo:</span>
                <span className={`font-semibold ${hasInsufficientBalance ? 'text-red-400' : 'text-green-400'}`}>
                  {userCredits.toLocaleString()} rifas
                </span>
              </div>
              {hasInsufficientBalance && (
                <div className="text-xs text-red-400 mt-2">
                  ⚠️ Saldo insuficiente para esta configuração
                </div>
              )}
            </div>
          )}

          {/* Rifas per participant */}
          <div>
            <Label htmlFor="rifas" className="text-white">Rifas por participante</Label>
            <Input
              id="rifas"
              type="number"
              min="1"
              value={formData.rifas}
              onChange={(e) => updateFormData('rifas', parseInt(e.target.value) || 1)}
              className="bg-galaxy-dark border-galaxy-purple text-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Quantidade de rifas que cada participante receberá ao completar a missão
            </p>
          </div>

          {/* Cashback reward */}
          <div>
            <Label htmlFor="cashbackReward" className="text-white">Recompensa em Cashback (R$)</Label>
            <Input
              id="cashbackReward"
              type="number"
              min="0"
              step="0.01"
              value={formData.cashbackReward}
              onChange={(e) => updateFormData('cashbackReward', parseFloat(e.target.value) || 0)}
              className="bg-galaxy-dark border-galaxy-purple text-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Valor em reais que cada participante receberá como cashback
            </p>
          </div>

          {/* Max participants */}
          <div>
            <Label htmlFor="maxParticipants" className="text-white">Máximo de participantes</Label>
            <Input
              id="maxParticipants"
              type="number"
              min="1"
              value={formData.maxParticipants}
              onChange={(e) => updateFormData('maxParticipants', parseInt(e.target.value) || 100)}
              className="bg-galaxy-dark border-galaxy-purple text-white"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Número máximo de pessoas que podem participar desta campanha
            </p>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Badges de conquista</Label>
              <p className="text-xs text-muted-foreground">
                Participantes ganham badges ao completar a missão
              </p>
            </div>
            <Switch
              checked={formData.hasBadges}
              onCheckedChange={(checked) => updateFormData('hasBadges', checked)}
            />
          </div>

          {/* Loot Box */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Loot Box</Label>
              <p className="text-xs text-muted-foreground">
                Recompensas extras aleatórias para participantes
              </p>
            </div>
            <Switch
              checked={formData.hasLootBox}
              onCheckedChange={(checked) => updateFormData('hasLootBox', checked)}
            />
          </div>

          {/* Streak Bonus */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Bônus de sequência</Label>
              <p className="text-xs text-muted-foreground">
                Participantes ganham bônus por completar missões consecutivas
              </p>
            </div>
            <Switch
              checked={formData.streakBonus}
              onCheckedChange={(checked) => updateFormData('streakBonus', checked)}
            />
          </div>

          {formData.streakBonus && (
            <div>
              <Label htmlFor="streakMultiplier" className="text-white">Multiplicador de sequência</Label>
              <Input
                id="streakMultiplier"
                type="number"
                min="1"
                step="0.1"
                value={formData.streakMultiplier}
                onChange={(e) => updateFormData('streakMultiplier', parseFloat(e.target.value) || 1.2)}
                className="bg-galaxy-dark border-galaxy-purple text-white"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Multiplicador aplicado às recompensas para participantes em sequência
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsStep;
