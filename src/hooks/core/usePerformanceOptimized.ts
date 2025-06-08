
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Hook para otimizar performance global da aplicação
export const usePerformanceOptimized = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Configurações globais de performance para React Query
    queryClient.setDefaultOptions({
      queries: {
        // Cache agressivo para reduzir calls
        staleTime: 5 * 60 * 1000, // 5 minutos
        cacheTime: 10 * 60 * 1000, // 10 minutos
        
        // Reduzir refetch automático
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        
        // Retry apenas uma vez para falhas
        retry: 1,
        retryDelay: 1000,
      },
      mutations: {
        retry: 0, // Não retry mutations
      }
    });

    // Limpar cache antigo periodicamente (1 hora)
    const cleanupInterval = setInterval(() => {
      queryClient.clear();
    }, 60 * 60 * 1000);

    return () => {
      clearInterval(cleanupInterval);
    };
  }, [queryClient]);

  // Prefetch inteligente baseado em navegação comum
  const prefetchDashboardData = (userId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['optimized-user-data', userId],
      staleTime: 5 * 60 * 1000,
    });
  };

  const prefetchMissions = () => {
    queryClient.prefetchQuery({
      queryKey: ['optimized-missions', 10, 0],
      staleTime: 10 * 60 * 1000,
    });
  };

  return {
    prefetchDashboardData,
    prefetchMissions,
  };
};
