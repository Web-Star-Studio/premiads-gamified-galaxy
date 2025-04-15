
import { useState, useEffect } from "react";
import { Campaign } from "@/components/advertiser/campaignData";
import { FormData, initialFormData, MissionType } from "@/components/advertiser/campaign-form/types";

interface UseCampaignFormProps {
  editCampaign?: Campaign | null;
  onClose: () => void;
}

interface UseCampaignFormReturn {
  step: number;
  formData: FormData;
  setStep: (step: number) => void;
  updateFormData: (field: string, value: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  getStepTitle: () => string;
  isCurrentStepValid: () => boolean;
}

export function useCampaignForm({ editCampaign, onClose }: UseCampaignFormProps): UseCampaignFormReturn {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // Se estiver editando, preencha o formulário com os dados da campanha
  useEffect(() => {
    if (editCampaign) {
      const pointsRange = editCampaign.reward.includes("-") 
        ? editCampaign.reward.split("-").map(Number) 
        : [parseInt(editCampaign.reward), parseInt(editCampaign.reward)];
      
      setFormData({
        ...initialFormData,
        title: editCampaign.title,
        audience: editCampaign.audience,
        pointsRange: pointsRange as [number, number],
        // Outros campos seriam preenchidos aqui se estivessem disponíveis nos dados da campanha
      });
    }
  }, [editCampaign]);

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Aqui enviaríamos os dados do formulário para o servidor
    console.log("Submitting form data:", formData);
    onClose();
  };

  const getStepTitle = () => {
    if (editCampaign) return "Editar Missão";
    
    if (step === 1) return "Criar Nova Missão";
    if (step === 2) return "Definir Requisitos";
    if (step === 3) return "Definir Recompensas";
    if (step === 4) return "Configurar Datas";
    
    return "";
  };

  // Verifica se o passo atual é válido
  const isCurrentStepValid = () => {
    if (step === 1) {
      return formData.title.trim() !== "" && 
             formData.type !== "" && 
             formData.audience !== "";
    }
    if (step === 2) {
      return formData.requirements.length > 0;
    }
    if (step === 3) {
      return true; // Recompensas são opcionais
    }
    if (step === 4) {
      return formData.startDate !== "" && formData.endDate !== "";
    }
    return false;
  };

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
