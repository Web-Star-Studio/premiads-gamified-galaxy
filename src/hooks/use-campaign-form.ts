
import { useState, useEffect } from 'react';
import { FormData, initialFormData } from '@/components/advertiser/campaign-form/types';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useToast } from '@/hooks/use-toast';
import { Mission } from '@/hooks/useMissionsTypes';

export const useCampaignForm = (editCampaign?: Mission | null) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { availableCredits } = useUserCredits();
  const { toast } = useToast();
  
  // Total number of form steps
  const totalSteps = 4;
  
  // Load campaign data for editing
  useEffect(() => {
    if (editCampaign) {
      // Map the campaign data to the form structure
      setFormData({
        ...initialFormData,
        title: editCampaign.title,
        type: editCampaign.type as any,
        description: editCampaign.description || '',
        audience: editCampaign.audience || editCampaign.target_audience || '',
        pointsRange: [
          editCampaign.points - 10,
          editCampaign.points + 10
        ],
        randomPoints: false,
        pointsValue: editCampaign.points,
        hasBadges: editCampaign.has_badges || false,
        hasLootBox: editCampaign.has_lootbox || false,
        startDate: editCampaign.start_date ? new Date(editCampaign.start_date) : new Date(),
        endDate: editCampaign.end_date ? new Date(editCampaign.end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        streakBonus: editCampaign.streak_bonus || false,
        streakMultiplier: editCampaign.streak_multiplier || 1.2,
        requirements: editCampaign.requirements as string[] || [],
        minPurchase: editCampaign.min_purchase,
        targetFilter: editCampaign.target_filter || initialFormData.targetFilter
      });
    }
  }, [editCampaign]);
  
  // Update form data
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prevData => ({
      ...prevData,
      ...updates
    }));
  };
  
  // Navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  // Validate step by step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Info
        if (!formData.title || !formData.type || !formData.description) {
          toast({
            title: "Informações incompletas",
            description: "Preencha todos os campos obrigatórios para continuar",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 2: // Rewards
        // Check if user has enough credits when creating a new campaign
        if (!editCampaign) {
          const cost = formData.pointsValue || formData.pointsRange[0];
          if (cost > availableCredits) {
            toast({
              title: "Créditos insuficientes",
              description: `Você precisa de ${cost} créditos para esta campanha, mas possui apenas ${availableCredits}`,
              variant: "destructive",
            });
            return false;
          }
        }
        return true;
        
      case 3: // Dates
        if (!formData.startDate || !formData.endDate) {
          toast({
            title: "Datas não definidas",
            description: "Defina as datas de início e fim da campanha",
            variant: "destructive",
          });
          return false;
        }
        
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        
        if (end <= start) {
          toast({
            title: "Datas inválidas",
            description: "A data de término deve ser posterior à data de início",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      case 4: // Requirements
        if (!formData.requirements || (Array.isArray(formData.requirements) && formData.requirements.length === 0)) {
          toast({
            title: "Requisitos não definidos",
            description: "Adicione pelo menos um requisito para a campanha",
            variant: "destructive",
          });
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };
  
  // Handle step transition
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      goToNextStep();
    }
  };
  
  return {
    formData,
    updateFormData,
    currentStep,
    totalSteps,
    goToNextStep: handleNextStep,
    goToPreviousStep,
    isSubmitting,
    setIsSubmitting
  };
};
