import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface ReferralTrackingStep {
  id: string
  user_id: string
  referral_code?: string
  step: 'signup_attempt' | 'signup_success' | 'referral_bonus_applied' | 'first_mission_submitted' | 'first_mission_approved' | 'referral_completed' | 'milestone_reached'
  status: 'pending' | 'processing' | 'completed' | 'failed'
  data: any
  error_message?: string
  created_at: string
  updated_at: string
}

export const useReferralTracking = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query para buscar dados de rastreamento
  const {
    data: trackingSteps = [],
    isLoading: loading,
    error,
    refetch: fetchTrackingData
  } = useQuery({
    queryKey: ['referral-tracking'],
    queryFn: async (): Promise<ReferralTrackingStep[]> => {
      const session = await supabase.auth.getSession()
      const userId = session.data.session?.user.id
      
      if (!userId) {
        return []
      }

      // Buscar dados de rastreamento do usuário
      const { data: tracking, error } = await supabase
        .from('referral_tracking')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar rastreamento:', error)
        throw error
      }

      return tracking || []
    },
    staleTime: 1000 * 60 * 3, // 3 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 3
  })

  // Handle query errors
  if (error) {
    console.error("Error fetching tracking data:", error)
    toast({
      title: "Erro ao carregar dados",
      description: error.message,
      variant: "destructive",
    })
  }

  // Configurar realtime subscription
  useEffect(() => {
    // Configurar realtime subscription para atualizações
    const subscription = supabase
      .channel('referral_tracking_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'referral_tracking'
        },
        (payload) => {
          console.log('Tracking change received:', payload)
          // Invalidar e refazer query quando houver mudanças
          queryClient.invalidateQueries({ queryKey: ['referral-tracking'] })
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient])

  // Função para obter o último status de cada etapa
  const getStepStatus = (stepName: ReferralTrackingStep['step']) => {
    const stepData = trackingSteps.find(step => step.step === stepName)
    return stepData || null
  }

  // Função para verificar se uma etapa foi completada
  const isStepCompleted = (stepName: ReferralTrackingStep['step']) => {
    const step = getStepStatus(stepName)
    return step?.status === 'completed'
  }

  // Função para verificar se uma etapa falhou
  const isStepFailed = (stepName: ReferralTrackingStep['step']) => {
    const step = getStepStatus(stepName)
    return step?.status === 'failed'
  }

  // Função para obter resumo do progresso
  const getProgressSummary = () => {
    const steps: ReferralTrackingStep['step'][] = [
      'signup_attempt',
      'signup_success', 
      'referral_bonus_applied',
      'first_mission_submitted',
      'first_mission_approved',
      'referral_completed',
      'milestone_reached'
    ]

    const completedSteps = steps.filter(step => isStepCompleted(step))
    const failedSteps = steps.filter(step => isStepFailed(step))
    
    return {
      totalSteps: steps.length,
      completedSteps: completedSteps.length,
      failedSteps: failedSteps.length,
      progressPercentage: Math.round((completedSteps.length / steps.length) * 100),
      lastCompletedStep: completedSteps[completedSteps.length - 1] || null,
      hasFailures: failedSteps.length > 0
    }
  }

  return {
    loading,
    trackingSteps,
    getStepStatus,
    isStepCompleted,
    isStepFailed,
    getProgressSummary
  }
} 