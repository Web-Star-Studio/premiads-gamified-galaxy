import { useMutation, useQueryClient } from '@tanstack/react-query'
import { finalizeMissionSubmission, FinalizeMissionSubmissionOpts } from '@/lib/submissions/missionModeration'

export function useMissionModeration() {
  const queryClient = useQueryClient()

  return useMutation<void, Error, FinalizeMissionSubmissionOpts>({
    mutationFn: (opts) => finalizeMissionSubmission(opts),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['missions'] })
      queryClient.invalidateQueries({ queryKey: ['mission_submissions'] })
    }
  })
} 