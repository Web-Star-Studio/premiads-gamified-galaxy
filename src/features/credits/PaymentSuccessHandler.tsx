
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserCredits } from '@/hooks/useUserCredits';
import { useCreditsPayment } from '@/hooks/credits/useCreditsPayment';

/**
 * Componente que lida com o redirecionamento após um pagamento bem-sucedido
 * Este componente deve ser montado nas rotas que recebem o redirecionamento do Stripe
 */
export function PaymentSuccessHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshCredits } = useUserCredits();
  const { handlePaymentSuccess, handlePaymentError } = useCreditsPayment({
    refreshCreditsOnSuccess: true,
    onSuccess: () => {
      // Redireciona para a página de sucesso após o processamento
      navigate('/anunciante/pagamento-sucesso');
    }
  });
  
  // Processa parâmetros de sucesso ou erro na URL
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const paymentSuccess = searchParams.get('success');
      const paymentError = searchParams.get('error');
      const paymentCancelled = searchParams.get('cancelled');
      
      // Se houver um parâmetro de sucesso
      if (paymentSuccess === 'true') {
        // Atualiza os créditos e executa o callback de sucesso
        await refreshCredits();
        handlePaymentSuccess();
      } 
      // Se houver um erro no pagamento
      else if (paymentError) {
        handlePaymentError(new Error(decodeURIComponent(paymentError)));
      }
      // Se o pagamento foi cancelado
      else if (paymentCancelled === 'true') {
        handlePaymentError(new Error('Pagamento cancelado pelo usuário'));
      }
    };
    
    checkPaymentStatus();
  }, [searchParams, handlePaymentSuccess, handlePaymentError, refreshCredits]);
  
  // Este componente não renderiza nada visualmente
  return null;
}
