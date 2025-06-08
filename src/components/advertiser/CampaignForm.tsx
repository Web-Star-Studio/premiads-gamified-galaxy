
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { FormData, initialFormData } from './campaign-form/types';
import FormProgress from './campaign-form/FormProgress';
import FormNavigation from './campaign-form/FormNavigation';
import BasicInfoStep from './campaign-form/BasicInfoStep';
import RequirementsStep from './campaign-form/RequirementsStep';
import RewardsStep from './campaign-form/RewardsStep';
import DatesStep from './campaign-form/DatesStep';
import useCampaignOperations from '@/hooks/advertiser/useCampaignOperations';
import { useToast } from '@/hooks/use-toast';

interface CampaignFormProps {
  onClose?: () => void;
}

const CampaignForm: React.FC<CampaignFormProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const navigate = useNavigate();
  const { createCampaign, isSubmitting } = useCampaignOperations();
  const { toast } = useToast();

  const steps = [
    { title: 'Informações Básicas', component: BasicInfoStep },
    { title: 'Requisitos', component: RequirementsStep },
    { title: 'Recompensas', component: RewardsStep },
    { title: 'Datas', component: DatesStep },
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const success = await createCampaign(formData);
      if (success) {
        if (onClose) {
          onClose();
        } else {
          navigate('/anunciante/campanhas');
        }
      }
    } catch (error) {
      console.error('Error submitting campaign:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao criar campanha. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-galaxy-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClose ? onClose() : navigate('/anunciante/campanhas')}
            className="text-white hover:bg-galaxy-purple/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-white">Nova Campanha</h1>
        </div>

        <Card className="bg-galaxy-darkPurple border-galaxy-purple">
          <CardHeader>
            <CardTitle className="text-white">
              {steps[currentStep].title}
            </CardTitle>
            <FormProgress step={currentStep} totalSteps={steps.length} />
          </CardHeader>
          <CardContent>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
              />
            </motion.div>

            <FormNavigation
              step={currentStep}
              totalSteps={steps.length}
              onNext={() => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))}
              onPrevious={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CampaignForm;
