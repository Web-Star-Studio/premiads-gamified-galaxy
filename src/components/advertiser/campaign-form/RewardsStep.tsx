
import { memo, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";
import { useUserCredits } from '@/hooks/useUserCredits';
import { Card, CardContent } from "@/components/ui/card";
import { Info, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MissionRewardsStep from "../MissionRewardsStep";
import { LootBoxRewardType } from "../LootBoxRewardsSelector";

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
  const { availableCredits: userCredits, isLoading, error } = useUserCredits();
  const [randomPointValue, setRandomPointValue] = useState<number | null>(null);
  const [uploadingBadge, setUploadingBadge] = useState(false);
  const [badgePreview, setBadgePreview] = useState<string | null>(formData.badgeImageUrl || null);
  const { toast } = useToast();
  
  // Limites de pontuação baseados nos créditos disponíveis
  const minPoints = 10;
  const maxPoints = userCredits > 0 ? Math.min(200, userCredits) : 200;
  const pointsStep = 5;

  // Inicializa e mantém créditos dinâmicos via store e real-time
  useEffect(() => {
    if (error) console.error('Erro ao carregar créditos:', error)
  }, [error]);

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

  // Handle file upload
  const handleBadgeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.includes('svg') && !file.type.includes('image/')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos SVG ou imagens.",
        variant: "destructive"
      });
      return;
    }

    // Show preview
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      setBadgePreview(e.target?.result as string);
    };
    fileReader.readAsDataURL(file);

    try {
      setUploadingBadge(true);
      
      // Generate a unique filename 
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");
      
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('badges')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('badges')
        .getPublicUrl(data.path);
        
      // Update form data with badge URL
      updateFormData("badgeImageUrl", publicUrlData.publicUrl);
      
      toast({
        title: "Badge enviado com sucesso",
        description: "A imagem do badge foi salva."
      });
    } catch (error: any) {
      console.error("Erro ao enviar badge:", error);
      toast({
        title: "Erro ao enviar badge",
        description: error.message || "Ocorreu um erro ao enviar a imagem do badge",
        variant: "destructive"
      });
    } finally {
      setUploadingBadge(false);
    }
  };

  // Remove badge image
  const handleRemoveBadge = () => {
    setBadgePreview(null);
    updateFormData("badgeImageUrl", null);
  };

  // Handle loot box rewards selection
  const handleLootBoxRewardsChange = (rewards: LootBoxRewardType[]) => {
    updateFormData("selectedLootBoxRewards", rewards);
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

          {formData.hasBadges && (
            <div className="pl-6 pr-1 py-2 space-y-3 bg-galaxy-purple/10 rounded-md">
              <p className="text-sm font-medium">Imagem do Badge</p>
              
              {badgePreview ? (
                <div className="relative w-24 h-24 mx-auto">
                  <img 
                    src={badgePreview} 
                    alt="Preview do badge" 
                    className="w-full h-full object-contain"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute -top-2 -right-2 h-6 w-6" 
                    onClick={handleRemoveBadge}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-galaxy-purple/40 rounded-md p-4 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="badge-upload" className="cursor-pointer text-neon-cyan hover:underline">
                      Enviar imagem do badge
                    </label>
                    <input
                      id="badge-upload"
                      type="file"
                      accept=".svg,image/*"
                      className="sr-only"
                      onChange={handleBadgeUpload}
                      disabled={uploadingBadge}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      SVG recomendado (máx 500KB)
                    </p>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-gray-400">
                O badge será exibido na galeria de conquistas do usuário. Use imagens de boa qualidade.
              </p>
            </div>
          )}

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

          {formData.hasLootBox && (
            <MissionRewardsStep
              hasBadge={formData.hasBadges}
              onHasBadgeChange={(value) => updateFormData("hasBadges", value)}
              hasLootBox={formData.hasLootBox}
              onHasLootBoxChange={(value) => updateFormData("hasLootBox", value)}
              sequenceBonus={formData.streakBonus}
              onSequenceBonusChange={(value) => updateFormData("streakBonus", value)}
              selectedLootBoxRewards={formData.selectedLootBoxRewards || []}
              onSelectedLootBoxRewardsChange={handleLootBoxRewardsChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default memo(RewardsStep);
