
import React, { useState } from "react";
import { Mission } from "@/hooks/useMissions";
import { useToast } from "@/hooks/use-toast";
import { 
  SurveySubmissionForm,
  MediaSubmissionForm,
  SocialShareSubmissionForm,
  VisitSubmissionForm,
  TermsAndSubmit
} from "./submission-forms";

interface MissionSubmissionFormProps {
  mission: Mission | null;
  loading: boolean;
  onSubmit: (submissionData: any) => void;
}

const MissionSubmissionForm = ({ mission, loading, onSubmit }: MissionSubmissionFormProps) => {
  // Estado local para dados do formulário
  const [missionAnswer, setMissionAnswer] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();

  if (!mission) return null;

  // Funções para lidar com o upload de mídia
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = () => {
    // Preparar dados de submissão baseado no tipo de missão
    let submissionData = {};
    
    if (mission.type === "survey") {
      submissionData = { answer: missionAnswer };
    } else if (mission.type === "photo" || mission.type === "video") {
      if (!imagePreview) {
        toast({
          title: "Arquivo necessário",
          description: "Por favor, envie uma imagem ou vídeo para concluir esta missão.",
          variant: "destructive",
        });
        return;
      }
      submissionData = { mediaUrl: imagePreview };
    } else if (mission.type === "social_share") {
      submissionData = { shareLink: missionAnswer };
    }
    
    onSubmit(submissionData);
  };

  // Determinar se o botão de envio deve estar desabilitado
  const isSubmitDisabled = 
    (!missionAnswer && !imagePreview && mission.type !== "visit") || 
    !agreedToTerms;

  // Renderizar o formulário apropriado com base no tipo de missão
  return (
    <div className="space-y-4 my-4">
      {mission.type === "survey" && (
        <SurveySubmissionForm 
          value={missionAnswer}
          onChange={setMissionAnswer}
        />
      )}
      
      {(mission.type === "photo" || mission.type === "video") && (
        <MediaSubmissionForm
          type={mission.type}
          imagePreview={imagePreview}
          onImageUpload={handleImageUpload}
          onClearImage={handleClearImage}
        />
      )}
      
      {mission.type === "social_share" && (
        <SocialShareSubmissionForm
          value={missionAnswer}
          onChange={setMissionAnswer}
        />
      )}
      
      {mission.type === "visit" && (
        <VisitSubmissionForm />
      )}
      
      <TermsAndSubmit
        loading={loading}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        onCancel={() => onSubmit(null)}
        onSubmit={handleSubmit}
        isDisabled={isSubmitDisabled}
      />
    </div>
  );
};

export default MissionSubmissionForm;
