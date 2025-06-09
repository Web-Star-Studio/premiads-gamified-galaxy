
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormProgress } from './campaign-form/FormProgress';
import { FormNavigation } from './campaign-form/FormNavigation';
import BasicInfoStep from './campaign-form/BasicInfoStep';
import RequirementsStep from './campaign-form/RequirementsStep';
import DatesStep from './campaign-form/DatesStep';
import RewardsStep from './campaign-form/RewardsStep';
import { FormData, initialFormData } from './campaign-form/types';
import { useCampaignOperations } from '@/hooks/advertiser/useCampaignOperations';
import { toast } from '@/hooks/use-toast';

interface CampaignFormProps {
  onClose?: () => void;
  editCampaign?: any;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose, editCampaign }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    if (editCampaign) {
      return {
        ...initialFormData,
        ...editCampaign,
        startDate: editCampaign.startDate ? new Date(editCampaign.startDate) : new Date(),
        endDate: editCampaign.endDate ? new Date(editCampaign.endDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        requirements: typeof editCampaign.requirements === 'string' ? editCampaign.requirements : '',
      };
    }
    return initialFormData;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createCampaign } = useCampaignOperations();

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Ensure requirements is a string
      const submitData = {
        ...formData,
        requirements: typeof formData.requirements === 'string' ? formData.requirements : JSON.stringify(formData.requirements)
      };

      await createCampaign(submitData);
      toast({
        title: "Sucesso!",
        description: "Campanha criada com sucesso!",
      });
      onClose?.();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar campanha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Informações Básicas';
      case 2: return 'Requisitos';
      case 3: return 'Datas e Configurações';
      case 4: return 'Recompensas';
      default: return 'Criar Campanha';
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <RequirementsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <DatesStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <RewardsStep formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-galaxy-darkPurple border-galaxy-purple/50">
      <CardHeader>
        <CardTitle className="text-white">
          {editCampaign ? 'Editar Campanha' : 'Criar Nova Campanha'}
        </CardTitle>
        <FormProgress 
          step={currentStep}
          title={getStepTitle()}
        />
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderCurrentStep()}
        
        <FormNavigation
          step={currentStep}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  );
};

export default CampaignForm;
