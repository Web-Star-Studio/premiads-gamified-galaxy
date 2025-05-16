import { useState } from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useSounds } from '@/hooks/use-sounds';
import { useToast } from '@/components/ui/use-toast';

interface PaymentOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  refreshCreditsOnSuccess?: boolean;
}

/**
 * Hook personalizado para gerenciar o processo de pagamento de créditos
 */
export function useCreditsPayment(options: PaymentOptions = {}) {
  const { refreshCredits } = useUserCredits();
  const { playSound } = useSounds();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para lidar com o sucesso do pagamento
  const handlePaymentSuccess = async () => {
    setIsProcessing(false);
    
    // Reproduz som de sucesso
    playSound('success');
    
    // Exibe toast de sucesso
    toast({
      title: 'Pagamento confirmado!',
      description: 'Seus créditos foram adicionados à sua conta.',
      variant: 'default',
    });
    
    // Atualiza os créditos do usuário se a opção estiver ativada
    if (options.refreshCreditsOnSuccess !== false) {
      await refreshCredits();
    }
    
    // Executa callback de sucesso se fornecido
    if (options.onSuccess) {
      options.onSuccess();
    }
  };

  // Função para lidar com erro no pagamento
  const handlePaymentError = (error: Error) => {
    setIsProcessing(false);
    
    // Reproduz som de erro
    playSound('error');
    
    // Exibe toast de erro
    toast({
      title: 'Erro no pagamento',
      description: error.message || 'Ocorreu um erro ao processar seu pagamento.',
      variant: 'destructive',
    });
    
    // Executa callback de erro se fornecido
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