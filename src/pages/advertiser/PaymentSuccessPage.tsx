import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUser } from "@/context/UserContext";
import { useSounds } from "@/hooks/use-sounds";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useCreditsPayment } from "@/hooks/credits/useCreditsPayment";

interface PurchaseDetails {
  rifas: number;
  bonus: number;
  total: number;
}

function PaymentSuccessPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userName } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { refreshCredits } = useUserCredits();
  const { handlePaymentSuccess } = useCreditsPayment();
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(true);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [purchase, setPurchase] = useState<any>(null);
  const [rifasAwarded, setRifasAwarded] = useState(0);
  const [bonusRifas, setBonusRifas] = useState(0);
  
  // Evita processamento duplicado em renderizações estritas / re-renders
  const hasProcessedRef = React.useRef(false);
  
  const sessionId = searchParams.get('session_id');
  
  // Function to fetch purchase details from Supabase
  const fetchPurchaseDetails = async (sessionId: string) => {
    try {
      console.log("Fetching purchase details for session:", sessionId);
      
      const { data: purchases, error: purchaseError } = await supabase
        .from('rifa_purchases')
        .select('*')
        .eq('payment_id', sessionId)
        .single();
      
      if (purchaseError || !purchases) {
        console.error("Error fetching purchase:", purchaseError);
        throw new Error("Purchase not found");
      }
      
      console.log("Found purchase:", purchases);
      
      // If purchase status is still pending, try to update it
      if (purchases.status === 'pending') {
        await ensurePurchaseConfirmed(purchases.id);
      }
      
      return {
        rifas: purchases.base,
        bonus: purchases.bonus,
        total: purchases.total_rifas
      };
    } catch (error) {
      console.error("Error in fetchPurchaseDetails:", error);
      // Fallback to mock data if we can't get the real data
      return {
        rifas: 5000,
        bonus: 1000,
        total: 6000
      };
    }
  };
  
  // Function to ensure purchase is confirmed even if webhook failed
  const ensurePurchaseConfirmed = async (purchaseId: string) => {
    try {
      console.log("Invoking update-rifa-purchase-status for purchase:", purchaseId)
      
      const { data, error } = await supabase.functions.invoke('update-rifa-purchase-status', {
        body: JSON.stringify({ purchase_id: purchaseId, new_status: 'confirmed' })
      })
      
      console.log('Function invocation result:', { data, error })
      
      if (error) {
        console.error('Error invoking function:', error)
      }
      
      // Refresh queries to get updated user data
      queryClient.invalidateQueries({ queryKey: ['userCredits'] });
      queryClient.invalidateQueries({ queryKey: ['activityLog'] });
    } catch (err) {
      console.error('Error in ensurePurchaseConfirmed:', err)
    }
  };
  
  // Launch confetti effect
  const launchConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#7928CA', '#FF0080', '#0070F3', '#00DFD8'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    if (hasProcessedRef.current) return; // já executado
    hasProcessedRef.current = true;

    const processPurchase = async () => {
      const purchaseId = searchParams.get('purchase_id');
      const sessionId = searchParams.get('session_id');

      if (!purchaseId && !sessionId) {
        navigate('/anunciante/creditos');
        return;
      }

      try {
        setIsLoading(true);

        // Determine how to fetch the purchase: by id (query param) or by payment session id
        let purchaseData: any
        let purchaseError: any

        if (purchaseId) {
          // Fetch by primary id
          ;({ data: purchaseData, error: purchaseError } = await supabase
            .from('rifa_purchases')
            .select(
              `
              *,
              rifa_packages (
                rifas_amount,
                rifas_bonus,
                price
              )
              `
            )
            .eq('id', purchaseId)
            .single())
        } else if (sessionId) {
          // Fallback: fetch by Stripe session / payment id stored in `payment_id`
          ;({ data: purchaseData, error: purchaseError } = await supabase
            .from('rifa_purchases')
            .select(
              `
              *,
              rifa_packages (
                rifas_amount,
                rifas_bonus,
                price
              )
              `
            )
            .eq('payment_id', sessionId)
            .single())
        } else {
          // Should not reach here due to guard clause above, but keep as safety net
          throw new Error('Nenhum identificador de compra encontrado')
        }

        if (purchaseError) throw purchaseError;

        const resolvedPurchaseId = purchaseData?.id as string | undefined

        if (purchaseData && resolvedPurchaseId) {
          setPurchase(purchaseData);
          setRifasAwarded(purchaseData.rifa_packages.rifas_amount);
          setBonusRifas(purchaseData.rifa_packages.rifas_bonus);

          // Atualiza status somente se ainda não estiver confirmado
          if (purchaseData.status !== 'confirmed') {
            console.log('Updating purchase status to confirmed...')
            const { data: updateResult, error: updateError } = await supabase.functions.invoke(
              'update-rifa-purchase-status',
              {
                body: {
                  purchase_id: resolvedPurchaseId,
                  new_status: 'confirmed'
                }
              }
            );

            console.log('Update result:', updateResult)
            if (updateError) {
              console.error('Error updating purchase status:', updateError);
            } else {
              console.log('Purchase status updated successfully:', updateResult)
            }
          }

          // Multiple invalidation strategies to ensure UI updates
          console.log('Invalidating queries and refreshing data...')
          
          // 1. Invalidate all user-related queries
          await Promise.all([
            queryClient.invalidateQueries({ queryKey: ['user-rifas'] }),
            queryClient.invalidateQueries({ queryKey: ['userCredits'] }),
            queryClient.invalidateQueries({ queryKey: ['profile-data'] }),
            queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] }),
            queryClient.invalidateQueries({ queryKey: ['activityLog'] }),
            queryClient.removeQueries({ queryKey: ['user-rifas'] }),
            queryClient.removeQueries({ queryKey: ['userCredits'] })
          ])
          
          // 2. Force refresh credits multiple times
          try {
            await refreshCredits()
            console.log('First refresh completed')
          } catch (error) {
            console.error('Error in first refresh:', error)
          }
          
          // 3. Handle payment success which also refreshes
          try {
            await handlePaymentSuccess()
            console.log('Payment success handler completed')
          } catch (error) {
            console.error('Error in payment success handler:', error)
          }
          
          // 4. Additional refresh after a delay to catch any async updates
          setTimeout(async () => {
            try {
              console.log('Performing delayed refresh...')
              await refreshCredits()
              await queryClient.invalidateQueries({ queryKey: ['user-rifas'] })
              await queryClient.refetchQueries({ queryKey: ['user-rifas'] })
              console.log('Delayed refresh completed')
            } catch (error) {
              console.error('Error in delayed refresh:', error)
            }
          }, 1000)
          
          // 5. Final refresh after longer delay
          setTimeout(async () => {
            try {
              console.log('Performing final refresh...')
              await refreshCredits()
              console.log('Final refresh completed')
            } catch (error) {
              console.error('Error in final refresh:', error)
            }
          }, 3000)

          // Play success sound
          playSound('success');

          toast({
            title: 'Pagamento confirmado!',
            description: 'Suas rifas foram adicionadas à sua conta.'
          });
        }
      } catch (error) {
        console.error('Error processing purchase:', error);
        toast({
          title: "Erro ao processar pagamento",
          description: "Houve um problema ao confirmar seu pagamento. Entre em contato com o suporte.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    processPurchase();
  }, [searchParams, navigate, toast, handlePaymentSuccess, refreshCredits, queryClient, playSound]);

  useEffect(() => {
    // Add log for debugging
    console.log("PaymentSuccessPage: URL params:", Object.fromEntries(searchParams.entries()));
    console.log("PaymentSuccessPage: sessionId:", sessionId);
    
    // Launch confetti effect
    launchConfetti();
    
    // Timer to stop the animation after 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <>
      <Helmet>
        <title>Pagamento Confirmado | PremiAds</title>
        <meta name="description" content="Seu pagamento foi confirmado com sucesso!" />
      </Helmet>
      
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
          <AdvertiserSidebar />
          <SidebarInset className="overflow-y-auto pb-20">
            <AdvertiserHeader 
              title="Pagamento Confirmado" 
              description="Suas rifas foram adicionadas à sua conta"
              userName={userName}
            />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AnimatePresence>
                  {isAnimating ? (
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
                      className="flex flex-col items-center"
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -20, 0],
                          rotate: [0, 5, 0, -5, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                        className="mb-8"
                      >
                        <div className="relative">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [1, 0.8, 1]
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 blur-xl opacity-70"
                          />
                          <CheckCircle className="w-32 h-32 text-green-400 relative z-10" />
                        </div>
                      </motion.div>
                      
                      <motion.h1 
                        className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text mb-4"
                        animate={{ 
                          scale: [1, 1.05, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      >
                        Pagamento Aprovado!
                      </motion.h1>
                      
                      {purchaseDetails && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-xl md:text-2xl text-gray-200 mb-8"
                        >
                          <p className="mb-2">Você adquiriu <span className="font-bold text-pink-500">{purchaseDetails.rifas}</span> rifas</p>
                          <p className="mb-4">+ <span className="font-bold text-violet-400">{purchaseDetails.bonus}</span> de bônus</p>
                          <p className="text-3xl font-bold">Total: <span className="text-green-400">{purchaseDetails.total}</span> rifas</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="bg-galaxy-purple/20 p-8 rounded-xl border border-pink-500/30 shadow-lg shadow-pink-500/20 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Suas rifas estão prontas para uso!</h2>
                        <p className="text-gray-300 mb-6">
                          Agora você pode criar e impulsionar suas campanhas para alcançar mais participantes.
                        </p>
                        
                        {purchaseDetails && (
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-galaxy-purple/30 p-4 rounded-lg">
                              <p className="text-sm text-gray-400">Rifas Base</p>
                              <p className="text-2xl font-bold text-white">{purchaseDetails.rifas}</p>
                            </div>
                            <div className="bg-galaxy-purple/30 p-4 rounded-lg">
                              <p className="text-sm text-gray-400">Bônus</p>
                              <p className="text-2xl font-bold text-violet-400">{purchaseDetails.bonus}</p>
                            </div>
                            <div className="bg-galaxy-purple/30 p-4 rounded-lg">
                              <p className="text-sm text-gray-400">Total</p>
                              <p className="text-2xl font-bold text-green-400">{purchaseDetails.total}</p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button 
                            onClick={() => navigate('/anunciante/nova-campanha')}
                            className="bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500"
                          >
                            Criar Campanha
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => navigate('/anunciante')}
                            className="border-pink-500/50 text-pink-500 hover:bg-pink-500/20"
                          >
                            Ir para Dashboard
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}

export default PaymentSuccessPage; 