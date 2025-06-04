import { ReactNode, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { realtimeCreditsService } from '@/services/realtime-credits';
import { useCreditsStore } from '@/store/useCreditsStore';

interface CreditsProviderProps {
  children: ReactNode;
}

/**
 * Provedor de contexto que inicializa o sistema de gerenciamento de rifas
 * Este componente deve ser colocado na árvore de componentes após o AuthProvider
 */
export function CreditsProvider({ children }: CreditsProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const { fetchCredits, resetCredits } = useCreditsStore();

  // Inicializa a assinatura de rifas quando o usuário faz login
  useEffect(() => {
    const setupRifas = async () => {
      if (isAuthenticated && user?.id) {
        console.log('Inicializando sistema de rifas para o usuário:', user.id);
        await fetchCredits(user.id); // Função ainda busca rifas, apenas o nome que precisa ser atualizado
        await realtimeCreditsService.subscribeToUserCredits(user.id);
      } else {
        // Limpa as rifas quando não há usuário autenticado
        resetCredits();
        await realtimeCreditsService.unsubscribe();
      }
    };

    setupRifas();

    // Cleanup
    return () => {
      realtimeCreditsService.unsubscribe();
    };
  }, [isAuthenticated, user?.id, fetchCredits, resetCredits]);

  return <>{children}</>;
} 