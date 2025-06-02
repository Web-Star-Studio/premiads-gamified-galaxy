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
import { supabase } from "@/integrations/supabase/client";
import { missionService, Mission, UserTokens } from "@/services/supabase";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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
  
  /** Calculate final points based on manual or random selection */
  const calculateCampaignPoints = (): number => {
    if (formData.randomPoints && formData.pointsValue !== undefined) return formData.pointsValue
    // Manual points selection
    return formData.pointsValue || 0
  };

  // Função para formatar a data
  const formatDate = (date: Date): string => {
    return date.toISOString();
  };

  // Função para converter os dados do formulário para o formato de missão
  const createMissionObject = async (): Promise<any> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const pointsValue = calculateCampaignPoints();
    
    // Handle requirements properly - ensure it's an array for storage
    const requirementsArray = Array.isArray(formData.requirements)
      ? formData.requirements
      : typeof formData.requirements === 'string'
        ? [formData.requirements]
        : ["Sem requisitos específicos"];
      
    // Build the mission payload including all fields needed for the DB schema
    const missionPayload = {
      advertiser_id: userId,
      title: formData.title,
      description: formData.description || "Sem descrição",
      requirements: requirementsArray,
      points: pointsValue,
      cost_in_tokens: pointsValue,
      type: formData.type || "social",
      business_type: formData.type || null,
      status: "ativa",
      start_date:
        formData.startDate instanceof Date
          ? formatDate(formData.startDate)
          : formData.startDate,
      end_date:
        formData.endDate instanceof Date
          ? formatDate(formData.endDate)
          : formData.endDate,
      is_active: true,
      target_audience: formData.audience || "todos",
      target_audience_gender: formData.targetFilter?.gender || null,
      target_audience_age_min:
        formData.targetFilter?.age && formData.targetFilter.age.length > 0
          ? parseInt((formData.targetFilter.age as string[])[0].split("-")[0], 10)
          : null,
      target_audience_age_max:
        formData.targetFilter?.age && formData.targetFilter.age.length > 0
          ? parseInt((formData.targetFilter.age as string[])[0].split("-")[1], 10)
          : null,
      target_audience_region:
        formData.targetFilter?.region && formData.targetFilter.region.length > 0
          ? (formData.targetFilter.region as string[]).join(",")
          : null,
      // Additional fields for rewards
      has_badges: formData.hasBadges || false,
      has_extra_prize: formData.hasLootBox || false,
      extra_prize_name: formData.extraPrizeName || null,
      extra_prize_description: formData.extraPrizeDescription || null,
      extra_prize_image_url: formData.extraPrizeImageUrl || null,
      streak_bonus: formData.streakBonus || false,
      streak_multiplier: formData.streakMultiplier || 1.0,
      // For min purchase requirements (coupon campaigns)
      min_purchase: formData.minPurchase || 0,
      // Store target filter as JSON for more complex filtering
      target_filter: formData.targetFilter || null,
      // Include dynamic survey form schema if defined
      form_schema: formData.formSchema || null,
      // Campos de cashback
      max_participants: formData.maxParticipants || 100,
      max_cashback_redemptions: formData.maxCashbackRedemptions || 5,
      cashback_amount_per_raffle: 5.00 // Valor fixo de R$ 5,00 por rifa
    }
    return missionPayload
  };
  
  // Função para consumir os créditos do usuário
  const consumeUserCredits = async (userId: string, creditsToConsume: number): Promise<void> => {
    // Obter tokens do usuário
    const userTokens = await missionService.getUserTokens(userId) as UserTokens;
    
    // Verificar se tem créditos suficientes
    if (userTokens.total_tokens - userTokens.used_tokens < creditsToConsume) {
      throw new Error("Créditos insuficientes para criar esta campanha");
    }
    
    // Atualizar tokens usados
    await missionService.addTokens(userId, -creditsToConsume);
  };
  
  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Verificar sessão do usuário
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      // Criar objeto da missão
      const mission = await createMissionObject();
      
      // Consumir créditos
      await consumeUserCredits(userId, mission.cost_in_tokens);
      
      // Criar missão no banco de dados
      const createdMission = await missionService.createMission(mission);
      
      // Exibir toast de sucesso
      toast({
        title: "Campanha criada com sucesso!",
        description: `Créditos utilizados: ${mission.cost_in_tokens}`,
      });
      
      // Redirecionar para o dashboard
      setTimeout(() => {
        navigate("/anunciante/campanhas");
      }, 1500);
      
    } catch (error: any) {
      console.error("Erro ao criar campanha:", error);
      
      // Exibir toast de erro
      toast({
        title: "Erro ao criar campanha",
        description: error.message || "Ocorreu um erro ao criar a campanha",
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
    
    // Verificar se há pontos suficientes definidos
    const hasPoints = formData.randomPoints ? (formData.pointsValue !== undefined) : (formData.pointsRange[0] > 0);
    
    return hasPoints;
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
                disabled={loading}
              >
                Voltar
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !isFormComplete()}
                className="gap-2"
              >
                {loading ? 'Processando...' : 'Concluir'}
                {!loading && <Save className="h-4 w-4" />}
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
