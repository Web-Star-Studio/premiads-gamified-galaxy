
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/hooks/useAuthSession';
import { OptimizedSupabaseService } from '@/services/optimized-supabase';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

/**
 * Hook otimizado para gerenciamento de missões
 * Aproveita os novos índices e políticas RLS consolidadas
 */
export function useOptimizedMissions() {
  const { user, profile } = useAuthSession();
  const queryClient = useQueryClient();

  // Query para missões ativas - otimizada com índice is_active
  const {
    data: activeMissions,
    isLoading: isActiveMissionsLoading,
    error: activeMissionsError,
    refetch: refetchActiveMissions
  } = useQuery({
    queryKey: ['active-missions'],
    queryFn: () => OptimizedSupabaseService.getActiveMissions(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });

  // Query para missões do usuário (se for anunciante)
  const {
    data: userMissions,
    isLoading: isUserMissionsLoading,
    refetch: refetchUserMissions
  } = useQuery({
    queryKey: ['user-missions', user?.id],
    queryFn: () => OptimizedSupabaseService.getUserMissions(user!.id),
    enabled: !!user?.id && profile?.user_type === 'anunciante',
    staleTime: 1000 * 60 * 3, // 3 minutos
  });

  // Query para submissões do anunciante
  const {
    data: advertiserSubmissions,
    isLoading: isAdvertiserSubmissionsLoading,
    refetch: refetchAdvertiserSubmissions
  } = useQuery({
    queryKey: ['advertiser-submissions', user?.id],
    queryFn: () => OptimizedSupabaseService.getAdvertiserSubmissions(user!.id),
    enabled: !!user?.id && profile?.user_type === 'anunciante',
    staleTime: 1000 * 60 * 2, // 2 minutos
  });

  // Mutation para criar submissão
  const createSubmissionMutation = useMutation({
    mutationFn: (submission: Database['public']['Tables']['mission_submissions']['Insert']) =>
      OptimizedSupabaseService.createMissionSubmission(submission),
    onSuccess: (data) => {
      toast.success('Submissão criada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['user-submissions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao criar submissão:', error);
      toast.error('Erro ao criar submissão. Tente novamente.');
    }
  });

  // Mutation para criar participação
  const createParticipationMutation = useMutation({
    mutationFn: (participation: Database['public']['Tables']['participations']['Insert']) =>
      OptimizedSupabaseService.createParticipation(participation),
    onSuccess: () => {
      toast.success('Participação registrada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['user-participations', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', user?.id] });
    },
    onError: (error) => {
      console.error('Erro ao registrar participação:', error);
      toast.error('Erro ao registrar participação. Tente novamente.');
    }
  });

  // Função para participar de uma missão
  const participateInMission = async (missionId: string) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para participar.');
      return;
    }

    await createParticipationMutation.mutateAsync({
      user_id: user.id,
      campaign_id: missionId,
      status: 'started',
      started_at: new Date().toISOString()
    });
  };

  // Função para submeter uma missão
  const submitMission = async (
    missionId: string,
    submissionData: any
  ) => {
    if (!user?.id) {
      toast.error('Você precisa estar logado para submeter.');
      return;
    }

    await createSubmissionMutation.mutateAsync({
      user_id: user.id,
      mission_id: missionId,
      submission_data: submissionData,
      status: 'pending',
      submitted_at: new Date().toISOString()
    });
  };

  // Função para refresh de dados
  const refreshMissionsData = async () => {
    await Promise.all([
      refetchActiveMissions(),
      refetchUserMissions(),
      refetchAdvertiserSubmissions()
    ]);
  };

  return {
    // Dados
    activeMissions: activeMissions || [],
    userMissions: userMissions || [],
    advertiserSubmissions: advertiserSubmissions || [],
    
    // Estados de loading
    isActiveMissionsLoading,
    isUserMissionsLoading,
    isAdvertiserSubmissionsLoading,
    isCreatingSubmission: createSubmissionMutation.isPending,
    isCreatingParticipation: createParticipationMutation.isPending,
    
    // Erros
    activeMissionsError,
    
    // Ações
    participateInMission,
    submitMission,
    refetchActiveMissions,
    refetchUserMissions,
    refetchAdvertiserSubmissions,
    refreshMissionsData,
    
    // Estados das mutations
    createSubmissionMutation,
    createParticipationMutation,
  };
}
