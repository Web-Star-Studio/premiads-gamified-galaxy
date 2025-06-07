
import { useState, useCallback } from 'react';
import { FormData } from '@/components/advertiser/campaign-form/types';
import { Campaign } from '@/components/advertiser/campaignData';

interface UseCampaignFormProps {
  editCampaign?: Campaign | null;
  onClose: () => void;
}

export const useCampaignForm = ({ editCampaign, onClose }: UseCampaignFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    title: editCampaign?.title || '',
    description: editCampaign?.description || '',
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
      return false;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onClose();
    return true;
  }, [validateForm, onClose]);

  const submitForm = handleSubmit; // Alias for compatibility

  const resetForm = useCallback(() => {
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
