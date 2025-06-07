
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/hooks/useAuthSession';
import { OptimizedSupabaseService } from '@/services/optimized-supabase';
import { useEffect } from 'react';

/**
 * Hook otimizado para dados do usuário com RLS aprimorado
 * Aproveita as novas políticas consolidadas e índices estratégicos
 */
export function useOptimizedUserData() {
  const { user } = useAuthSession();
  const queryClient = useQueryClient();

  // Query para métricas do dashboard - otimizada
  const {
    data: dashboardMetrics,
    isLoading: isMetricsLoading,
    error: metricsError,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ['dashboard-metrics', user?.id],
    queryFn: () => OptimizedSupabaseService.getDashboardMetrics(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  });

  // Query para recompensas do usuário
  const {
    data: userRewards,
    isLoading: isRewardsLoading,
    refetch: refetchRewards
  } = useQuery({
    queryKey: ['user-rewards', user?.id],
    queryFn: () => OptimizedSupabaseService.getUserRewards(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Query para submissões do usuário
  const {
    data: userSubmissions,
    isLoading: isSubmissionsLoading,
    refetch: refetchSubmissions
  } = useQuery({
    queryKey: ['user-submissions', user?.id],
    queryFn: () => OptimizedSupabaseService.getUserSubmissions(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 3, // 3 minutos
  });

  // Query para badges do usuário
  const {
    data: userBadges,
    isLoading: isBadgesLoading,
    refetch: refetchBadges
  } = useQuery({
    queryKey: ['user-badges', user?.id],
    queryFn: () => OptimizedSupabaseService.getUserBadges(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });

  // Query para streaks do usuário
  const {
    data: userStreaks,
    isLoading: isStreaksLoading,
    refetch: refetchStreaks
  } = useQuery({
    queryKey: ['user-streaks', user?.id],
    queryFn: () => OptimizedSupabaseService.getUserStreaks(user!.id),
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Inscrições em tempo real otimizadas
  useEffect(() => {
    if (!user?.id) return;

    // Subscrever recompensas
    const rewardsSubscription = OptimizedSupabaseService.subscribeToUserRewards(
      user.id,
      (payload) => {
        console.log('Real-time reward update:', payload);
        queryClient.invalidateQueries({ queryKey: ['user-rewards', user.id] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', user.id] });
      }
    );

    // Subscrever submissões
    const submissionsSubscription = OptimizedSupabaseService.subscribeToUserSubmissions(
      user.id,
      (payload) => {
        console.log('Real-time submission update:', payload);
        queryClient.invalidateQueries({ queryKey: ['user-submissions', user.id] });
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics', user.id] });
      }
    );

    return () => {
      rewardsSubscription.unsubscribe();
      submissionsSubscription.unsubscribe();
    };
  }, [user?.id, queryClient]);

  // Função para refresh geral de dados
  const refreshAllData = async () => {
    await Promise.all([
      refetchMetrics(),
      refetchRewards(),
      refetchSubmissions(),
      refetchBadges(),
      refetchStreaks()
    ]);
  };

  return {
    // Dados
    dashboardMetrics,
    userRewards,
    userSubmissions,
    userBadges,
    userStreaks,
    
    // Estados de loading
    isMetricsLoading,
    isRewardsLoading,
    isSubmissionsLoading,
    isBadgesLoading,
    isStreaksLoading,
    isLoading: isMetricsLoading || isRewardsLoading || isSubmissionsLoading,
    
    // Erros
    metricsError,
    
    // Ações
    refetchMetrics,
    refetchRewards,
    refetchSubmissions,
    refetchBadges,
    refetchStreaks,
    refreshAllData,
    
    // Dados derivados
    totalRifas: dashboardMetrics?.totalRifas || 0,
    totalCashback: dashboardMetrics?.totalCashback || 0,
    totalRewards: dashboardMetrics?.totalRewards || 0,
    totalSubmissions: dashboardMetrics?.totalSubmissions || 0,
  };
}
