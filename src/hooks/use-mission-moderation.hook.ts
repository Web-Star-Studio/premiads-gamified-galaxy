
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { finalizeMissionSubmission, FinalizeMissionSubmissionOpts } from '@/lib/submissions/missionModeration'
import { useToast } from '@/hooks/use-toast'
import { useSounds } from '@/hooks/use-sounds'

export function useMissionModeration() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { playSound } = useSounds()

  return useMutation<void, Error, FinalizeMissionSubmissionOpts>({
    mutationFn: (opts) => finalizeMissionSubmission(opts),
    onSuccess: () => {
      // Invalidate both missions and submissions queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['mission_submissions'] })
      
      // Play success sound and show toast
      playSound('reward')
      toast({
        title: "Submissão processada com sucesso",
        description: "A submissão foi processada e os pontos foram atribuídos corretamente.",
      })
    },
    onError: (error) => {
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
