
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import FormProgress from "./FormProgress";
import FormNavigation from "./FormNavigation";
import { Campaign } from "../campaignData";
import BasicInfoStep from "./BasicInfoStep";
import RequirementsStep from "./RequirementsStep";
import RewardsStep from "./RewardsStep";
import DatesStep from "./DatesStep";
import { useFormNavigation } from "@/hooks/use-form-navigation";
import { ArrowLeft, Save } from "lucide-react";
import { motion } from "framer-motion";

interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const isEditing = !!editCampaign;
  const [loading, setLoading] = useState(false);
  
  const steps = [
    "Informações Básicas",
    "Requisitos",
    "Recompensas", 
    "Datas"
  ];
  
  const { 
    currentStepIndex, 
    isFirstStep, 
    isLastStep,
    goToPreviousStep,
    goToNextStep
  } = useFormNavigation(steps.length);
  
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
    switch (currentStepIndex) {
      case 0:
        return <BasicInfoStep campaign={editCampaign} />;
      case 1:
        return <RequirementsStep campaign={editCampaign} />;
      case 2:
        return <RewardsStep campaign={editCampaign} />;
      case 3:
        return <DatesStep campaign={editCampaign} />;
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
            steps={steps} 
            currentStepIndex={currentStepIndex} 
          />
        </CardHeader>
        
        <CardContent>
          {renderCurrentStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-galaxy-purple/20 pt-4">
          <FormNavigation 
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            onBack={goToPreviousStep}
            onNext={goToNextStep}
            onSave={handleSave}
            loading={loading}
          />
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CampaignForm;
