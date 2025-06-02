import { memo, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";
import { useUserCredits } from '@/hooks/useUserCredits';
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [uploadingPrizeImage, setUploadingPrizeImage] = useState(false);
  const [prizeImagePreview, setPrizeImagePreview] = useState<string | null>(formData.extraPrizeImageUrl || null);
  const { toast } = useToast();
  
  // Limites de pontuação baseados nos créditos disponíveis
  const minPoints = 10;
  // Máximo de pontos proporcional aos créditos disponíveis
  const maxPoints = userCredits;
  const pointsStep = 5;

  // Inicializa e mantém créditos dinâmicos via store e real-time
  useEffect(() => {
    if (error) console.error('Erro ao carregar créditos:', error)
  }, [error]);

  // Handle prize image upload
  const handlePrizeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.includes('image/')) {
      toast({
        title: 'Formato inválido',
        description: 'Envie uma imagem (png, jpg, svg...)',
        variant: 'destructive'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => setPrizeImagePreview(ev.target?.result as string)
    reader.readAsDataURL(file)

    try {
      setUploadingPrizeImage(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const fileName = `${user.id}/${Date.now()}_${file.name}`
      const { data, error } = await supabase.storage.from('extra_prizes').upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })
      if (error) throw error

      const { data: publicUrlData } = supabase.storage.from('extra_prizes').getPublicUrl(data.path)

      updateFormData('extraPrizeImageUrl', publicUrlData.publicUrl)
      toast({ title: 'Imagem enviada com sucesso' })
    } catch (err: any) {
      console.error('Erro ao enviar imagem do prêmio:', err)
      toast({ title: 'Erro ao enviar imagem', description: err.message, variant: 'destructive' })
    } finally {
      setUploadingPrizeImage(false)
    }
  }

  const handleRemovePrizeImage = () => {
    setPrizeImagePreview(null)
    updateFormData('extraPrizeImageUrl', null)
  }

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
              <div className="flex items-center space-x-3">
                <>
                  <span className="text-sm text-neon-cyan">{formData.pointsValue}</span>
                  <Input
                    id="points-input"
                    type="number"
                    min={minPoints}
                    max={maxPoints}
                    step={pointsStep}
                    value={formData.pointsValue}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val))
                        updateFormData("pointsValue", Math.min(Math.max(val, minPoints), maxPoints))
                    }}
                    className="w-24 bg-gray-800 border-gray-700 focus:border-neon-cyan text-right"
                    disabled={userCredits === 0}
                  />
                </>
              </div>
            </div>
            <Slider
              id="points-slider"
              value={[formData.pointsValue]}
              min={minPoints}
              max={maxPoints}
              step={pointsStep}
              disabled={userCredits === 0}
              onValueChange={(value) => updateFormData("pointsValue", value[0])}
              className="py-4"
              aria-valuemin={minPoints}
              aria-valuemax={maxPoints}
              aria-valuenow={formData.pointsValue}
              aria-valuetext={`${formData.pointsValue} pontos`}
            />
          </div>

          {/* Controle de Participantes Máximos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="participants-slider" className="text-sm font-medium">Máximo de Participantes</label>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-pink-400">{formData.maxParticipants || 100}</span>
                <Input
                  id="participants-input"
                  type="number"
                  min={10}
                  max={10000}
                  step={10}
                  value={formData.maxParticipants || 100}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10)
                    if (!isNaN(val))
                      updateFormData("maxParticipants", Math.min(Math.max(val, 10), 10000))
                  }}
                  className="w-24 bg-gray-800 border-gray-700 focus:border-pink-400 text-right"
                />
              </div>
            </div>
            <Slider
              id="participants-slider"
              value={[formData.maxParticipants || 100]}
              min={10}
              max={10000}
              step={10}
              onValueChange={(value) => updateFormData("maxParticipants", value[0])}
              className="py-4"
              aria-valuemin={10}
              aria-valuemax={10000}
              aria-valuenow={formData.maxParticipants || 100}
              aria-valuetext={`${formData.maxParticipants || 100} participantes máximos`}
            />
          </div>

          <div className="flex items-center justify-between px-1 py-2">
            <div className="space-y-1">
              <p className="text-sm font-medium" id="extra-prize-label">Prêmio Extra</p>
              <p className="text-xs text-gray-400">Ofereça um prêmio adicional para os participantes</p>
            </div>
            <Switch
              id="extra-prize"
              checked={formData.hasLootBox}
              onCheckedChange={(checked) => updateFormData("hasLootBox", checked)}
              aria-labelledby="extra-prize-label"
            />
          </div>

          {formData.hasLootBox && (
            <div className="space-y-4 bg-galaxy-purple/10 rounded-md p-4">
              <div className="space-y-2">
                <label htmlFor="prize-name" className="text-sm font-medium">Nome do Prêmio</label>
                <Input
                  id="prize-name"
                  placeholder="Ex: Camiseta exclusiva PremiAds"
                  value={formData.extraPrizeName || ''}
                  onChange={(e) => updateFormData('extraPrizeName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="prize-description" className="text-sm font-medium">Descrição</label>
                <Textarea
                  id="prize-description"
                  placeholder="Descreva o prêmio extra..."
                  value={formData.extraPrizeDescription || ''}
                  onChange={(e) => updateFormData('extraPrizeDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Imagem do Prêmio</p>
                {prizeImagePreview ? (
                  <div className="relative w-32 h-32 mx-auto">
                    <img src={prizeImagePreview} alt="Preview do prêmio" className="w-full h-full object-contain" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={handleRemovePrizeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-galaxy-purple/40 rounded-md p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="prize-image-upload" className="cursor-pointer text-neon-cyan hover:underline">
                        Enviar imagem do prêmio
                      </label>
                      <input
                        id="prize-image-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handlePrizeImageUpload}
                        disabled={uploadingPrizeImage}
                      />
                      <p className="text-xs text-gray-400 mt-1">PNG ou JPG (máx 2MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default memo(RewardsStep);


