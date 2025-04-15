import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Campaign } from "../campaignData";
import { CampaignFormProps, initialFormData, FormData } from "./types";
import BasicInfoStep from "./BasicInfoStep";
import RewardsStep from "./RewardsStep";
import DatesStep from "./DatesStep";
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
    if (step < 3) {
      setStep(step + 1);
    } else {
      onClose();
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

  const getStepTitle = () => {
    if (editCampaign) return "Editar Campanha";
    
    if (step === 1) return "Criar Nova Campanha";
    if (step === 2) return "Definir Recompensas";
    if (step === 3) return "Configurar Datas";
    
    return "";
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

        {/* Step 2: Rewards */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <RewardsStep formData={formData} updateFormData={updateFormData} />
          </motion.div>
        )}

        {/* Step 3: Dates & Streaks */}
        {step === 3 && (
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
          handleNext={handleNext} 
          handleBack={handleBack} 
          onClose={onClose} 
        />
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
