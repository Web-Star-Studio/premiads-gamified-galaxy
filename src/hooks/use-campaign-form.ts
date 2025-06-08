
import { useState, useCallback } from 'react';
import { FormData } from '@/components/advertiser/campaign-form/types';
import { Campaign } from '@/components/advertiser/campaignData';

interface UseCampaignFormProps {
  editCampaign?: Campaign | null;
  onClose: () => void;
}

import { supabase } from '@/integrations/supabase/client'; // Added Supabase client
import { useToast } from '@/hooks/use-toast'; // For showing notifications

export const useCampaignForm = ({ editCampaign, onClose }: UseCampaignFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast(); // Initialize toast
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    title: editCampaign?.title || '',
    description: editCampaign?.description || '',
    type: editCampaign?.type || '', 
    audience: editCampaign?.audience || 'all',
    requirements: editCampaign?.requirements || '',
    startDate: editCampaign?.startDate ? new Date(editCampaign.startDate) : new Date(),
    endDate: editCampaign?.endDate ? new Date(editCampaign.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    hasBadges: editCampaign?.hasBadges || false,
    hasLootBox: editCampaign?.hasLootBox || false,
    hasExtraPrize: editCampaign?.hasExtraPrize || false,
    streakBonus: editCampaign?.streakBonus || false,
    streakMultiplier: editCampaign?.streakMultiplier || 1.2,
    randomPoints: editCampaign?.randomPoints || false,
    pointsRange: editCampaign?.pointsRange || [10, 50],
    rifas: editCampaign?.rifas || 10,
    ticketsReward: editCampaign?.ticketsReward || 0,
    cashbackReward: editCampaign?.cashbackReward || 0,
    maxParticipants: editCampaign?.maxParticipants || 100,
    cashbackAmountPerRaffle: editCampaign?.cashbackAmountPerRaffle || 5.00,
    targetFilter: editCampaign?.targetFilter || {
      age: ["18", "65"],
      gender: "all",
      region: [],
      interests: []
    },
    badgeImageUrl: editCampaign?.badgeImageUrl || null,
    extraPrizeName: editCampaign?.extraPrizeName || '',
    extraPrizeDescription: editCampaign?.extraPrizeDescription || '',
    extraPrizeImageUrl: editCampaign?.extraPrizeImageUrl || null,
    minPurchase: editCampaign?.minPurchase || 0,
    selectedLootBoxRewards: editCampaign?.selectedLootBoxRewards || ['credit_bonus', 'random_badge', 'multiplier', 'level_up', 'daily_streak_bonus', 'raffle_ticket'],
    formSchema: editCampaign?.formSchema || []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback((field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const updateField = updateFormData; // Alias for compatibility

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description) {
      newErrors.description = 'Descrição é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const isFormValid = useCallback(() => {
    return formData.title && formData.description && formData.startDate && formData.endDate;
  }, [formData]);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuário não autenticado.");
      }

      // Construct rewards_config from formData
      const constructedRewardsConfig = {
        rifas: formData.rifas,
        tickets_reward: formData.ticketsReward,
        cashback_reward: formData.cashbackReward,
        has_badges: formData.hasBadges,
        badge_image_url: formData.badgeImageUrl,
        has_loot_box: formData.hasLootBox,
        selected_loot_box_rewards: formData.selectedLootBoxRewards,
        has_extra_prize: formData.hasExtraPrize,
        extra_prize_name: formData.extraPrizeName,
        extra_prize_description: formData.extraPrizeDescription,
        extra_prize_image_url: formData.extraPrizeImageUrl,
        streak_bonus: formData.streakBonus,
        streak_multiplier: formData.streakMultiplier,
        random_points: formData.randomPoints,
        points_range: formData.pointsRange,
        cashback_amount_per_raffle: formData.cashbackAmountPerRaffle,
        // min_purchase is likely part of missionData directly or targeting_criteria, not rewards_config
      };

      const missionData = {
        title: formData.title,
        description: formData.description,
        advertiser_id: user.id,
        created_by: user.id, // Also setting created_by to the current user
        status: 'active', // Default status for new campaigns
        start_date: new Date(formData.startDate).toISOString(),
        end_date: new Date(formData.endDate).toISOString(),
        type: formData.type, // Changed from mission_type to type to match Supabase client insert type
        audience_type: formData.audience, // Corrected to audience_type from schema
        requirements: formData.requirements, // Stored as JSON. If this is a string from a textarea, it's fine. If it's meant to be structured JSON, ensure it's parsed or built correctly.
        max_participants: formData.maxParticipants,
        rewards_config: constructedRewardsConfig, // Use the constructed object
        targeting_criteria: formData.targetFilter, // Stored as JSON, assuming formData.targetFilter is already a complete object
        min_purchase_amount: formData.minPurchase, // Corrected from schema
        form_schema: formData.formSchema, // Stored as JSON, assuming formData.formSchema is already a complete array/object
        // campaign_image_url: formData.campaignImageUrl, // Add if you have this in formData
        // completion_xp: formData.completionXp, // Add if you have this in formData
        // is_public: formData.isPublic, // Add if you have this in formData
      };

      let result;
      if (editCampaign && editCampaign.id) {
        const { data, error } = await supabase
          .from('missions')
          .update(missionData)
          .eq('id', editCampaign.id)
          .select();
        if (error) throw error;
        result = data;
        toast({
          title: "Campanha Atualizada!",
          description: "A campanha foi atualizada com sucesso.",
        });
      } else {
        const { data, error } = await supabase
          .from('missions')
          .insert([missionData])
          .select();
        if (error) throw error;
        result = data;
        toast({
          title: "Campanha Criada!",
          description: "Sua nova campanha foi criada com sucesso.",
        });
      }
      
      console.log('Supabase result:', result);
      onClose();
      return true;

    } catch (error: any) {
      console.error("Erro ao salvar campanha:", error);
      toast({
        title: "Erro ao Salvar",
        description: error.message || "Não foi possível salvar a campanha.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onClose, toast, editCampaign]);

  const submitForm = handleSubmit; // Alias for compatibility

  const resetForm = useCallback(() => {
    // ... (resetForm logic remains the same)
    setFormData({
      title: '',
      description: '',
      type: '',
      audience: 'all',
      requirements: '',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hasBadges: false,
      hasLootBox: false,
      hasExtraPrize: false,
      streakBonus: false,
      streakMultiplier: 1.2,
      randomPoints: false,
      pointsRange: [10, 50],
      rifas: 10,
      ticketsReward: 0,
      cashbackReward: 0,
      maxParticipants: 100,
      cashbackAmountPerRaffle: 5.00,
      targetFilter: {
        age: ["18", "65"],
        gender: "all",
        region: [],
        interests: []
      },
      badgeImageUrl: null,
      extraPrizeName: '',
      extraPrizeDescription: '',
      extraPrizeImageUrl: null,
      minPurchase: 0,
      selectedLootBoxRewards: ['credit_bonus', 'random_badge', 'multiplier', 'level_up', 'daily_streak_bonus', 'raffle_ticket'],
      formSchema: []
    });
    setErrors({});
    setCurrentStep(1);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    currentStep,
    totalSteps,
    updateFormData,
    updateField,
    validateForm,
    submitForm,
    resetForm,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    isFormValid
  };
};
