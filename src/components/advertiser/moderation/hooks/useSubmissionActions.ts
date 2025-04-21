
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

  const handleApprove = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      const { error } = await supabase
        .rpc('update_submission_status', {
          submission_id: submission.id,
          new_status: 'approved'
        });
        
      if (error) throw error;

      playSound("reward");
      toast({
        title: "Submissão aprovada",
        description: `Submissão de ${submission.user_name} foi aprovada com sucesso!`,
      });
      
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

  const handleReject = async (submission: MissionSubmission) => {
    setProcessing(true);
    
    try {
      const { error } = await supabase
        .rpc('update_submission_status', {
          submission_id: submission.id,  
          new_status: 'rejected'
        });
        
      if (error) throw error;

      playSound("error");
      toast({
        title: "Submissão rejeitada",
        description: `Submissão de ${submission.user_name} foi rejeitada.`,
        variant: "destructive",
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
