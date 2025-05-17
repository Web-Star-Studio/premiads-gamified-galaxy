import { useEffect, useState } from 'react';
import { useCreditsStore } from '@/store/useCreditsStore';
import { realtimeCreditsService } from '@/services/realtime-credits';
import { useSounds } from '@/hooks/use-sounds';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook personalizado para consumir e gerenciar os créditos do usuário atual
 * Fornece acesso ao saldo de créditos, status de carregamento e erros
 * Configura automaticamente assinaturas em tempo real para atualizações
 */
export function useUserCredits() {
  const { user } = useAuth();
  const { playSound } = useSounds();
  const { credits, isLoading, error, fetchCredits } = useCreditsStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializa os créditos e configura assinatura em tempo real
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initCredits = async () => {
      if (!user?.id) return;
      
      // Busca os créditos iniciais
      await fetchCredits(user.id);
      
      // Configura a assinatura em tempo real
      await realtimeCreditsService.subscribeToUserCredits(user.id);
      
      // Registra um listener para atualizações de créditos
      unsubscribe = realtimeCreditsService.addUpdateListener((eventType) => {
        // Reproduz um som quando créditos são adicionados ou atualizados
        if (eventType === 'INSERT' || eventType === 'UPDATE') {
          playSound('notification');
        }
      });
      
      setIsInitialized(true);
    };
    
    initCredits();
    
    // Cleanup: cancela assinaturas quando o componente é desmontado
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, fetchCredits, playSound]);
  
  // Valores derivados para facilitar o uso
  const availableCredits = credits.availableTokens;
  const totalCredits = credits.totalTokens;
  const usedCredits = credits.usedTokens;
  
  // Funções auxiliares
  const hasEnoughCredits = (amount: number) => availableCredits >= amount;
  
  // Força uma atualização manual dos créditos
  const refreshCredits = async () => {
    if (user?.id) {
      await fetchCredits(user.id);
    }
  };

  return {
    // Valores
    credits,
    totalCredits,
    availableCredits,
    usedCredits,
    
    // Estados
    isLoading,
    isInitialized,
    error,
    
    // Funções auxiliares
    hasEnoughCredits,
    refreshCredits
  };
} 