import { supabase } from './supabase';
import { useCreditsStore } from '@/store/useCreditsStore';

let activeSubscription: any = null;

// Função para emitir eventos quando os créditos são atualizados
type CreditUpdateListener = (eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;
const listeners: CreditUpdateListener[] = [];

/**
 * Serviço para gerenciar assinaturas em tempo real para atualizações de créditos
 */
export const realtimeCreditsService = {
  /**
   * Inicia uma assinatura para mudanças na tabela profiles para o usuário especificado
   */
  subscribeToUserCredits: async (userId: string) => {
    // Cancela qualquer assinatura existente antes de criar uma nova
    if (activeSubscription) {
      await realtimeCreditsService.unsubscribe();
    }
    
    if (!userId) return;
    
    // Busca os créditos iniciais
    await useCreditsStore.getState().fetchCredits(userId);
    
    // Estabelece uma nova assinatura
    activeSubscription = supabase
      .channel('user-credits-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Ouvir inserções, atualizações e exclusões
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        async (payload) => {
          console.log('Atualização de créditos recebida:', payload);
          
          // Atualiza o estado global
          await useCreditsStore.getState().refreshCredits(userId);
          
          // Notifica todos os ouvintes registrados sobre a mudança
          const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
          listeners.forEach(listener => listener(eventType));
        }
      )
      .subscribe();
    
    return activeSubscription;
  },
  
  /**
   * Cancela a assinatura atual
   */
  unsubscribe: async () => {
    if (activeSubscription) {
      await supabase.removeChannel(activeSubscription);
      activeSubscription = null;
    }
  },

  /**
   * Registra um ouvinte para notificações de atualização de créditos
   */
  addUpdateListener: (listener: CreditUpdateListener) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }
}; 