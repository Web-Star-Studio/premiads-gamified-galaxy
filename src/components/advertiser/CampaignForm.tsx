
import React from 'react';
import { useCampaignForm } from '@/hooks/use-campaign-form';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { FormProgress } from './campaign-form/FormProgress';
import { FormNavigation } from './campaign-form/FormNavigation';
import BasicInfoStep from './campaign-form/BasicInfoStep';
import RequirementsStep from './campaign-form/RequirementsStep';
import RewardsStep from './campaign-form/RewardsStep';
import DatesStep from './campaign-form/DatesStep';
import { Campaign } from './campaignData';
import { useSounds } from '@/hooks/use-sounds';

interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const { playSound } = useSounds();
  const {
    step,
    formData,
    updateFormData,
    handleNext,
    handleBack,
    handleSubmit,
    getStepTitle,
    isCurrentStepValid
  } = useCampaignForm({
    editCampaign,
    onClose: () => {
      playSound('pop');
      onClose();
    }
  });
  
  // Step titles for progress indicator
  const steps = [
    "Informações Básicas",
    "Requisitos",
    "Recompensas", 
    "Datas"
  ];
  
  // Render the appropriate step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <RequirementsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <RewardsStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <DatesStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-galaxy-darkPurple border-galaxy-purple">
      <CardHeader className="pb-4">
        <FormProgress 
          step={step} 
          title={steps[step - 1]} 
        />
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-galaxy-purple/20 pt-4">
        <FormNavigation 
          step={step}
          totalSteps={steps.length}
          handleBack={handleBack}
          handleNext={handleNext}
          onClose={onClose}
          isNextDisabled={!isCurrentStepValid()}
        />
      </CardFooter>
    </Card>
  );
};

export default CampaignForm;
