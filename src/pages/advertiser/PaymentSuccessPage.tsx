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

interface PurchaseDetails {
  credits: number;
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
  const queryClient = useQueryClient();
  const [isAnimating, setIsAnimating] = useState(true);
  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
  
  const sessionId = searchParams.get('session_id');
  
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
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  useEffect(() => {
    // Play success sound
    playSound('reward');
    
    // Launch confetti effect
    launchConfetti();
    
    // Refresh user data
    queryClient.invalidateQueries({ queryKey: ['userCredits'] });
    queryClient.invalidateQueries({ queryKey: ['activityLog'] });
    
    // For now, use mock data based on session ID
    // In production, this would fetch actual data from the database
    if (sessionId) {
      // Mock purchase details - in a real app, this would come from the database
      const mockPurchaseDetails: PurchaseDetails = {
        credits: 5000,
        bonus: 1000,
        total: 6000
      };
      
      setPurchaseDetails(mockPurchaseDetails);
      
      toast({
        title: "Pagamento confirmado!",
        description: `${mockPurchaseDetails.total} créditos foram adicionados à sua conta.`,
        variant: "default"
      });
    }
    
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
              description="Seus créditos foram adicionados à sua conta"
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
                          <p className="mb-2">Você adquiriu <span className="font-bold text-pink-500">{purchaseDetails.credits}</span> créditos</p>
                          <p className="mb-4">+ <span className="font-bold text-violet-400">{purchaseDetails.bonus}</span> de bônus</p>
                          <p className="text-3xl font-bold">Total: <span className="text-green-400">{purchaseDetails.total}</span> créditos</p>
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
                        <h2 className="text-2xl font-bold text-white mb-4">Seus créditos estão prontos para uso!</h2>
                        <p className="text-gray-300 mb-6">
                          Agora você pode criar e impulsionar suas campanhas para alcançar mais participantes.
                        </p>
                        
                        {purchaseDetails && (
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-galaxy-purple/30 p-4 rounded-lg">
                              <p className="text-sm text-gray-400">Créditos Base</p>
                              <p className="text-2xl font-bold text-white">{purchaseDetails.credits}</p>
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