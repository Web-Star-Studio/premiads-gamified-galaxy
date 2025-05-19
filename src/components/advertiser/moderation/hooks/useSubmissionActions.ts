import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { MissionSubmission } from "@/types/missions";
import { finalizeMissionSubmission, ValidationStage } from "@/lib/submissions/missionModeration";
import { useQueryClient } from "@tanstack/react-query";

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

      // Determine the stage. This might need to be more sophisticated
      // based on submission.status or submission.review_stage if available.
      // For now, defaulting to 'advertiser_first'.
      // If the submission object has a 'review_stage' or similar, use it.
      // Example: const stage: ValidationStage = submission.review_stage || 'advertiser_first';
      const stage: ValidationStage = 'advertiser_first'; // Or determine dynamically

      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId: approverUser.id,
        decision: 'approve',
        stage: stage 
      });

      if (!result.success || result.error) {
        throw new Error(result.error || "Falha ao finalizar a submissão via RPC.");
      }

      // The RPC now handles points and rewards.
      // Old direct DB manipulation code is removed.

      // Fetch mission title for the toast message, as it's no longer fetched in the removed code.
      // This could also be returned by the RPC if needed.
      let missionTitle = "esta missão"; 
      if (submission.mission_id) {
        const { data: missionDetails, error: missionFetchError } = await supabase
          .from("missions")
          .select("title, points") // points for toast
          .eq("id", submission.mission_id)
          .single();
        if (missionDetails) {
          missionTitle = `"${missionDetails.title}"`;
        }
      }
      const pointsAwarded = result.data?.points_awarded || 0; // Assuming RPC returns this
      const participantId = result.data?.participant_id; // Get participant_id from RPC result

      console.log("User notification (handled by RPC, client-side log for reference):", {
        user_id: submission.user_id,
        title: "Missão aprovada!",
        message: `Sua submissão para a missão ${missionTitle} foi aprovada! Você recebeu ${pointsAwarded} pontos.`,
        type: "mission_approved",
      });
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name || 'usuário'} foi aprovada com sucesso! ${pointsAwarded} pontos atribuídos.`,
      });
      
      if (participantId) {
        // Invalidate queries related to the participant's profile to trigger UI updates
        // Assuming the query key for user profile data is ['profile', participantId]
        queryClient.invalidateQueries({ queryKey: ['profile', participantId] });
        // You might have other related queries, e.g., for a list of user's completed missions
        // queryClient.invalidateQueries({ queryKey: ['userMissions', participantId] });
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

      // Determine the stage for rejection similarly if needed
      const stage: ValidationStage = 'advertiser_first'; // Or determine dynamically based on submission state

      const result = await finalizeMissionSubmission({
        submissionId: submission.id,
        approverId: rejectorUser.id,
        decision: 'reject',
        stage: stage
      });

      if (!result.success || result.error) {
        throw new Error(result.error || "Falha ao rejeitar a submissão via RPC.");
      }

      // Fetch mission title for the toast message
      let missionTitle = "esta missão";
      if (submission.mission_id) {
        const { data: missionDetails, error: missionFetchError } = await supabase
          .from("missions")
          .select("title")
          .eq("id", submission.mission_id)
          .single();
        if (missionDetails) {
          missionTitle = `"${missionDetails.title}"`;
        }
      }
      
      console.log("User notification (handled by RPC, client-side log for reference):", {
        user_id: submission.user_id,
        title: "Missão rejeitada",
        message: `Sua submissão para a missão ${missionTitle} foi rejeitada. Motivo: ${reason || "Não atende aos requisitos"}`,
        type: "mission_rejected",
      });
      
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
