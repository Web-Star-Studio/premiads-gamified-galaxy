import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useQueryDebugger(enabled = true) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // Função para logar estado das queries
    const logQueriesState = (event: string) => {
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      
      console.group(`[QueryDebugger] ${event} - ${new Date().toISOString()}`);
      console.log(`Total queries in cache: ${queries.length}`);
      
      queries.forEach(query => {
        const queryKey = query.queryKey;
        const state = query.state;
        
        console.log({
          queryKey,
          status: state.status,
          isFetching: state.fetchStatus === 'fetching',
          isStale: query.isStale(),
          dataUpdatedAt: state.dataUpdatedAt,
          errorUpdatedAt: state.errorUpdatedAt,
          data: state.data ? 'Has data' : 'No data',
          error: state.error?.message || null
        });
      });
      
      console.groupEnd();
    };

    // Monitorar mudanças de visibilidade
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible';
      logQueriesState(`Visibility changed to: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
    };

    // Monitorar eventos de foco
    const handleFocus = () => {
      logQueriesState('Window FOCUSED');
    };

    const handleBlur = () => {
      logQueriesState('Window BLURRED');
    };

    // Adicionar listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Log inicial
    logQueriesState('Initial state');

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [enabled, queryClient]);

  return {
    logCurrentState: () => {
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.getAll();
      console.log('[QueryDebugger] Current state:', queries);
    }
  };
} 