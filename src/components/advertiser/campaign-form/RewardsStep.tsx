import { memo, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { FormData } from "./types";
import { useUserCredits } from '@/hooks/useUserCredits';
import { Card, CardContent } from "@/components/ui/card";
import { Info, AlertTriangle } from "lucide-react";
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
 * Manages rifas, badges, and other reward options
 */
const RewardsStep = ({ formData, updateFormData }: RewardsStepProps) => {
  const { availableCredits: totalRifasDisponiveis, isLoading, error } = useUserCredits();
  const [uploadingPrizeImage, setUploadingPrizeImage] = useState(false);
  const [prizeImagePreview, setPrizeImagePreview] = useState<string | null>(formData.extraPrizeImageUrl || null);
  const { toast } = useToast();
  
  const [maxRifas, setMaxRifas] = useState(totalRifasDisponiveis);
  const [maxParticipants, setMaxParticipants] = useState(10000); // Default max
  
  const minRifas = 1;
  const minParticipants = 1;
  const rifasStep = 1;

  const totalRifasAtribuidas = formData.rifas * formData.maxParticipants;
  const excedeLimite = totalRifasAtribuidas > totalRifasDisponiveis;

  useEffect(() => {
    if (error) console.error('Erro ao carregar créditos:', error)
  }, [error]);

  useEffect(() => {
    if (totalRifasDisponiveis > 0) {
      // Quando "Rifas por Participante" muda, ajusta o máximo de participantes
      if (formData.rifas > 0) {
        const newMaxParticipants = Math.floor(totalRifasDisponiveis / formData.rifas);
        setMaxParticipants(Math.max(newMaxParticipants, minParticipants));

        if (formData.maxParticipants > newMaxParticipants) {
          updateFormData("maxParticipants", Math.max(newMaxParticipants, minParticipants));
        }
      } else {
        setMaxParticipants(10000); // Reset to default if rifas is 0
      }
    }
  }, [formData.rifas, totalRifasDisponiveis, updateFormData]);

  useEffect(() => {
    if (totalRifasDisponiveis > 0) {
      // Quando "Máximo de Participantes" muda, ajusta o máximo de rifas por participante
      if (formData.maxParticipants > 0) {
        const newMaxRifas = Math.floor(totalRifasDisponiveis / formData.maxParticipants);
        setMaxRifas(Math.max(newMaxRifas, minRifas));

        if (formData.rifas > newMaxRifas) {
          updateFormData("rifas", Math.max(newMaxRifas, minRifas));
        }
      } else {
        setMaxRifas(totalRifasDisponiveis); // Reset to total available if no participants
      }
    }
  }, [formData.maxParticipants, totalRifasDisponiveis, updateFormData]);

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
          <Card className="bg-yellow-900/20 border-yellow-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="text-yellow-400 h-4 w-4" />
                <span className="text-sm font-medium text-yellow-400">Saldo disponível: {totalRifasDisponiveis} créditos</span>
              </div>
              <p className="text-xs text-gray-400">
                Os créditos são consumidos quando a campanha é publicada.
                Cada rifa atribuída à missão consome 1 crédito da sua conta.
              </p>
            </CardContent>
          </Card>

          {excedeLimite && (
            <Card className="bg-destructive/20 border-destructive/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="text-destructive h-4 w-4" />
                  <span className="text-sm font-medium text-destructive">Limite de Rifas Excedido</span>
                </div>
                <p className="text-xs text-red-400">
                  A combinação de rifas por participante e o máximo de participantes ({totalRifasAtribuidas}) 
                  ultrapassa seu saldo de {totalRifasDisponiveis} rifas. Ajuste os valores para continuar.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-green-900/20 border-green-500/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="text-green-400 h-4 w-4" />
                <span className="text-sm font-medium text-green-400">Sistema de Cashback</span>
              </div>
              <p className="text-xs text-gray-400">
                Para cada rifa disponibilizada na campanha, os participantes poderão resgatar cashback em dinheiro. 
                Cada rifa vale <strong className="text-green-400">R$ 5,00</strong> de cashback.
                Defina quantos cashbacks estarão disponíveis para resgate.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="rifas-slider" className="text-sm font-medium">Rifas por Participante</label>
              <div className="flex items-center space-x-3">
                <>
                  <span className="text-sm text-yellow-400">{formData.rifas}</span>
                  <Input
                    id="rifas-input"
                    type="number"
                    min={minRifas}
                    max={maxRifas}
                    step={rifasStep}
                    value={formData.rifas}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10)
                      if (!isNaN(val))
                        {updateFormData("rifas", Math.min(Math.max(val, minRifas), maxRifas))}
                    }}
                    className="w-24 bg-gray-800 border-gray-700 focus:border-yellow-400 text-right"
                    disabled={totalRifasDisponiveis === 0}
                  />
                </>
              </div>
            </div>
            <Slider
              id="rifas-slider"
              value={[formData.rifas]}
              min={minRifas}
              max={maxRifas}
              step={rifasStep}
              disabled={totalRifasDisponiveis === 0}
              onValueChange={(value) => updateFormData("rifas", value[0])}
              className="py-4"
              aria-valuemin={minRifas}
              aria-valuemax={maxRifas}
              aria-valuenow={formData.rifas}
              aria-valuetext={`${formData.rifas} rifas`}
            />
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <Info className="text-yellow-400 h-4 w-4" />
                <span className="text-sm font-medium text-yellow-400">Rifas da Missão</span>
              </div>
              <p className="text-xs text-gray-400">
                Define quantas rifas cada participante receberá ao concluir esta missão.
                Este valor será debitado do seu saldo de créditos no momento da criação da campanha.
                {formData.rifas > 0 && (
                  <span className="block mt-1 text-yellow-300">
                    ⚠️ {formData.rifas} créditos serão debitados da sua conta.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Controle de Participantes Máximos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="participants-slider" className="text-sm font-medium">Máximo de Participantes</label>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-pink-400">{formData.maxParticipants}</span>
                <Input
                  id="participants-input"
                  type="number"
                  min={minParticipants}
                  max={maxParticipants}
                  step={1}
                  value={formData.maxParticipants}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10)
                    if (!isNaN(val))
                      {updateFormData("maxParticipants", Math.min(Math.max(val, minParticipants), maxParticipants))}
                  }}
                  className="w-24 bg-gray-800 border-gray-700 focus:border-pink-400 text-right"
                />
              </div>
            </div>
            <Slider
              id="participants-slider"
              value={[formData.maxParticipants]}
              min={minParticipants}
              max={maxParticipants}
              step={1}
              onValueChange={(value) => updateFormData("maxParticipants", value[0])}
              className="py-4"
              aria-valuemin={minParticipants}
              aria-valuemax={maxParticipants}
              aria-valuenow={formData.maxParticipants}
              aria-valuetext={`${formData.maxParticipants} participantes máximos`}
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


