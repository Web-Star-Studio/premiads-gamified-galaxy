import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

interface SafeQueryOptions<TData> extends Omit<UseQueryOptions<TData>, 'queryFn'> {
  queryFn: () => Promise<TData>;
  timeout?: number;
  onTimeout?: () => void;
  debugLabel?: string;
}

export function useSafeQuery<TData = unknown>({
  queryFn,
  timeout = 30000, // 30 segundos por padrão
  onTimeout,
  debugLabel = 'SafeQuery',
  ...options
}: SafeQueryOptions<TData>): UseQueryResult<TData> & { isTimeout: boolean } {
  const [isTimeout, setIsTimeout] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Função wrapper para adicionar timeout e abort controller
  const wrappedQueryFn = async () => {
    // Resetar estado de timeout
    setIsTimeout(false);
    
    // Limpar timeout anterior se existir
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }
    
    // Criar novo abort controller apenas se não existir um ativo
    if (!abortControllerRef.current || abortControllerRef.current.signal.aborted) {
      abortControllerRef.current = new AbortController();
    }
    
    const { signal } = abortControllerRef.current;
    
    // Configurar timeout
    timeoutIdRef.current = setTimeout(() => {
      console.warn(`[${debugLabel}] Query timeout after ${timeout}ms`);
      setIsTimeout(true);
      abortControllerRef.current?.abort();
      onTimeout?.();
    }, timeout);
    
    try {
      // Executar query original
      const result = await queryFn();
      
      // Limpar timeout se sucesso
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      // Verificar se foi abortado durante a execução
      if (signal.aborted) {
        throw new Error('Query aborted');
      }
      
      return result;
    } catch (error: any) {
      // Limpar timeout em caso de erro
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }
      
      // Se foi abortado, não re-throw para evitar erros desnecessários
      if (signal.aborted && !isTimeout) {
        console.log(`[${debugLabel}] Query aborted (expected during cleanup)`);
        throw new Error('Query aborted');
      }
      
      // Re-throw se não for erro de abort
      if (error.name !== 'AbortError' && error.message !== 'Query aborted') {
        throw error;
      }
      
      // Se foi timeout, lançar erro específico
      if (isTimeout) {
        throw new Error(`Query timeout: ${debugLabel}`);
      }
      
      throw error;
    } finally {
      // Resetar abort controller se a query completou
      if (!signal.aborted) {
        abortControllerRef.current = null;
      }
    }
  };

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const queryResult = useQuery({
    ...options,
    queryFn: wrappedQueryFn,
    // Adicionar retry logic melhorado
    retry: (failureCount, error: any) => {
      // Não fazer retry se foi timeout ou abort
      if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
        return false;
      }
      
      // Usar retry padrão ou personalizado
      if (typeof options.retry === 'function') {
        return options.retry(failureCount, error);
      }
      
      return typeof options.retry === 'number' ? failureCount < options.retry : options.retry ?? true;
    }
  });

  return {
    ...queryResult,
    isTimeout
  };
} 