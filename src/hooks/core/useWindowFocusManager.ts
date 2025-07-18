import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { focusManager } from '@tanstack/react-query';

interface WindowFocusManagerOptions {
  enableRefetchOnFocus?: boolean;
  refetchDelay?: number;
  debugMode?: boolean;
}

export function useWindowFocusManager(options: WindowFocusManagerOptions = {}) {
  const { 
    enableRefetchOnFocus = false, 
    refetchDelay = 1000,
    debugMode = false 
  } = options;
  
  const queryClient = useQueryClient();
  const lastFocusTimeRef = useRef<number>(Date.now());
  const isRefetchingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const log = useCallback((message: string, data?: any) => {
    if (debugMode) {
      console.log(`[WindowFocusManager] ${message}`, data || '');
    }
  }, [debugMode]);

  useEffect(() => {
    // Configurar o focus manager do React Query
    focusManager.setEventListener((handleFocus) => {
      const onFocus = () => {
        const now = Date.now();
        const timeSinceLastFocus = now - lastFocusTimeRef.current;
        
        log('Window focused', { timeSinceLastFocus });
        
        // Prevenir refetch muito frequente (menos de 5 segundos)
        if (timeSinceLastFocus < 5000) {
          log('Skipping refetch - too soon since last focus');
          return;
        }
        
        // Cancelar qualquer refetch em andamento
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Só executar handleFocus se habilitado
        if (enableRefetchOnFocus && !isRefetchingRef.current) {
          isRefetchingRef.current = true;
          abortControllerRef.current = new AbortController();
          
          // Adicionar delay antes de refetch para evitar problemas
          setTimeout(() => {
            if (!abortControllerRef.current?.signal.aborted) {
              log('Executing focus refetch');
              handleFocus();
              lastFocusTimeRef.current = now;
            }
            isRefetchingRef.current = false;
          }, refetchDelay);
        }
      };

      const onBlur = () => {
        log('Window blurred');
        // Cancelar qualquer refetch pendente ao perder foco
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      };

      // Adicionar listeners customizados
      window.addEventListener('focus', onFocus);
      window.addEventListener('blur', onBlur);
      
      // Adicionar listener para visibilitychange como backup
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          onFocus();
        } else {
          onBlur();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup function
      return () => {
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onBlur);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    });

    // Cleanup ao desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enableRefetchOnFocus, refetchDelay, log]);

  // Função para forçar invalidação segura
  const safeInvalidateQueries = useCallback(async (queryKey?: any[]) => {
    try {
      log('Safe invalidating queries', { queryKey });
      
      // Cancelar invalidações anteriores
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      await queryClient.invalidateQueries({ 
        queryKey,
        refetchType: 'active' // Só refetch queries ativas
      });
      
      log('Queries invalidated successfully');
    } catch (error) {
      log('Error invalidating queries', error);
    }
  }, [queryClient, log]);

  return {
    safeInvalidateQueries,
    isWindowFocused: document.visibilityState === 'visible'
  };
} 