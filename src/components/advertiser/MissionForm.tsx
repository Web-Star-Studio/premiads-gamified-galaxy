import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { BasicInfoStep } from "./MissionBasicInfoStep";
import { RequirementsStep } from "./MissionRequirementsStep";
import { TargetingStep } from "./MissionTargetingStep";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useNavigate } from "react-router-dom";
import { createMission } from "@/lib/submissions/missionCreation";
import { MissionRewardsStep } from "./MissionRewardsStep";
import { LootBoxRewardType } from "./LootBoxRewardsSelector";

const STEPS = ["basic", "requirements", "rewards", "targeting"];

export const MissionForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  // Basic info state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [ticketsReward, setTicketsReward] = useState(0);
  const [cashbackReward, setCashbackReward] = useState(0);
  const [deadline, setDeadline] = useState<string | null>(null);
  
  // Requirements state
  const [requirements, setRequirements] = useState<string[]>([""]);
  
  // Rewards state
  const [hasBadge, setHasBadge] = useState(false);
  const [hasLootBox, setHasLootBox] = useState(false);
  const [sequenceBonus, setSequenceBonus] = useState(false);
  const [selectedLootBoxRewards, setSelectedLootBoxRewards] = useState<LootBoxRewardType[]>([
    "credit_bonus", "random_badge", "multiplier", "level_up", "daily_streak_bonus"
  ]);
  const [badgeImageUrl, setBadgeImageUrl] = useState("");
  
  // Targeting state
  const [businessType, setBusinessType] = useState("");
  const [targetAudienceGender, setTargetAudienceGender] = useState<string>("");
  const [targetAudienceAgeMin, setTargetAudienceAgeMin] = useState<number | undefined>(undefined);
  const [targetAudienceAgeMax, setTargetAudienceAgeMax] = useState<number | undefined>(undefined);
  const [targetAudienceRegion, setTargetAudienceRegion] = useState<string>("");

  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();

  const handleNext = () => {
    // Validate current step
    if (currentStep === 0) {
      if (!title || !description || !type) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha todos os campos obrigatórios para continuar",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep === 1) {
      const validRequirements = requirements.filter((req) => req.trim() !== "");
      if (validRequirements.length === 0) {
        toast({
          title: "Requisitos obrigatórios",
          description: "Adicione pelo menos um requisito para continuar",
          variant: "destructive",
        });
        return;
      }
      setRequirements(validRequirements);
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      playSound("pop");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      playSound("pop");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const missionData = {
        title,
        description,
        requirements: requirements.filter((req) => req.trim() !== ""),
        ticketsReward,
        cashbackReward,
        deadline,
        type,
        businessType,
        targetAudienceGender,
        targetAudienceAgeMin,
        targetAudienceAgeMax,
        targetAudienceRegion,
        hasBadge,
        hasLootbox: hasLootBox,
        sequenceBonus,
        badgeImageUrl,
        selectedLootBoxRewards: hasLootBox ? selectedLootBoxRewards : undefined,
        rifas: ticketsReward // Fixed: Add rifas property required by CreateMissionParams
      };

      console.log("Submitting mission data:", missionData);
      const result = await createMission(missionData);

      if (result.success) {
        toast({
          title: "Missão criada com sucesso!",
          description: "Sua missão foi criada e está pronta para os participantes",
        });
        playSound("success");
        setTimeout(() => {
          navigate("/anunciante/missoes");
        }, 1500);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Error creating mission:", error);
      toast({
        title: "Erro ao criar missão",
        description: error.message || "Ocorreu um erro ao criar a missão. Tente novamente.",
        variant: "destructive",
      });
      playSound("error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (STEPS[currentStep]) {
      case "basic":
        return (
          <BasicInfoStep 
            title={title}
            onTitleChange={setTitle}
            description={description}
            onDescriptionChange={setDescription}
            type={type}
            onTypeChange={setType}
            ticketsReward={ticketsReward}
            onTicketsRewardChange={setTicketsReward}
            cashbackReward={cashbackReward}
            onCashbackRewardChange={setCashbackReward}
            deadline={deadline}
            onDeadlineChange={setDeadline}
          />
        );
      case "requirements":
        return (
          <RequirementsStep 
            requirements={requirements}
            onRequirementsChange={setRequirements}
          />
        );
      case "rewards":
        return (
          <MissionRewardsStep 
            hasBadge={hasBadge}
            onHasBadgeChange={setHasBadge}
            hasLootBox={hasLootBox}
            onHasLootBoxChange={setHasLootBox}
            sequenceBonus={sequenceBonus}
            onSequenceBonusChange={setSequenceBonus}
            selectedLootBoxRewards={selectedLootBoxRewards}
            onSelectedLootBoxRewardsChange={setSelectedLootBoxRewards}
          />
        );
      case "targeting":
        return (
          <TargetingStep 
            businessType={businessType}
            onBusinessTypeChange={setBusinessType}
            targetAudienceGender={targetAudienceGender}
            onTargetAudienceGenderChange={setTargetAudienceGender}
            targetAudienceAgeMin={targetAudienceAgeMin}
            onTargetAudienceAgeMinChange={setTargetAudienceAgeMin}
            targetAudienceAgeMax={targetAudienceAgeMax}
            onTargetAudienceAgeMaxChange={setTargetAudienceAgeMax}
            targetAudienceRegion={targetAudienceRegion}
            onTargetAudienceRegionChange={setTargetAudienceRegion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-gray-800 bg-gray-900/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Criar Nova Missão</h3>
          <div className="text-sm text-gray-400">
            Passo {currentStep + 1} de {STEPS.length}
          </div>
        </div>

        <div className="flex mb-8 mx-auto max-w-md">
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`flex-1 ${
                index !== STEPS.length - 1 ? "relative" : ""
              }`}
            >
              <div
                className={`h-2 rounded-full ${
                  index <= currentStep ? "bg-gradient-to-r from-neon-cyan to-neon-pink" : "bg-gray-700"
                }`}
              ></div>
              {index !== STEPS.length - 1 && (
                <div className="absolute right-0 w-4 h-4 -mt-1 -mr-2 bg-gray-900 border-2 border-gray-700 rounded-full"></div>
              )}
            </div>
          ))}
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack} 
            disabled={currentStep === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          {currentStep < STEPS.length - 1 ? (
            <Button 
              onClick={handleNext}
              className="gap-2 bg-gradient-to-r from-neon-cyan/60 to-neon-pink/60 hover:from-neon-cyan/80 hover:to-neon-pink/80"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-2 bg-gradient-to-r from-green-600/60 to-teal-500/60 hover:from-green-600/80 hover:to-teal-500/80"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Criar Missão
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default MissionForm;
