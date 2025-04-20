
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "./types";

type SetMissionsFunction = React.Dispatch<React.SetStateAction<Mission[]>>;

export const useMissionSubmit = (setMissions: SetMissionsFunction) => {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { toast } = useToast();
  const { playSound } = useSounds();

  const validateSubmissionData = (missionType: string, submissionData: any) => {
    if (!submissionData) return "Dados da submissão são obrigatórios";
    
    if (missionType === "survey" && (!submissionData.answer || submissionData.answer.trim() === "")) {
      return "Resposta é obrigatória para este tipo de missão";
    }
    
    if (missionType === "photo" && !submissionData.mediaUrl) {
      return "Imagem é obrigatória para este tipo de missão";
    }
    
    if (missionType === "video" && !submissionData.mediaUrl) {
      return "Vídeo é obrigatório para este tipo de missão";
    }
    
    if (missionType === "social_share" && (!submissionData.shareLink || submissionData.shareLink.trim() === "")) {
      return "Link da postagem é obrigatório para este tipo de missão";
    }
    
    return null;
  };

  const submitMission = async (missionId: string, missionType: string, submissionData: any) => {
    setSubmissionLoading(true);
    setSubmissionError(null);
    
    // Validate submission data
    const validationError = validateSubmissionData(missionType, submissionData);
    if (validationError) {
      setSubmissionError(validationError);
      toast({
        title: "Erro na submissão",
        description: validationError,
        variant: "destructive"
      });
      setSubmissionLoading(false);
      return false;
    }
    
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.log("No authenticated session for mission submission");
        
        // Demo mode: update the mission status in local state
        setMissions(prevMissions => 
          prevMissions.map(mission => 
            mission.id === missionId 
              ? { ...mission, status: "pending_approval" } 
              : mission
          )
        );
        
        playSound("reward");
        toast({
          title: "Missão enviada (modo demo)",
          description: "Em um ambiente real, sua submissão seria analisada pelo anunciante."
        });
        
        setSubmissionLoading(false);
        return true;
      }

      // Real mode: submit to database
      const { error } = await supabase
        .from("mission_submissions")
        .insert({
          mission_id: missionId,
          user_id: session.user.id,
          submission_data: submissionData,
          status: "pending"
        });

      if (error) {
        console.error("Error submitting to database:", error);
        throw error;
      }

      // Update mission status in local state
      setMissions(prevMissions => 
        prevMissions.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: "pending_approval" } 
            : mission
        )
      );

      playSound("reward");
      toast({
        title: "Missão enviada com sucesso!",
        description: "Sua submissão será analisada pelo anunciante."
      });
      
      return true;
    } catch (error: any) {
      console.error("Error submitting mission:", error);
      setSubmissionError(error.message || "Erro ao enviar missão");
      toast({
        title: "Erro ao enviar missão",
        description: error.message || "Ocorreu um erro ao enviar sua missão. Tente novamente mais tarde.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSubmissionLoading(false);
    }
  };

  return { 
    submitMission, 
    submissionLoading,
    submissionError
  };
};
