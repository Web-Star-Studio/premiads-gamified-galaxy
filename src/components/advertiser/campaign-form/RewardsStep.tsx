import { memo, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { missionService, UserTokens } from "@/services/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";

interface RewardsStepProps {
  /** Current form data */
  formData: FormData;
  /** Function to update form data */
  updateFormData: (field: string, value: any) => void;
}

/**
 * Mission rewards configuration step
 * Manages points, badges, and other reward options
 */
const RewardsStep = ({ formData, updateFormData }: RewardsStepProps) => {
  const [userCredits, setUserCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [randomPointValue, setRandomPointValue] = useState<number | null>(null);
  
  // Limites de pontuação baseados nos créditos disponíveis
  const minPoints = 10;
  const maxPoints = userCredits > 0 ? Math.min(200, userCredits) : 200;
  const pointsStep = 5;

  // Buscar os créditos do usuário ao carregar o componente
  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        setIsLoading(true);
        // Obter usuário atual
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (userId) {
          // Buscar tokens do usuário
          const userTokens = await missionService.getUserTokens(userId);
          // Tratar o retorno como tipo UserTokens
          const availableCredits = (userTokens as UserTokens).total_tokens - (userTokens as UserTokens).used_tokens;
          setUserCredits(availableCredits);
          
          // Limitar os pontos máximos aos créditos disponíveis
          if (formData.pointsRange[1] > availableCredits) {
            updateFormData("pointsRange", [minPoints, Math.min(maxPoints, availableCredits)]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar créditos do usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCredits();
  }, []);
  
  // Gerar pontuação aleatória quando a opção for ativada
  useEffect(() => {
    if (formData.randomPoints) {
      // Gerar um valor aleatório entre 5% e 20% dos créditos disponíveis
      const minPercentage = 0.05;
      const maxPercentage = 0.2;
      const randomPercentage = Math.random() * (maxPercentage - minPercentage) + minPercentage;
      const calculatedValue = Math.floor(userCredits * randomPercentage);
      
      // Garantir que o valor esteja dentro dos limites
      const randomValue = Math.max(minPoints, Math.min(calculatedValue, maxPoints));
      setRandomPointValue(randomValue);
      
      // Atualizar os pontos no formulário
      updateFormData("pointsValue", randomValue);
    } else {
      setRandomPointValue(null);
      updateFormData("pointsValue", formData.pointsRange[0]);
    }
  }, [formData.randomPoints, userCredits]);

  // Handle streak multiplier changes
  const handleStreakMultiplierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 1.0) {
      updateFormData("streakMultiplier", Math.min(value, 3.0));
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center py-4">Carregando informações de créditos...</div>
      ) : (
        <>
          <Card className="bg-galaxy-darkPurple/50 border-galaxy-purple/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="text-neon-cyan h-4 w-4" />
                <span className="text-sm font-medium">Saldo disponível: {userCredits} créditos</span>
              </div>
              <p className="text-xs text-gray-400">
                Os créditos são consumidos quando a campanha é publicada.
                Cada ponto atribuído à missão consome 1 crédito da sua conta.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="points-slider" className="text-sm font-medium">Pontos</label>
              <div className="text-sm">
                <span className="mr-3 text-neon-cyan" aria-live="polite">
                  {formData.randomPoints 
                    ? randomPointValue || "Calculando..." 
                    : `${formData.pointsRange[0]} - ${formData.pointsRange[1]}`}
                </span>
              </div>
            </div>
            <Slider
              id="points-slider"
              defaultValue={formData.pointsRange}
              min={minPoints}
              max={maxPoints}
              step={pointsStep}
              disabled={formData.randomPoints || userCredits === 0}
              onValueChange={(value) => updateFormData("pointsRange", value)}
              className="py-4"
              aria-valuemin={minPoints}
              aria-valuemax={maxPoints}
              aria-valuenow={formData.pointsRange[1]}
              aria-valuetext={`${formData.pointsRange[0]} a ${formData.pointsRange[1]} pontos`}
            />
          </div>

          <div className="flex items-center justify-between px-1 py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium" id="random-points-label">Pontuação Aleatória</p>
              <p className="text-xs text-gray-400">
                A plataforma calculará automaticamente um valor entre 5% e 20% do seu saldo
              </p>
            </div>
            <Switch
              id="random-points"
              checked={formData.randomPoints}
              disabled={userCredits === 0}
              onCheckedChange={(checked) => updateFormData("randomPoints", checked)}
              aria-labelledby="random-points-label"
            />
          </div>

          <div className="flex items-center justify-between px-1 py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium" id="streak-bonus-label">Bônus de Sequência</p>
              <p className="text-xs text-gray-400">
                Ofereça pontos extras para usuários que completarem a missão em dias consecutivos
              </p>
            </div>
            <Switch
              id="streak-bonus"
              checked={formData.streakBonus}
              onCheckedChange={(checked) => {
                updateFormData("streakBonus", checked);
                if (checked && !formData.streakMultiplier) {
                  updateFormData("streakMultiplier", 1.2);
                }
              }}
              aria-labelledby="streak-bonus-label"
            />
          </div>

          {formData.streakBonus && (
            <div className="pl-6 pr-1 py-2 space-y-2 bg-galaxy-purple/10 rounded-md">
              <label htmlFor="streak-multiplier" className="text-sm font-medium">
                Multiplicador de Sequência
              </label>
              <div className="flex items-center gap-3">
                <Input
                  id="streak-multiplier"
                  type="number"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={formData.streakMultiplier || 1.2}
                  onChange={handleStreakMultiplierChange}
                  className="w-24 bg-gray-800 border-gray-700"
                />
                <span className="text-xs text-gray-400">
                  (entre 1.0x e 3.0x, ex: 1.2 = 20% a mais de pontos)
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-1 py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium" id="badges-label">Badge Exclusivo</p>
              <p className="text-xs text-gray-400">Crie um badge para os usuários que completarem esta missão</p>
            </div>
            <Switch
              id="badges"
              checked={formData.hasBadges}
              onCheckedChange={(checked) => updateFormData("hasBadges", checked)}
              aria-labelledby="badges-label"
            />
          </div>

          <div className="flex items-center justify-between px-1 py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium" id="lootbox-label">Loot Box</p>
              <p className="text-xs text-gray-400">Inclui uma chance de prêmio surpresa</p>
            </div>
            <Switch
              id="lootbox"
              checked={formData.hasLootBox}
              onCheckedChange={(checked) => updateFormData("hasLootBox", checked)}
              aria-labelledby="lootbox-label"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default memo(RewardsStep);
