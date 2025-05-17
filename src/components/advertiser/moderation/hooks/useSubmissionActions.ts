
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { MissionSubmission } from "@/types/missions";

interface UseSubmissionActionsProps {
  onRemove: (submissionId: string) => void;
}

export const useSubmissionActions = ({ onRemove }: UseSubmissionActionsProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  /**
   * Handle submission approval and reward distribution
   * @param submission - The submission to approve
   */
  const handleApprove = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ 
          status: "approved",
          review_stage: "finalized",
          updated_at: new Date().toISOString()
        })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      // Call the reward_participant_for_submission function to distribute rewards
      const { error: rewardError } = await supabase
        .rpc('reward_participant_for_submission', {
          submission_id: submission.id
        });
        
      if (rewardError) {
        console.error("Error rewarding participant:", rewardError);
        throw rewardError;
      }
      
      // Get mission details for notification
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .select("points, title, cost_in_tokens")
        .eq("id", submission.mission_id)
        .single();
        
      if (missionError) throw missionError;
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi aprovada com sucesso! ${missionData.points} pontos e ${missionData.cost_in_tokens} tokens atribuídos.`,
      });
      
      // Remove from list
      onRemove(submission.id);
    } catch (error: any) {
      console.error("Error approving submission:", error);
      toast({
        title: "Erro na aprovação",
        description: error.message || "Ocorreu um erro ao aprovar a submissão",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  /**
   * Handle submission rejection
   * @param submission - The submission to reject
   * @param reason - Optional reason for rejection
   */
  const handleReject = async (submission: MissionSubmission, reason?: string) => {
    setProcessing(true);
    
    try {
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ 
          status: "rejected",
          feedback: reason || "Submissão não atende aos requisitos da missão",
          updated_at: new Date().toISOString()
        })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      // Get mission details for notification
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .select("title")
        .eq("id", submission.mission_id)
        .single();
        
      if (missionError) throw missionError;
      
      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi rejeitada.`,
      });
      
      // Remove from list
      onRemove(submission.id);
    } catch (error: any) {
      console.error("Error rejecting submission:", error);
      toast({
        title: "Erro na rejeição",
        description: error.message || "Ocorreu um erro ao rejeitar a submissão",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return {
    processing,
    handleApprove,
    handleReject
  };
};
