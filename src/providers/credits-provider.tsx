import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { realtimeCreditsService } from '@/services/realtime-credits';
import { useCreditsStore } from '@/store/useCreditsStore';

interface CreditsProviderProps {
  children: ReactNode;
}

/**
 * Provedor de contexto que inicializa o sistema de gerenciamento de créditos
 * Este componente deve ser colocado na árvore de componentes após o AuthProvider
 */
export function CreditsProvider({ children }: CreditsProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const { fetchCredits, resetCredits } = useCreditsStore();

  // Inicializa a assinatura de créditos quando o usuário faz login
  useEffect(() => {
    const setupCredits = async () => {
      if (isAuthenticated && user?.id) {
        console.log('Inicializando sistema de créditos para o usuário:', user.id);
        await fetchCredits(user.id);
        await realtimeCreditsService.subscribeToUserCredits(user.id);
      } else {
        // Limpa os créditos quando não há usuário autenticado
        resetCredits();
        await realtimeCreditsService.unsubscribe();
      }
    };

    setupCredits();

    // Cleanup
    return () => {
      realtimeCreditsService.unsubscribe();
    };
  }, [isAuthenticated, user?.id, fetchCredits, resetCredits]);

  return <>{children}</>;
} 