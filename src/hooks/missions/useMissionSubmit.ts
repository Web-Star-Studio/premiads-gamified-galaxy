import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "./types";

export const useMissionSubmit = (setMissions: React.Dispatch<React.SetStateAction<Mission[]>>) => {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();

  // The submitMission function now properly accepts a status parameter
  const submitMission = async (
    missionId: string, 
    submissionData: any,
    status: "in_progress" | "pending_approval" = "pending_approval" // Default to pending_approval if not specified
  ) => {
    setSubmissionLoading(true);
    
    try {
      // Get current user
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData?.session?.user?.id) {
        console.error("No authenticated user found");
        toast({
          title: "Erro ao enviar missão",
          description: "Você precisa estar logado para enviar uma missão",
          variant: "destructive",
        });
        return false;
      }
      
      const userId = sessionData.session.user.id;
      
      console.log(`Submitting mission ${missionId} for user ${userId} with status ${status}`);
      
      // Check if a submission already exists for this mission and user
      const { data: existingSubmission, error: checkError } = await supabase
        .from("submissions")
        .select("*")
        .eq("mission_id", missionId)
        .eq("user_id", userId)
        .single();
      
      if (checkError && checkError.code !== "PGRST116") { // PGRST116 means no rows returned
        console.error("Error checking existing submission:", checkError);
        toast({
          title: "Erro ao verificar missão",
          description: "Não foi possível verificar se você já enviou esta missão",
          variant: "destructive",
        });
        return false;
      }
      
      let result;
      
      // If a submission already exists, update it
      if (existingSubmission) {
        console.log("Updating existing submission:", existingSubmission.id);
        
        result = await supabase
          .from("submissions")
          .update({
            content: submissionData,
            status: status, // Use the provided status
            updated_at: new Date().toISOString()
          })
          .eq("id", existingSubmission.id);
      } else {
        // Otherwise, create a new submission
        console.log("Creating new submission");
        
        result = await supabase
          .from("submissions")
          .insert({
            mission_id: missionId,
            user_id: userId,
            content: submissionData,
            status: status, // Use the provided status
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) {
        console.error("Error submitting mission:", result.error);
        toast({
          title: "Erro ao enviar missão",
          description: result.error.message || "Ocorreu um erro ao enviar sua missão",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("Mission submitted successfully");
      
      // Update missions in state
      setMissions(prevMissions => prevMissions.map(mission => {
        if (mission.id === missionId) {
          return {
            ...mission,
            status: status === "in_progress" ? "in_progress" : "pending_approval",
          };
        }
        return mission;
      }));
      
      toast({
        title: "Missão enviada com sucesso",
        description: status === "in_progress" 
          ? "A missão foi salva e está em progresso" 
          : "Sua missão foi enviada e está aguardando aprovação",
      });
      
      playSound("success");
      return true;
    } catch (error: any) {
      console.error("Unexpected error submitting mission:", error);
      toast({
        title: "Erro ao enviar missão",
        description: error.message || "Ocorreu um erro inesperado ao enviar sua missão",
        variant: "destructive",
      });
      return false;
    } finally {
      setSubmissionLoading(false);
    }
  };

  return { submitMission, submissionLoading };
};
