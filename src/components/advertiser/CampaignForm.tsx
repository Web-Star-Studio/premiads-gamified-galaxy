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
import { FormData } from './campaign-form/types';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const { playSound } = useSounds();
  const {
    formData,
    updateFormData,
    currentStep,
    totalSteps,
    goToNextStep,
    goToPreviousStep,
    isSubmitting,
    handleSubmit,
    isFormValid
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
    switch (currentStep) {
      case 1:
        return <BasicInfoStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      case 2:
        return <RequirementsStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      case 3:
        return <RewardsStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      case 4:
        return <DatesStep 
                formData={formData} 
                updateFormData={updateFormData} />;
      default:
        return null;
    }
  };
  
  const isLastStep = currentStep === totalSteps;
  
  return (
    <Card className="bg-galaxy-darkPurple border-galaxy-purple">
      <CardHeader className="pb-4">
        <FormProgress 
          step={currentStep} 
          title={steps[currentStep - 1]} 
        />
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-galaxy-purple/20 pt-4">
        {isLastStep ? (
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid()}
              className="gap-2"
            >
              {isSubmitting ? 'Processando...' : 'Concluir'}
              {!isSubmitting && <Save className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <FormNavigation 
            step={currentStep}
            totalSteps={steps.length}
            handleBack={goToPreviousStep}
            handleNext={goToNextStep}
            onClose={onClose}
            isNextDisabled={false}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default CampaignForm;
