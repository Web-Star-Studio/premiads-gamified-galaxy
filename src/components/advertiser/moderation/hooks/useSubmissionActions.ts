
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { MissionSubmission } from "@/types/missions";

interface UseSubmissionActionsProps {
  onRemove: (id: string) => void;
}

export const useSubmissionActions = ({ onRemove }: UseSubmissionActionsProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSounds();
  
  // Handle approve submission
  const handleApprove = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ status: "approved" })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      // Update user points - will trigger the database function award_mission_points
      // This is handled by the trigger automatically, no need to update points manually
      
      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name} foi aprovada com sucesso!`,
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
  
  // Handle reject submission
  const handleReject = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      // Update submission status in database
      const { error } = await supabase
        .from("mission_submissions")
        .update({ 
          status: "rejected",
          feedback: submission.feedback || "Submissão não atende aos requisitos." 
        })
        .eq("id", submission.id);
        
      if (error) throw error;
      
      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name} foi rejeitada.`,
        variant: "destructive",
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
