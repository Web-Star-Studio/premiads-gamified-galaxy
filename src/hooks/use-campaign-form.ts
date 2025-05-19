
import { useState, useEffect } from 'react';
import { FormData, initialFormData } from '@/components/advertiser/campaign-form/types';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useToast } from '@/hooks/use-toast';
import { Campaign } from '@/components/advertiser/campaignData';
import useCampaignOperations from './advertiser/useCampaignOperations';
import { useNavigate } from 'react-router-dom';

interface UseCampaignFormProps {
  editCampaign?: Campaign | null;
  onClose: () => void;
}

export const useCampaignForm = ({ editCampaign, onClose }: UseCampaignFormProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { availableCredits } = useUserCredits();
  const { toast } = useToast();
  const { createCampaign, updateCampaign, isSubmitting: isOperationSubmitting } = useCampaignOperations();
  const navigate = useNavigate();
  
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
        audience: editCampaign.target_audience || '',
        pointsRange: [
          editCampaign.points - 10,
          editCampaign.points + 10
        ],
        randomPoints: false,
        pointsValue: editCampaign.points,
        hasBadges: (editCampaign as any).has_badges || false,
        hasLootBox: (editCampaign as any).has_lootbox || false,
        startDate: (editCampaign as any).start_date ? new Date((editCampaign as any).start_date) : new Date(),
        endDate: (editCampaign as any).end_date ? new Date((editCampaign as any).end_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        streakBonus: (editCampaign as any).streak_bonus || false,
        streakMultiplier: (editCampaign as any).streak_multiplier || 1.2,
        requirements: (editCampaign as any).requirements as string[] || [],
        minPurchase: (editCampaign as any).min_purchase,
        targetFilter: (editCampaign as any).target_filter || initialFormData.targetFilter
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
  
  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      let success;
      
      if (editCampaign) {
        // Update existing campaign
        success = await updateCampaign(editCampaign.id, formData);
      } else {
        // Create new campaign
        success = await createCampaign(formData);
      }
      
      if (success) {
        toast({
          title: editCampaign ? 'Campanha atualizada' : 'Campanha criada',
          description: editCampaign 
            ? 'Sua campanha foi atualizada com sucesso'
            : 'Sua campanha foi criada com sucesso'
        });
        
        // Redirect after success
        setTimeout(() => {
          navigate('/anunciante/campanhas');
          onClose();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error submitting campaign:', error);
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro ao processar a campanha',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Navigation functions
  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prevStep => prevStep + 1);
    } else if (currentStep === totalSteps) {
      // Submit the form when at the last step
      handleSubmit();
    }
  };
  
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };
  
  // Check if form is valid for submission
  const isFormValid = (): boolean => {
    // Basic validation for required fields
    if (!formData.title || !formData.type) {
      return false;
    }
    
    if (!formData.startDate || !formData.endDate) {
      return false;
    }
    
    // Check if end date is after start date
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      return false;
    }
    
    return true;
  };
  
  return {
    formData,
    updateFormData,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    isSubmitting: isSubmitting || isOperationSubmitting,
    setIsSubmitting,
    isFormValid,
    handleSubmit
  };
};
