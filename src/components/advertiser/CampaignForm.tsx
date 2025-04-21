
import React, { useState, useEffect } from 'react';
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
import { FormData, initialFormData, MissionType } from './campaign-form/types';

interface CampaignFormProps {
  onClose: (formData?: any) => void;
  editCampaign?: Campaign | null;
}

const CampaignForm = ({ onClose, editCampaign }: CampaignFormProps) => {
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    title: "",
    description: "",
    type: "form",
    audience: "todos",
    requirements: [] as string[],
    pointsRange: [50, 50],
    randomPoints: false,
    hasBadges: false,
    hasLootBox: false,
    startDate: "",
    endDate: "",
    streakBonus: false
  });
  
  // Função para atualizar o formData
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Buscar detalhes da campanha do Supabase ao editar
  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!editCampaign) return;
      
      try {
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('id', editCampaign.id.toString())
          .single();
          
        if (error) throw error;
        
        if (data) {
          const points = data.points;
          
          // Convert any Json[] requirements to string[]
          let stringRequirements: string[] = [];
          if (Array.isArray(data.requirements)) {
            stringRequirements = data.requirements.map(req => 
              typeof req === 'string' ? req : JSON.stringify(req)
            );
          }
          
          // Preencher o formulário com dados do banco
          setFormData({
            ...initialFormData,
            title: data.title,
            description: data.description || "",
            // Ensure type is a valid MissionType or empty string
            type: (data.type as MissionType) || "form",
            audience: data.target_audience_gender || "todos",
            requirements: stringRequirements,
            pointsRange: [points, points],
            randomPoints: false,
            hasBadges: false,
            hasLootBox: false,
            startDate: data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : "",
            endDate: data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : "",
            streakBonus: false
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
  }, [editCampaign, toast]);
  
  // Títulos das etapas para o indicador de progresso
  const steps = [
    "Informações Básicas",
    "Requisitos",
    "Recompensas", 
    "Datas"
  ];
  
  // Verificar se a etapa atual é válida
  const isCurrentStepValid = () => {
    switch (step) {
      case 1:
        return formData.title.trim().length >= 3 && 
               formData.type !== "" && 
               formData.audience !== "";
      case 2:
        return formData.requirements.length > 0;
      case 3:
        return true; // Rewards are optional
      case 4:
        return true; // Dates have defaults
      default:
        return false;
    }
  };
  
  // Avançar para a próxima etapa
  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };
  
  // Voltar para a etapa anterior
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
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
        points: formData.pointsRange[0], // Use the first value from the range
        is_active: true, // Default to active
        advertiser_id: session.user.id,
        requirements: formData.requirements || [],
        start_date: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null
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
