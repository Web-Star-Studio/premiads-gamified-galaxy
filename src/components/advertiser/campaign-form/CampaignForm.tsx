
import { FC } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { CampaignFormProps } from "./types";
import { useCampaignForm } from "@/hooks/use-campaign-form";
import BasicInfoStep from "./BasicInfoStep";
import RewardsStep from "./RewardsStep";
import DatesStep from "./DatesStep";
import RequirementsStep from "./RequirementsStep";
import FormNavigation from "./FormNavigation";
import FormProgress from "./FormProgress";

const CampaignForm: FC<CampaignFormProps> = ({ onClose, editCampaign }) => {
  const { 
    step, 
    formData, 
    handleNext, 
    handleBack, 
    updateFormData, 
    getStepTitle, 
    isCurrentStepValid 
  } = useCampaignForm({ editCampaign, onClose });

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
