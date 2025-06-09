
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ValidationStage = 'advertiser_first' | 'admin' | 'advertiser_second';

export function useSubmissionActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = async (submissionId: string, stage: ValidationStage) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase.rpc('finalize_submission', {
        p_submission_id: submissionId,
        p_approver_id: user.id,
        p_decision: 'approve',
        p_stage: stage
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Submissão aprovada",
          description: `Usuário recebeu recompensas.`,
        });

        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
      } else {
        throw new Error('Erro ao processar aprovação');
      }
    } catch (error: any) {
      console.error('Error approving submission:', error);
      toast({
        title: "Erro ao aprovar",
        description: error.message || "Não foi possível aprovar a submissão",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (submissionId: string, stage: ValidationStage, feedback?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase.rpc('finalize_submission', {
        p_submission_id: submissionId,
        p_approver_id: user.id,
        p_decision: 'reject',
        p_stage: stage
      });

      if (error) throw error;

      toast({
        title: "Submissão rejeitada",
        description: "Submissão foi rejeitada com sucesso.",
      });

      await queryClient.invalidateQueries({ queryKey: ['submissions'] });
    } catch (error: any) {
      console.error('Error rejecting submission:', error);
      toast({
        title: "Erro ao rejeitar",
        description: error.message || "Não foi possível rejeitar a submissão",
        variant: "destructive",
      });
    }
  };

  return {
    handleApprove,
    handleReject,
    isLoading: false
  };
}
