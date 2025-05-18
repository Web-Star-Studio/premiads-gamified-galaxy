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
  const { user } = useAuth();
  const { toast } = useToast();

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

  return {
    selectedPackage,
    setSelectedPackage,
    purchaseOptions,
    setPurchaseOptions,
    handlePurchase,
    isCreatingCheckout,
  };
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  credit: number;
  stripe_price_id: string;
}

export interface PurchaseOptions {
  paymentMethod: "stripe" | "paypal";
  successUrl: string;
  cancelUrl: string;
}
