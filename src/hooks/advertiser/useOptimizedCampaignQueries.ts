import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface OptimizedCampaignQueriesOptions {
  debugMode?: boolean;
}

export function useOptimizedCampaignQueries(options: OptimizedCampaignQueriesOptions = {}) {
  const { debugMode = false } = options;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(0);

  const log = useCallback((message: string, data?: any) => {
    if (debugMode) {
      console.log(`[OptimizedCampaignQueries] ${message}`, data || '');
    }
  }, [debugMode]);

  // Função para invalidar queries de forma segura e otimizada
  const refreshCampaignData = useCallback(async (force: boolean = false) => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastRefreshRef.current;

    // Prevenir refresh muito frequente (menos de 2 segundos)
    if (!force && timeSinceLastRefresh < 2000) {
      log('Skipping refresh - too soon since last refresh', { timeSinceLastRefresh });
      return;
    }

    // Se já está refreshing, não fazer nada
    if (isRefreshing && !force) {
      log('Already refreshing, skipping');
      return;
    }

    // Cancelar timeout anterior se existir
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    setIsRefreshing(true);
    lastRefreshRef.current = now;

    try {
      log('Starting campaign data refresh');

      // Invalidar queries relacionadas a campanhas em paralelo
      await Promise.all([
        queryClient.invalidateQueries({ 
          queryKey: ['advertiser-campaigns'],
          refetchType: 'active'
        }),
        queryClient.invalidateQueries({ 
          queryKey: ['advertiser-metrics'],
          refetchType: 'active'
        }),
        queryClient.invalidateQueries({ 
          queryKey: ['user-rifas'],
          refetchType: 'active'
        })
      ]);

      log('Campaign data refreshed successfully');
    } catch (error) {
      log('Error refreshing campaign data', error);
      toast({
        title: 'Erro ao atualizar dados',
        description: 'Não foi possível atualizar os dados das campanhas.',
        variant: 'destructive'
      });
    } finally {
      // Adicionar um pequeno delay antes de permitir próximo refresh
      refreshTimeoutRef.current = setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  }, [queryClient, isRefreshing, toast, log]);

  // Função para resetar cache de campanhas
  const resetCampaignCache = useCallback(() => {
    log('Resetting campaign cache');
    
    queryClient.removeQueries({ queryKey: ['advertiser-campaigns'] });
    queryClient.removeQueries({ queryKey: ['advertiser-metrics'] });
    queryClient.removeQueries({ queryKey: ['campaign-details'] });
    queryClient.removeQueries({ queryKey: ['campaign-analytics'] });
    
    log('Campaign cache reset complete');
  }, [queryClient, log]);

  // Função para prefetch dados de campanha específica
  const prefetchCampaignDetails = useCallback(async (campaignId: string) => {
    try {
      log('Prefetching campaign details', { campaignId });
      
      await queryClient.prefetchQuery({
        queryKey: ['campaign-details', campaignId],
        queryFn: async () => {
          // Esta função seria implementada com a lógica real
          // Por enquanto, retorna dados mockados
          return { id: campaignId, prefetched: true };
        },
        staleTime: 5 * 60 * 1000 // 5 minutos
      });
      
      log('Campaign details prefetched successfully');
    } catch (error) {
      log('Error prefetching campaign details', error);
    }
  }, [queryClient, log]);

  // Cleanup ao desmontar
  useCallback(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return {
    refreshCampaignData,
    resetCampaignCache,
    prefetchCampaignDetails,
    isRefreshing
  };
} 