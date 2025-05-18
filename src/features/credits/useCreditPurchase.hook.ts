
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe outside of the component
let stripePromise: Promise<any> | null = null;
const getStripe = async () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );
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
  stripe_price_id: string;
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
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch credit packages
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('credit_packages')
          .select('*')
          .eq('active', true)
          .order('price', { ascending: true });
        
        if (error) throw error;
        
        // Transform data to match the CreditPackage interface
        const formattedPackages = data.map(pkg => ({
          id: pkg.id,
          name: `${pkg.base} Credits`,
          description: pkg.bonus > 0 ? `${pkg.bonus} bonus credits` : 'Basic package',
          price: pkg.price,
          credit: pkg.base + pkg.bonus,
          stripe_price_id: pkg.stripe_price_id || '',
          base: pkg.base,
          bonus: pkg.bonus
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

  // Mutation to handle the Stripe checkout
  const { mutate: createCheckout, isPending: isCreatingCheckout } =
    useMutation({
      mutationFn: async () => {
        if (!selectedPackage) {
          throw new Error("No credit package selected.");
        }

        if (!user) {
          throw new Error("User not authenticated.");
        }

        // Call the Supabase function to create a Stripe checkout session
        const { data, error } = await supabase.functions.invoke(
          "create-stripe-checkout-session",
          {
            body: {
              priceId: selectedPackage.stripe_price_id,
              successUrl: purchaseOptions.successUrl,
              cancelUrl: purchaseOptions.cancelUrl,
              userId: user.id,
            },
          }
        );

        if (error) {
          console.error("Stripe checkout session creation error:", error);
          throw new Error(
            error.message || "Failed to create Stripe checkout session."
          );
        }

        return data;
      },
      onSuccess: async (data: any) => {
        // Redirect to Stripe checkout
        const stripe = await getStripe();
        const { error } = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (error) {
          console.error("Stripe redirection error:", error);
          toast({
            title: "Erro ao redirecionar para o Stripe",
            description: error.message,
            variant: "destructive",
          });
        }
      },
      onError: (error: any) => {
        console.error("Error creating checkout session:", error);
        toast({
          title: "Erro ao criar sessão de checkout",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  // Function to handle initiating the purchase
  const handlePurchase = () => {
    createCheckout();
  };
  
  // Function to handle payment confirmation
  const handlePayment = () => {
    setIsLoading(true);
    setPaymentError(null);
    
    try {
      handlePurchase();
    } catch (error: any) {
      setPaymentError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
    isCreatingCheckout,
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
