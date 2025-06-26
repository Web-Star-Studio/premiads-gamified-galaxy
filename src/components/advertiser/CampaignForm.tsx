import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormProgress } from './campaign-form/FormProgress';
import { FormNavigation } from './campaign-form/FormNavigation';
import BasicInfoStep from './campaign-form/BasicInfoStep';
import RequirementsStep from './campaign-form/RequirementsStep';
import RewardsStep from './campaign-form/RewardsStep';
import DatesStep from './campaign-form/DatesStep';
import { Campaign } from './campaignData';
import { useSounds } from '@/hooks/use-sounds';
import { FormData, initialFormData } from './campaign-form/types';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import useCampaignOperations from '@/hooks/advertiser/useCampaignOperations';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUserCredits } from '@/hooks/useUserCredits';

interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const { playSound } = useSounds();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createCampaign, updateCampaign, isSubmitting } = useCampaignOperations();
  const { userCredits, refreshCredits } = useUserCredits();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(
    editCampaign ? {
      ...initialFormData,
      title: editCampaign.title || '',
      description: editCampaign.description || '',
      type: editCampaign.type || '',
      audience: editCampaign.target_audience || 'all',
      requirements: editCampaign.requirements || '',
      startDate: editCampaign.start_date ? new Date(editCampaign.start_date) : new Date(),
      endDate: editCampaign.end_date ? new Date(editCampaign.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hasBadges: editCampaign.has_badge || false,
      hasLootBox: editCampaign.has_lootbox || false,

      rifas: editCampaign.rifas || 10,
      ticketsReward: editCampaign.tickets_reward || 0,
      cashbackReward: editCampaign.cashback_reward || 0,
      maxParticipants: editCampaign.max_participants || 100,
      cashbackAmountPerRaffle: editCampaign.cashback_amount_per_raffle || 5.00,
      targetFilter: editCampaign.target_filter || initialFormData.targetFilter,
      badgeImageUrl: editCampaign.badge_image_url || null,
      selectedLootBoxRewards: editCampaign.selected_lootbox_rewards || initialFormData.selectedLootBoxRewards,
      formSchema: editCampaign.form_schema || []
    } : initialFormData
  );

  // Refresh credits when component mounts
  useEffect(() => {
    refreshCredits();
  }, [refreshCredits]);
  
  const totalSteps = 4;
  const steps = [
    "Informações Básicas",
    "Requisitos",
    "Recompensas", 
    "Datas"
  ];
  
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      playSound('pop');
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      playSound('pop');
    }
  };
  
  const handleSubmit = async () => {
    // Calcular custo total
    const totalCost = formData.rifas * (formData.maxParticipants || 100);
    
    // Verificar saldo antes de submeter
    if (!editCampaign && userCredits < totalCost) {
      toast({
        title: 'Saldo insuficiente',
        description: `Você precisa de ${totalCost} rifas para criar esta campanha. Saldo atual: ${userCredits} rifas.`,
        variant: 'destructive',
      });
      return;
    }
    
    try {
      let result: { success: boolean; shouldRedirect?: boolean };
      
      if (editCampaign) {
        result = await updateCampaign(editCampaign.id, formData);
      } else {
        result = await createCampaign(formData);
      }
      
      if (result.success) {
        playSound('success');
        console.log('🎯 Resultado da operação:', result);
        
        // Refresh credits imediatamente
        await refreshCredits();
        
        // Emitir evento personalizado para notificar componentes pais
        const campaignCreatedEvent = new CustomEvent('campaignCreated', {
          detail: { 
            success: true, 
            timestamp: Date.now(),
            isNewCampaign: !editCampaign
          }
        });
        window.dispatchEvent(campaignCreatedEvent);
        
        // Chamar onClose imediatamente para resetar o estado local
        console.log('🔄 Chamando onClose() para resetar estado do formulário...');
        onClose();
        
        // Redirecionamento imediato e direto para a página de campanhas
        if (result.shouldRedirect) {
          console.log('🚀 Iniciando redirecionamento para /anunciante/campanhas...');
          
          // Usar múltiplas estratégias para garantir o redirecionamento
          const redirectToCampaigns = () => {
            console.log('📍 Executando navigate para /anunciante/campanhas');
            navigate("/anunciante/campanhas", { 
              replace: true, // Replace para evitar voltar para o formulário
              state: { 
                fromCampaignCreation: true,
                campaignCreated: true,
                timestamp: Date.now()
              }
            });
          };
          
          // Primeira tentativa: imediato
          redirectToCampaigns();
          
          // Segunda tentativa: com requestAnimationFrame
          requestAnimationFrame(() => {
            console.log('🔄 Tentativa de redirecionamento via requestAnimationFrame');
            redirectToCampaigns();
          });
          
          // Terceira tentativa: com timeout como fallback
          setTimeout(() => {
            console.log('⏰ Tentativa de redirecionamento via timeout (fallback)');
            redirectToCampaigns();
          }, 100);
          
          return; // Sair da função imediatamente
        }
      }
      
    } catch (error: any) {
      console.error("Erro ao salvar campanha:", error);
      toast({
        title: "Erro ao salvar campanha",
        description: error.message || "Ocorreu um erro ao salvar a campanha",
        variant: "destructive",
      });
      playSound('error');
    }
  };
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      case 2:
        return <RequirementsStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      case 3:
        return <RewardsStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      case 4:
        return <DatesStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      default:
        return null;
    }
  };
  
  const isLastStep = currentStep === totalSteps;
  const isFormValid = () => {
    return formData.title && formData.description && formData.startDate && formData.endDate;
  };
  
  // Calcular custo total para exibição
  const totalCost = formData.rifas * (formData.maxParticipants || 100);
  
  return (
    <Card className="bg-galaxy-darkPurple border-galaxy-purple">
      <CardHeader className="pb-4">
        <FormProgress 
          step={currentStep} 
          title={steps[currentStep - 1]} 
        />
        
        {/* Mostrar informações de custo e saldo */}
        <div className="bg-galaxy-dark/50 p-3 rounded-lg border border-galaxy-purple/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Custo total da campanha:</span>
            <span className="font-semibold text-neon-cyan">
              {totalCost.toLocaleString()} rifas
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-muted-foreground">Seu saldo atual:</span>
            <span className={`font-semibold ${userCredits >= totalCost ? 'text-green-400' : 'text-red-400'}`}>
              {userCredits.toLocaleString()} rifas
            </span>
          </div>
          {!editCampaign && userCredits < totalCost && (
            <div className="text-xs text-red-400 mt-2">
              ⚠️ Saldo insuficiente para criar esta campanha
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-galaxy-purple/20 pt-4">
        {isLastStep ? (
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid() || (!editCampaign && userCredits < totalCost)}
              className="gap-2"
            >
              {isSubmitting ? 'Processando...' : editCampaign ? 'Atualizar' : 'Criar Campanha'}
              {!isSubmitting && <Save className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <FormNavigation 
            step={currentStep}
            totalSteps={steps.length}
            handleBack={goToPreviousStep}
            handleNext={goToNextStep}
            onClose={onClose}
            isNextDisabled={false}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default CampaignForm;
