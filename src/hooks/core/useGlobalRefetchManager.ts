import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

export function useGlobalRefetchManager() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);
  const lastVisibilityRef = useRef(document.visibilityState);
  const isRefetchingRef = useRef(false);
  
  useEffect(() => {
    const handleVisibilityChange = async () => {
      const currentVisibility = document.visibilityState;
      const wasHidden = lastVisibilityRef.current === 'hidden';
      const isNowVisible = currentVisibility === 'visible';
      
      // Se estava oculto e agora está visível
      if (wasHidden && isNowVisible && !isRefetchingRef.current) {
        console.log('[RefetchManager] Tab became visible, checking queries...');
        
        isRefetchingRef.current = true;
        
        // Aguardar um momento para estabilizar
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verificar queries que precisam ser refetchadas
        const queryCache = queryClient.getQueryCache();
        const queries = queryCache.getAll();
        
        const staleQueries = queries.filter(query => {
          const isStale = query.isStale();
          const hasNoData = !query.state.data;
          const hasError = query.state.status === 'error';
          const isIdle = query.state.fetchStatus === 'idle';
          
          return (isStale || hasNoData || hasError) && isIdle;
        });
        
        if (staleQueries.length > 0) {
          console.log(`[RefetchManager] Found ${staleQueries.length} queries that need refetch`);
          
          // Refetch queries em lote
          await Promise.all(
            staleQueries.map(query => {
              console.log('[RefetchManager] Refetching:', query.queryKey);
              return query.fetch();
            })
          );
        }
        
        isRefetchingRef.current = false;
      }
      
      lastVisibilityRef.current = currentVisibility;
    };
    
    // Listener para mudança de rota
    if (location.pathname !== lastPathRef.current) {
      console.log('[RefetchManager] Route changed from', lastPathRef.current, 'to', location.pathname);
      lastPathRef.current = location.pathname;
      
      // Invalidar queries da rota anterior se necessário
      setTimeout(() => {
        const queryCache = queryClient.getQueryCache();
        const queries = queryCache.getAll();
        
        queries.forEach(query => {
          if (query.isStale() && query.state.fetchStatus === 'idle') {
            query.fetch();
          }
        });
      }, 100);
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, queryClient]);
} 