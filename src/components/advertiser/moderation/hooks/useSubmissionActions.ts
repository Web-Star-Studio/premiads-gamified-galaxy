
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { MissionSubmission } from "@/hooks/useMissionsTypes";
import { useMissionModeration } from "@/hooks/use-mission-moderation.hook";

interface UseSubmissionActionsProps {
  onRemove: (submissionId: string) => void;
}

export const useSubmissionActions = ({ onRemove }: UseSubmissionActionsProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { mutate: finalizeMission, isPending } = useMissionModeration();
  
  /**
   * Handle submission approval and reward distribution
   * @param submission - The submission to approve
   */
  const handleApprove = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      // Get current user ID from session
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log(`Approving submission ${submission.id}, second instance: ${submission.second_instance}`);
      
      // Use the enhanced mission moderation flow with correct stage mapping
      await finalizeMission({
        submissionId: submission.id,
        approverId,
        decision: 'approve',
        stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
      });
      
      // Get updated details for notification
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
      // Get current user ID from session
      const { data: session } = await supabase.auth.getSession();
      const approverId = session?.session?.user?.id;
      
      if (!approverId) {
        throw new Error('Usuário não autenticado');
      }
      
      console.log(`Rejecting submission ${submission.id}, second instance: ${submission.second_instance}`);
      
      // Use the mission moderation flow with correct stage mapping
      await finalizeMission({
        submissionId: submission.id,
        approverId,
        decision: 'reject',
        stage: submission.second_instance ? 'advertiser_second' : 'advertiser_first'
      });
      
      // Update feedback if provided
      if (reason) {
        await supabase
          .from("mission_submissions")
          .update({ 
            feedback: reason
          })
          .eq("id", submission.id);
      }
      
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
    processing: processing || isPending,
    handleApprove,
    handleReject
  };
};
