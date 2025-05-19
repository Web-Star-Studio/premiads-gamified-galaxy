
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { MissionSubmission } from "@/types/missions";
import { useQueryClient } from "@tanstack/react-query";
import { finalizeMissionSubmission, ValidationStage } from "@/lib/submissions/missionModeration";

interface UseSubmissionActionsProps {
  onRemove: (submissionId: string) => void;
}

export const useSubmissionActions = ({ onRemove }: UseSubmissionActionsProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const queryClient = useQueryClient();
  
  /**
   * Handle submission approval and reward distribution
   * @param submission - The submission to approve
   */
  const handleApprove = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      const { data: { user: approverUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !approverUser) {
        throw new Error(authError?.message || "Aprovador não autenticado.");
      }

      // Determine the stage based on submission state
      const stage: ValidationStage = submission.second_instance ? 'advertiser_second' : 'advertiser_first';
      console.log(`Approving submission ${submission.id} with stage ${stage}`);

      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId: approverUser.id,
        decision: 'approve',
        stage: stage 
      });

      if (!result.success || result.error) {
        throw new Error(result.error || "Falha ao finalizar a submissão via RPC.");
      }

      // Get points awarded from the result
      const pointsAwarded = result.data?.points_awarded || 0;
      const tokensAwarded = result.data?.tokens_awarded || 0;
      const participantId = result.data?.participant_id;

      // Fetch mission title for the toast message
      let missionTitle = "esta missão"; 
      if (submission.mission_id) {
        const { data: missionDetails } = await supabase
          .from("missions")
          .select("title")
          .eq("id", submission.mission_id)
          .single();
        if (missionDetails) {
          missionTitle = `"${missionDetails.title}"`;
        }
      }
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi aprovada com sucesso! ${pointsAwarded} pontos e ${tokensAwarded} tokens atribuídos.`,
      });
      
      if (participantId) {
        // Invalidate queries related to the participant's profile to trigger UI updates
        queryClient.invalidateQueries({ queryKey: ['profile', participantId] });
        queryClient.invalidateQueries({ queryKey: ['mission_submissions'] });
      }
      
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
      const { data: { user: rejectorUser }, error: authError } = await supabase.auth.getUser();
      if (authError || !rejectorUser) {
        throw new Error(authError?.message || "Usuário aprovador não autenticado.");
      }

      // Determine the stage based on submission state
      const stage: ValidationStage = submission.second_instance ? 'advertiser_second' : 'advertiser_first';
      console.log(`Rejecting submission ${submission.id} with stage ${stage}`);

      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId: rejectorUser.id,
        decision: 'reject',
        stage: stage
      });

      if (!result.success || result.error) {
        throw new Error(result.error || "Falha ao rejeitar a submissão via RPC.");
      }

      // Optional: Update feedback if provided
      if (reason) {
        await supabase
          .from("mission_submissions")
          .update({ feedback: reason })
          .eq("id", submission.id);
      }

      // Fetch mission title for the toast message
      let missionTitle = "esta missão";
      if (submission.mission_id) {
        const { data: missionDetails } = await supabase
          .from("missions")
          .select("title")
          .eq("id", submission.mission_id)
          .single();
        if (missionDetails) {
          missionTitle = `"${missionDetails.title}"`;
        }
      }
      
      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi rejeitada.`,
      });
      
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
