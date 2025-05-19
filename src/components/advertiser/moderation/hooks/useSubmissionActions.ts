
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
        .update({ status: "approved" })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      // Get mission details to determine reward amount
      const { data: missionData, error: missionError } = await supabase
        .from("missions")
        .select("points, title")
        .eq("id", submission.mission_id)
        .single();
        
      if (missionError) throw missionError;
      
      // Create reward record
      const { error: rewardError } = await supabase
        .from("mission_rewards")
        .insert({
          user_id: submission.user_id,
          mission_id: submission.mission_id,
          submission_id: submission.id,
          points_earned: missionData.points,
          rewarded_at: new Date().toISOString()
        });
        
      if (rewardError) throw rewardError;
      
      // Update user's points balance
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("points")
        .eq("id", submission.user_id)
        .single();
        
      if (userError) throw userError;
      
      const currentPoints = userData.points || 0;
      const newPoints = currentPoints + missionData.points;
      
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          points: newPoints,
          updated_at: new Date().toISOString()
        })
        .eq("id", submission.user_id);
        
      if (updateError) throw updateError;
      
      // Log notification (would be stored in a notifications table in a complete implementation)
      console.log("User notification:", {
        user_id: submission.user_id,
        title: "Missão aprovada!",
        message: `Sua submissão para a missão "${missionData.title}" foi aprovada! Você recebeu ${missionData.points} pontos.`,
        type: "mission_approved",
      });
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name} foi aprovada com sucesso! ${missionData.points} pontos atribuídos.`,
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
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ 
          status: "rejected",
          feedback: reason || "Submissão não atende aos requisitos da missão"
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
      
      // Log notification (would be stored in a notifications table in a complete implementation)
      console.log("User notification:", {
        user_id: submission.user_id,
        title: "Missão rejeitada",
        message: `Sua submissão para a missão "${missionData.title}" foi rejeitada. Motivo: ${reason || "Não atende aos requisitos"}`,
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
    processing: processing || isPending,
    handleApprove,
    handleReject
  };
};
