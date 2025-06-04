import { useState } from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSounds } from '@/hooks/use-sounds';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface PaymentOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  refreshCreditsOnSuccess?: boolean;
}

/**
 * Hook personalizado para gerenciar o processo de pagamento de rifas
 */
export function useCreditsPayment(options: PaymentOptions = {}) {
  const { refreshCredits } = useUserCredits();
  const { playSound } = useSounds();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para lidar com o sucesso do pagamento
  const handlePaymentSuccess = async () => {
    setIsProcessing(false);
    
    // Reproduz som de sucesso
    playSound('success');
    
    try {
      // Refresh credits data
      await refreshCredits();
      
      // Invalidate all related queries to ensure fresh data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['user-rifas'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] }),
        queryClient.invalidateQueries({ queryKey: ['profile-data'] }),
        queryClient.refetchQueries({ queryKey: ['user-rifas'] })
      ]);
      
      // Mostra toast de sucesso
      toast({
        title: 'Pagamento confirmado!',
        description: 'Suas rifas foram adicionadas à sua conta.',
        variant: 'default'
      });
      
      // Chama callback de sucesso se fornecido
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (error) {
      console.error('Error refreshing credits after payment:', error);
      // Still call success callback even if refresh fails
      if (options.onSuccess) {
        options.onSuccess();
      }
    }
  };

  // Função para lidar com erro no pagamento
  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    
    // Mostra toast de erro
    toast({
      title: 'Erro no pagamento',
      description: error.message || 'Ocorreu um erro durante o processamento do pagamento.',
      variant: 'destructive'
    });
    
    // Chama callback de erro se fornecido
    if (options.onError) {
      options.onError(error);
    }
  };

  return {
    isProcessing,
    setIsProcessing,
    handlePaymentSuccess,
    handlePaymentError
  };
} 