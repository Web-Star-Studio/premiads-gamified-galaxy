import { useState, useEffect, useCallback } from "react";
import { Campaign } from "@/components/advertiser/campaignData";
import { FormData, initialFormData, MissionType } from "@/components/advertiser/campaign-form/types";
import { useToast } from "@/hooks/use-toast";

interface UseCampaignFormProps {
  /** Campaign data for editing mode */
  editCampaign?: Campaign | null;
  /** Function called when form is closed or submitted */
  onClose: () => void;
}

interface UseCampaignFormReturn {
  /** Current step in the form wizard (1-4) */
  step: number;
  /** Current form data */
  formData: FormData;
  /** Set current step directly */
  setStep: (step: number) => void;
  /** Update a specific form field */
  updateFormData: (field: string, value: any) => void;
  /** Go to next step or submit form if on last step */
  handleNext: () => void;
  /** Go to previous step */
  handleBack: () => void;
  /** Submit form data */
  handleSubmit: () => void;
  /** Get title for current step */
  getStepTitle: () => string;
  /** Validate current step */
  isCurrentStepValid: () => boolean;
}

/**
 * Custom hook to manage campaign form state and navigation
 * Handles form initialization, validation, and submission
 */
export function useCampaignForm({ editCampaign, onClose }: UseCampaignFormProps): UseCampaignFormReturn {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();
  
  // Initialize form with campaign data if in edit mode
  useEffect(() => {
    if (editCampaign) {
      try {
        const pointsRange = editCampaign.reward.includes("-") 
          ? editCampaign.reward.split("-").map(Number) 
          : [parseInt(editCampaign.reward), parseInt(editCampaign.reward)];
        
        // Ensure points are valid numbers
        if (pointsRange.some(isNaN)) {
          throw new Error("Invalid points format in campaign data");
        }
        
        setFormData({
          ...initialFormData,
          title: editCampaign.title,
          audience: editCampaign.audience,
          pointsRange: pointsRange as [number, number],
          // Other fields would be populated here if available in campaign data
        });
      } catch (error) {
        console.error("Error parsing campaign data:", error);
        toast({
          title: "Erro ao carregar dados da campanha",
          description: "Não foi possível carregar alguns dados da campanha para edição.",
          variant: "destructive",
        });
      }
    }
  }, [editCampaign, toast]);

  /**
   * Update a specific field in the form data
   */
  const updateFormData = useCallback((field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  /**
   * Progress to next step or submit if on last step
   */
  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  }, [step]);

  /**
   * Return to previous step
   */
  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  /**
   * Submit form data and close form
   */
  const handleSubmit = useCallback(() => {
    try {
      // Here we would send the data to an API or process it
      console.log("Submitting form data:", formData);
      
      // Show success message
      toast({
        title: editCampaign ? "Missão atualizada" : "Missão criada",
        description: editCampaign 
          ? "A missão foi atualizada com sucesso."
          : "A nova missão foi criada com sucesso.",
      });
      
      // Close the form
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro ao salvar missão",
        description: "Ocorreu um erro ao salvar os dados da missão.",
        variant: "destructive",
      });
    }
  }, [formData, editCampaign, onClose, toast]);

  /**
   * Get the title for the current step
   */
  const getStepTitle = useCallback(() => {
    if (editCampaign) return "Editar Missão";
    
    switch (step) {
      case 1: return "Criar Nova Missão";
      case 2: return "Definir Requisitos";
      case 3: return "Definir Recompensas";
      case 4: return "Configurar Datas";
      default: return "";
    }
  }, [step, editCampaign]);

  /**
   * Validate the current step
   */
  const isCurrentStepValid = useCallback(() => {
    switch (step) {
      case 1:
        return formData.title.trim().length >= 3 && 
               formData.type !== "" && 
               formData.audience !== "";
      case 2:
        return formData.requirements.length > 0;
      case 3:
        return true; // Rewards are optional
      case 4:
        return formData.startDate !== "" && 
               formData.endDate !== "" && 
               formData.startDate <= formData.endDate;
      default:
        return false;
    }
  }, [step, formData]);

  return {
    step,
    formData,
    setStep,
    updateFormData,
    handleNext,
    handleBack,
    handleSubmit,
    getStepTitle,
    isCurrentStepValid
  };
}
