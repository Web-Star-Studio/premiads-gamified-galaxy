
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
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import useCampaignOperations from "@/hooks/advertiser/useCampaignOperations";

interface CampaignFormProps {
  onClose: () => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const isEditing = !!editCampaign;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { createCampaign, updateCampaign, isSubmitting } = useCampaignOperations();
  
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
      setFormData({
        ...initialFormData,
        title: editCampaign.title,
        audience: (editCampaign as any).target_audience || "",
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
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      let success;
      
      if (isEditing && editCampaign) {
        success = await updateCampaign(editCampaign.id, formData);
      } else {
        success = await createCampaign(formData);
      }
      
      if (success) {
        toast({
          title: isEditing ? 'Campanha atualizada' : 'Campanha criada com sucesso!',
          description: isEditing 
            ? 'Sua campanha foi atualizada com sucesso'
            : 'Sua campanha foi criada e está pronta para ser publicada',
        });
        
        setTimeout(() => {
          navigate("/anunciante/campanhas");
        }, 1500);
      }
      
    } catch (error: any) {
      console.error("Erro ao salvar campanha:", error);
      
      toast({
        title: "Erro ao salvar campanha",
        description: error.message || "Ocorreu um erro ao salvar a campanha",
        variant: "destructive",
      });
      
    } finally {
      setLoading(false);
    }
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

  // Verificar se o formulário está completo para poder finalizar
  const isFormComplete = (): boolean => {
    // Verificar campos obrigatórios
    if (!formData.title || !formData.startDate || !formData.endDate) {
      return false;
    }
    
    // Verificar se há tickets ou cashback definidos
    const hasRewards = formData.ticketsReward > 0 || formData.cashbackReward > 0;
    
    return hasRewards;
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
          {isLastStep ? (
            <div className="flex w-full justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={loading || isSubmitting}
              >
                Voltar
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || isSubmitting || !isFormComplete()}
                className="gap-2"
              >
                {loading || isSubmitting ? 'Processando...' : 'Concluir'}
                {!loading && !isSubmitting && <Save className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <FormNavigation 
              step={currentStep}
              totalSteps={steps.length}
              handleBack={prevStep}
              handleNext={nextStep}
              onClose={onClose}
              isNextDisabled={false}
            />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CampaignForm;
