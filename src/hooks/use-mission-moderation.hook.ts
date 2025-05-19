
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
      
      // Invalidate multiple queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['mission_submissions'] })
      
      // If we have participant ID, invalidate their profile data
      if (response.data?.participant_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['profile', response.data.participant_id] 
        })
      }
      
      // Play success sound and show toast with points info
      playSound('reward')
      
      const pointsAwarded = response.data?.points_awarded || 0;
      const tokensAwarded = response.data?.tokens_awarded || 0;
      
      let pointsMessage = "A submissão foi processada com sucesso.";
      
      if (pointsAwarded > 0 || tokensAwarded > 0) {
        pointsMessage = `${pointsAwarded} pontos e ${tokensAwarded} tokens foram atribuídos ao usuário.`;
      }
        
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
