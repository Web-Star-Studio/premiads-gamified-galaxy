
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import RaffleList from "@/components/client/raffles/RaffleList";
import RaffleDetails from "@/components/client/raffles/RaffleDetails";
import TicketConversion from "@/components/client/raffles/TicketConversion";
import ParticipationHistory from "@/components/client/raffles/ParticipationHistory";
import { useSounds } from "@/hooks/use-sounds";

const ClientRaffles = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [selectedRaffleId, setSelectedRaffleId] = useState<number | null>(null);

  useEffect(() => {
    // Redirect if user is not a participant
    if (userType !== "participante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
      // Play welcome sound when page loads
      playSound("chime");
    }, 1200);

    return () => clearTimeout(loadTimer);
  }, [userType, navigate, toast, playSound]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-cyan">Carregando sorteios disponíveis...</h2>
        </motion.div>
      </div>
    );
  }

  const handleSelectRaffle = (raffleId: number) => {
    setSelectedRaffleId(raffleId);
    playSound("pop");
  };

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <ClientDashboardHeader 
          title="Sorteios e Prêmios" 
          description="Use seus pontos para ganhar tickets e participe de sorteios exclusivos" 
          userName={userName} 
          showBackButton={true}
          backTo="/cliente"
        />
        
        <div className="mt-8">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-galaxy-deepPurple/50 border border-galaxy-purple/20">
              <TabsTrigger value="active">Sorteios Ativos</TabsTrigger>
              <TabsTrigger value="conversion">Converter Pontos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                  className="lg:col-span-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <RaffleList 
                    onSelectRaffle={handleSelectRaffle} 
                    selectedRaffleId={selectedRaffleId}
                  />
                </motion.div>
                
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {selectedRaffleId ? (
                    <RaffleDetails raffleId={selectedRaffleId} />
                  ) : (
                    <div className="glass-panel p-8 text-center h-full flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2
                        }}
                      >
                        <div className="w-24 h-24 rounded-full bg-galaxy-deepPurple/50 flex items-center justify-center border border-neon-cyan/30">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neon-cyan">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                            <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                            <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                          </svg>
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-heading mt-6">Selecione um Sorteio</h3>
                      <p className="text-gray-400 mt-2 max-w-md">
                        Escolha um dos sorteios disponíveis para ver detalhes e participar com seus tickets.
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="conversion" className="mt-6">
              <TicketConversion />
            </TabsContent>
            
            <TabsContent value="history" className="mt-6">
              <ParticipationHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientRaffles;
