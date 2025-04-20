
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CampaignFormProps {
  onClose: (formData?: any) => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  
  const {
    step,
    formData,
    updateFormData,
    handleNext,
    handleBack,
    getStepTitle,
    isCurrentStepValid
  } = useCampaignForm({
    editCampaign,
    onClose: () => {
      playSound('pop');
      onClose();
    }
  });
  
  // Buscar detalhes da campanha do Supabase ao editar
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!editCampaign) return;
      
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', editCampaign.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Preencher o formulário com dados do banco
          updateFormData({
            title: data.title,
            description: data.description,
            type: data.type,
            status: data.is_active ? "ativa" : "pendente",
            audience: data.target_audience_gender || "todos",
            requirements: data.requirements || [],
            reward: data.points.toString(),
            startDate: data.start_date ? new Date(data.start_date) : new Date(),
            endDate: data.end_date ? new Date(data.end_date) : undefined
          });
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da campanha:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes da campanha",
          variant: "destructive"
        });
      }
    };
    
    fetchCampaignDetails();
  }, [editCampaign, updateFormData, toast]);
  
  // Títulos das etapas para o indicador de progresso
  const steps = [
    "Informações Básicas",
    "Requisitos",
    "Recompensas", 
    "Datas"
  ];
  
  // Renderizar o conteúdo da etapa apropriada
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
  
  // Lidar com o envio do formulário
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado");
      }
      
      // Preparar os dados para envio
      const campaignData = {
        title: formData.title,
        description: formData.description || "Descrição da campanha",
        type: formData.type || "form",
        points: parseInt(formData.reward) || 50,
        is_active: formData.status === "ativa",
        advertiser_id: session.user.id,
        requirements: formData.requirements || [],
        start_date: formData.startDate,
        end_date: formData.endDate
      };
      
      // Passar os dados do formulário para o callback onClose
      onClose(formData);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a campanha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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
          handleNext={step === steps.length ? handleSubmit : handleNext}
          onClose={() => onClose()}
          isNextDisabled={!isCurrentStepValid() || submitting}
          isSubmitting={submitting && step === steps.length}
        />
      </CardFooter>
    </Card>
  );
};

export default CampaignForm;
