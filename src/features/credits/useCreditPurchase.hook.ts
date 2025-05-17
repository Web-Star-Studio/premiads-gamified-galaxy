import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useUserCredits } from '@/hooks/useUserCredits';

interface PurchaseOptions {
  amount: number;
  paymentMethod: 'credit_card' | 'pix' | 'bank_transfer';
  promoCode?: string;
}

export function useCreditPurchase() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { refreshCredits } = useUserCredits();

  const purchaseCredits = async (options: PurchaseOptions) => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return { success: false, error: 'Usuário não autenticado' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get current session for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      // Call the purchase API endpoint
      const { data, error } = await supabase.functions.invoke('process-credit-purchase', {
        body: {
          userId: user.id,
          amount: options.amount,
          paymentMethod: options.paymentMethod,
          promoCode: options.promoCode
        }
      });

      if (error) throw error;

      // Refresh credits to show the updated balance
      await refreshCredits();

      toast({
        title: 'Compra realizada com sucesso',
        description: `${options.amount} créditos foram adicionados à sua conta.`,
      });

      return { success: true, data };
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao processar a compra de créditos';
      setError(errorMessage);
      
      toast({
        title: 'Erro na compra',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const validatePromoCode = async (code: string) => {
    if (!code) return { valid: false, discount: 0 };
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('validate-promo-code', {
        body: { code }
      });
      
      if (error) throw error;
      
      return { 
        valid: data.valid, 
        discount: data.discountPercentage || 0,
        message: data.message
      };
    } catch (err) {
      return { valid: false, discount: 0 };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    purchaseCredits,
    validatePromoCode,
    isLoading,
    error
  };
}
