
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { finalizeMissionSubmission } from '@/lib/submissions/missionModeration';

export function useMissionModeration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const moderateMission = useMutation({
    mutationFn: async ({ submissionId, decision, stage }: {
      submissionId: string;
      decision: 'approve' | 'reject';
      stage: 'advertiser_first' | 'admin' | 'advertiser_second';
    }) => {
      const result = await finalizeMissionSubmission({
        submissionId,
        decision,
        stage
      });

      if (!result.success) {
        throw new Error(result.error || 'Erro ao moderar submissão');
      }

      return result;
    },
    onSuccess: (data) => {
      toast({
        title: 'Moderação realizada com sucesso',
        description: 'A submissão foi processada.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro na moderação',
        description: error.message || 'Ocorreu um erro ao moderar a submissão',
        variant: 'destructive',
      });
    },
  });

  return {
    moderateMission: moderateMission.mutate,
    isLoading: moderateMission.isPending,
  };
}
