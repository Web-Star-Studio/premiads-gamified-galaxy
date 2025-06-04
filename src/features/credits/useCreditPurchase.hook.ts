import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuthSession } from "@/hooks/useAuthSession";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { getSupabaseConfig } from '@/services/config';

// Initialize Stripe outside of the component
let stripePromise: Promise<any> | null = null;
const getStripe = async () => {
  if (!stripePromise) {
    // Busca chave pública via Edge Function get-config
    const { stripePublishableKey } = await getSupabaseConfig();
    if (!stripePublishableKey) throw new Error('Chave pública do Stripe não definida');
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Define the CreditPackage interface first
export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  credit: number;
  stripe_price_id?: string;
  // Add extra properties needed by the components
  base: number;
  bonus: number;
}

export interface PurchaseOptions {
  paymentMethod: "stripe" | "paypal";
  successUrl: string;
  cancelUrl: string;
}

// Define the hook
export default function useCreditPurchase() {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(
    null
  );
  const [purchaseOptions, setPurchaseOptions] = useState<PurchaseOptions>({
    paymentMethod: "stripe",
    successUrl: `${window.location.origin}/credits/success`,
    cancelUrl: `${window.location.origin}/credits/cancel`,
  });
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [paymentError, setPaymentError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuthSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Fetch credit packages
    const fetchPackages = async () => {
      try {
        const db = supabase as any;
        const { data, error } = await db
          .from('rifa_packages')
          .select('*')
          .eq('active', true)
          .order('price', { ascending: true });
        
        if (error) throw error;
        
        // Transform data to match the CreditPackage interface
        const formattedPackages = (data as any[]).map((pkg: any) => ({
          id: pkg.id,
          name: `${pkg.rifas_amount} Rifas`,
          description: pkg.rifas_bonus > 0 ? `${pkg.rifas_bonus} Rifas bônus` : 'Pacote básico',
          price: pkg.price,
          credit: pkg.rifas_amount + pkg.rifas_bonus,
          stripe_price_id: '',
          base: pkg.rifas_amount,
          bonus: pkg.rifas_bonus
        }));
        
        setPackages(formattedPackages);
        
        // Set default package
        if (formattedPackages.length > 0 && !selectedPackage) {
          setSelectedPackage(formattedPackages[0]);
        }
      } catch (error) {
        console.error('Error fetching credit packages:', error);
      }
    };
    
    fetchPackages();
  }, [selectedPackage]);

  // Mutation to handle credit purchase via Edge Function
  const { mutate: createPurchase, isPending: isCreatingPurchase } =
    useMutation({
      mutationFn: async ({ provider, method }: { provider: 'mercado_pago' | 'stripe'; method: 'pix' | 'credit_card' | 'boleto' | 'debit' }) => {
        if (!selectedPackage) throw new Error('Nenhum pacote selecionado.')
        if (!user) throw new Error('Usuário não autenticado.')

        const { data, error } = await supabase.functions.invoke(
          'purchase-credits',
          {
            body: {
              userId: user.id,
              packageId: selectedPackage.id,
              paymentProvider: provider,
              paymentMethod: method,
            },
          }
        )

        if (error) {
          console.error('Erro ao iniciar compra:', error)
          throw new Error(error.message || 'Falha ao iniciar compra.')
        }

        return data
      },
      onSuccess: async (data: any) => {
        // Invalidate queries to refresh user data
        queryClient.invalidateQueries({ queryKey: ['user-rifas'] })
        queryClient.invalidateQueries({ queryKey: ['userCredits'] })
        queryClient.invalidateQueries({ queryKey: ['profile'] })
        queryClient.invalidateQueries({ queryKey: ['activityLog'] })

        // Para Stripe, redireciona via Stripe.js
        if (data.payment?.session_id) {
          const stripe = await getStripe()
          const { error } = await stripe?.redirectToCheckout({ sessionId: data.payment.session_id })

          if (error) {
            console.error('Erro ao redirecionar Stripe:', error)
            toast({
              title: 'Erro ao redirecionar para o Stripe',
              description: error.message,
              variant: 'destructive',
            })
          }
        } else if (data.payment?.payment_url) {
          // Outros provedores ou PIX
          window.location.href = data.payment.payment_url
        }
      },
      onError: (error: any) => {
        console.error('Erro ao iniciar compra:', error)
        toast({
          title: 'Erro ao iniciar compra',
          description: error.message,
          variant: 'destructive',
        })
      },
    })

  // Função para disparar a compra
  const handlePurchase = (
    provider: 'mercado_pago' | 'stripe',
    method: 'pix' | 'credit_card' | 'boleto' | 'debit'
  ) => {
    createPurchase({ provider, method })
  }
  
  // Function to handle payment confirmation from UI
  const handlePayment = (
    provider: 'mercado_pago' | 'stripe',
    method: 'pix' | 'credit_card' | 'boleto' | 'debit'
  ) => {
    setIsLoading(true)
    setPaymentError(null)
    try {
      handlePurchase(provider, method)
    } catch (error: any) {
      setPaymentError(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Reset state 
  const resetState = () => {
    setSelectedPackage(null);
    setIsPaymentModalOpen(false);
    setPaymentError(null);
  };

  return {
    selectedPackage,
    setSelectedPackage,
    purchaseOptions,
    setPurchaseOptions,
    handlePurchase,
    isCreatingPurchase,
    // Additional properties needed by components
    packages,
    paymentMethod,
    setPaymentMethod,
    isPaymentModalOpen, 
    setIsPaymentModalOpen,
    handlePayment,
    isLoading,
    paymentError,
    resetState
  };
}
