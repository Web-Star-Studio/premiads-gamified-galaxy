
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormProgress } from "./FormProgress";
import { FormNavigation } from "./FormNavigation";
import { Campaign } from "../campaignData";
import BasicInfoStep from "./BasicInfoStep";
import RequirementsStep from "./RequirementsStep";
import RewardsStep from "./RewardsStep";
import DatesStep from "./DatesStep";
import { useFormNavigation } from "@/hooks/use-form-navigation";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";
import { FormData, initialFormData } from "./types";

interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const isEditing = !!editCampaign;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  
  const steps = [
    "Informações Básicas",
    "Requisitos",
    "Recompensas", 
    "Datas"
  ];
  
  // Using correct props for useFormNavigation
  const { 
    currentStep,
    isFirstStep, 
    isLastStep,
    prevStep,
    nextStep
  } = useFormNavigation({
    totalSteps: steps.length,
    initialStep: 1
  });

  // Map campaign data to form data if in edit mode
  useEffect(() => {
    if (isEditing && editCampaign) {
      // Map campaign data to formData
      // This is a simplified example, adjust according to actual data structure
      setFormData({
        ...initialFormData,
        title: editCampaign.title,
        audience: editCampaign.audience,
        // Map other fields as needed
      });
    }
  }, [isEditing, editCampaign]);
  
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // Simulating save operation
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };
  
  // Shows the current step content based on the current index
  const renderCurrentStep = () => {
    switch (currentStep) {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-galaxy-darkPurple border-galaxy-purple">
        <CardHeader className="pb-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="mr-2 text-muted-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>
              {isEditing ? "Editar Campanha" : "Nova Campanha"}
            </CardTitle>
          </div>
          <FormProgress 
            step={currentStep} 
            title={steps[currentStep - 1]} 
          />
        </CardHeader>
        
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-galaxy-purple/20 pt-4">
          <FormNavigation 
            step={currentStep}
            totalSteps={steps.length}
            handleBack={prevStep}
            handleNext={nextStep}
            onClose={onClose}
            isNextDisabled={false}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CampaignForm;
