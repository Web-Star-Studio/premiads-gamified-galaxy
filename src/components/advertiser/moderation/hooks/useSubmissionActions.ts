import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { finalizeMissionSubmission, ValidationStage } from "@/lib/submissions/missionModeration";

export function useSubmissionActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleApprove = async (submissionId: string, stage: ValidationStage) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const result = await finalizeMissionSubmission({
        submissionId,
        approverId: user.id,
        decision: 'approve',
        stage
      });

      if (result.success && result.result) {
        toast({
          title: "Submissão aprovada",
          description: `Usuário recebeu ${result.result.badge_earned ? 'badge e ' : ''}recompensas.`,
        });

        // Invalidate queries to refresh the data
        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
      } else {
        throw new Error(result.error || 'Erro ao aprovar submissão');
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

      const result = await finalizeMissionSubmission({
        submissionId,
        approverId: user.id,
        decision: 'reject',
        stage,
        feedback
      });

      if (result.success) {
        toast({
          title: "Submissão rejeitada",
          description: "Submissão foi rejeitada com sucesso.",
        });

        // Invalidate queries to refresh the data
        await queryClient.invalidateQueries({ queryKey: ['submissions'] });
      } else {
        throw new Error(result.error || 'Erro ao rejeitar submissão');
      }
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
