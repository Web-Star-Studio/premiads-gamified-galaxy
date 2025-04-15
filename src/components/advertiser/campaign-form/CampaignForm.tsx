
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Campaign } from "../campaignData";
import { CampaignFormProps, initialFormData, FormData, MissionType } from "./types";
import BasicInfoStep from "./BasicInfoStep";
import RewardsStep from "./RewardsStep";
import DatesStep from "./DatesStep";
import RequirementsStep from "./RequirementsStep";
import FormNavigation from "./FormNavigation";
import FormProgress from "./FormProgress";

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  // If editing, populate form with campaign data
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
        // Other fields would be populated here if they were available in the campaign data
      });
    }
  }, [editCampaign]);

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

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Here we would submit the form data to the server
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

  // Check if current step is valid
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
      return true; // Rewards are optional
    }
    if (step === 4) {
      return formData.startDate !== "" && formData.endDate !== "";
    }
    return false;
  };

  return (
    <Card className="relative overflow-hidden border-neon-cyan/30 shadow-[0_0_20px_rgba(0,255,231,0.2)]">
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        onClick={onClose}
      >
        <X className="w-4 h-4" />
      </Button>

      <CardHeader className="pb-3">
        <CardTitle>
          <FormProgress step={step} title={getStepTitle()} />
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <BasicInfoStep formData={formData} updateFormData={updateFormData} />
          </motion.div>
        )}

        {/* Step 2: Requirements */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <RequirementsStep formData={formData} updateFormData={updateFormData} />
          </motion.div>
        )}

        {/* Step 3: Rewards */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <RewardsStep formData={formData} updateFormData={updateFormData} />
          </motion.div>
        )}

        {/* Step 4: Dates & Streaks */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <DatesStep formData={formData} updateFormData={updateFormData} />
          </motion.div>
        )}

        <FormNavigation 
          step={step}
          totalSteps={4}
          handleNext={handleNext} 
          handleBack={handleBack} 
          onClose={onClose}
          isNextDisabled={!isCurrentStepValid()}
        />
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
