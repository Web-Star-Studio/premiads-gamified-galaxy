
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "./types";

export const useMissionSubmit = (setMissions: React.Dispatch<React.SetStateAction<Mission[]>>) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // Submit a mission
  const submitMission = async (missionId: string, submissionData: any) => {
    setLoading(true);
    
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        throw new Error("Usuário não autenticado");
      }
      
      const { error } = await supabase
        .from("mission_submissions")
        .insert({
          mission_id: missionId,
          user_id: userId,
          submission_data: submissionData,
        });
      
      if (error) throw error;
      
      // Update local mission status
      setMissions(prev => 
        prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, status: "pending_approval" } 
            : mission
        )
      );
      
      playSound("reward");
      toast({
        title: "Missão enviada com sucesso!",
        description: "Sua submissão está em análise e será avaliada em breve.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error submitting mission:", error);
      toast({
        title: "Erro ao enviar missão",
        description: error.message || "Ocorreu um erro ao enviar a missão",
        variant: "destructive",
      });
      playSound("error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitMission, submissionLoading: loading };
};
