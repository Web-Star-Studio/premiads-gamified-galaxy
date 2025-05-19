
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { finalizeMissionSubmission, ValidationResult } from '@/lib/submissions/missionModeration'
import { useToast } from '@/hooks/use-toast'
import { useSounds } from '@/hooks/use-sounds'

// Define the interface for the parameters required by finalizeMissionSubmission
export interface FinalizeMissionSubmissionOpts {
  submissionId: string;
  approverId: string;
  decision: 'approve' | 'reject';
  stage: 'advertiser_first' | 'admin' | 'advertiser_second';
}

export function useMissionModeration() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { playSound } = useSounds()

  return useMutation({
    mutationFn: (opts: FinalizeMissionSubmissionOpts) => {
      console.log('Finalizing submission with options:', opts);
      return finalizeMissionSubmission(opts);
    },
    onSuccess: (response: ValidationResult) => {
      // Log the response for debugging
      console.log('Mission moderation successful:', response);
      
      // Invalidate both missions and submissions queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['mission_submissions'] })
      
      // Play success sound and show toast with points info
      playSound('reward')
      
      const pointsAwarded = response.data?.points_awarded || 0;
      const tokensAwarded = response.data?.tokens_awarded || 0;
      const pointsMessage = pointsAwarded > 0 
        ? `${pointsAwarded} pontos e ${tokensAwarded} tokens foram atribuídos ao usuário.` 
        : "A submissão foi processada com sucesso.";
        
      toast({
        title: "Submissão processada com sucesso",
        description: pointsMessage,
      })
    },
    onError: (error: any) => {
      // Log the error for debugging
      console.error('Error in mission moderation:', error);
      
      // Play error sound and show error toast
      playSound('error')
      toast({
        title: "Erro ao processar submissão",
        description: error.message || "Ocorreu um erro ao processar a submissão.",
        variant: "destructive",
      })
    }
  })
}
