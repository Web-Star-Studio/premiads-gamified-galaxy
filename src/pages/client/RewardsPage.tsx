import { useState, useEffect } from "react";
import { Gift, Clock3, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import ClientHeader from "@/components/client/ClientHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@lottiefiles/react-lottie-player";
import LootBoxList from "@/components/client/rewards/LootBoxList";
import RaffleWinnersList from "@/components/client/rewards/RaffleWinnersList";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";


const RewardsPage = () => {
  const [loading, setLoading] = useState(true);
  const [lootBoxes, setLootBoxes] = useState<any[]>([]);
  const [raffleWinners, setRaffleWinners] = useState<any[]>([]);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const fetchRewards = async () => {
    setLoading(true);
    try {
      if (!user) throw new Error("Usuário não autenticado");

      // Buscar sorteios ganhos da tabela lotteries usando SQL raw
      try {
        const { data: lotteryData, error: lotteryError } = await supabase
          .from('lotteries' as any)
          .select('*')
          .not('winner', 'is', null)
          .order('updated_at', { ascending: false });
          
        if (lotteryError) {
          console.warn('Erro ao buscar da tabela lotteries:', lotteryError);
          setRaffleWinners([]);
        } else {
          // Filtrar manualmente os sorteios onde o usuário é vencedor
          const userWonLotteries = (lotteryData || []).filter((lottery: any) => {
            return lottery.winner && lottery.winner.id === user.id;
          });
          
          const formattedLotteries = userWonLotteries.map((lottery: any) => ({
            id: `lottery-${lottery.id}`,
            lottery_id: lottery.id,
            user_id: user.id,
            winning_number: lottery.winning_number,
            prize_name: lottery.prize_type || lottery.title,
            prize_value: lottery.prize_value,
            created_at: lottery.updated_at,
            raffle: {
              id: lottery.id,
              title: lottery.title,
              prize_type: lottery.prize_type,
              prize_value: lottery.prize_value,
              status: lottery.status,
              winning_number: lottery.winning_number
            }
          }));
          
          setRaffleWinners(formattedLotteries);
          
          if (formattedLotteries.length > 0) {
            playSound("chime");
            toast({
              title: "Sorteios ganhos carregados!",
              description: `Você tem ${formattedLotteries.length} sorteio(s) ganho(s)!`,
            });
          }
        }
      } catch (raffleErr) {
        console.warn('Erro ao buscar sorteios ganhos:', raffleErr);
        setRaffleWinners([]);
      }
      
      // Por enquanto, deixar lootboxes vazio até corrigir os tipos
      setLootBoxes([]);
      
    } catch (error: any) {
      console.error("Error fetching rewards:", error);
      toast({
        title: "Erro ao carregar recompensas",
        description: error.message || "Ocorreu um erro ao buscar suas recompensas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
    // Realtime subscription for loot boxes only
    const lootBoxesSubscription = supabase
      .channel('loot_box_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'mission_rewards',
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        }, 
        (payload) => {
          fetchRewards();
          playSound('reward');
        }
      )
      .subscribe();
    
    // Realtime subscription for lottery winners
    const lotteryWinnersSubscription = supabase
      .channel('lottery_winners_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'lottery_winners',
          filter: `user_id=eq.${supabase.auth.getUser().then(({ data }) => data.user?.id)}`
        }, 
        (payload) => {
          fetchRewards();
          playSound('reward');
        }
      )
      .subscribe();
      
    const refreshInterval = setInterval(fetchRewards, 30000);
    return () => {
      clearInterval(refreshInterval);
      lootBoxesSubscription.unsubscribe();
      lotteryWinnersSubscription.unsubscribe();
    };
  }, [location.key, toast, playSound, user?.id]);

  const handleRefresh = () => {
    fetchRewards();
    toast({
      title: "Atualizando recompensas",
      description: "Buscando suas recompensas mais recentes...",
    });
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          <div className="container px-4 py-8 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">Suas Recompensas</h1>
                <p className="text-gray-400 mt-1">Aqui você encontra todos os prêmios que conquistou em campanhas.</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  className="bg-galaxy-deepPurple/40 border-galaxy-purple/30"
                >
                  <Clock3 className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
              </div>
            </div>
            <Tabs defaultValue="raffle-prizes" className="mt-6">
              <TabsList className="bg-galaxy-deepPurple/40 border border-galaxy-purple/30">
                <TabsTrigger value="raffle-prizes" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white">
                  <Trophy className="mr-2 h-4 w-4" />
                  Sorteios Ganhos
                </TabsTrigger>
                <TabsTrigger value="lootboxes" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white">
                  <Gift className="mr-2 h-4 w-4" />
                  Prêmios de Missões
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="raffle-prizes" className="mt-6">
                <RaffleWinnersList winners={raffleWinners} loading={loading} />
              </TabsContent>
              
              <TabsContent value="lootboxes" className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
                  </div>
                ) : lootBoxes.length > 0 ? (
                  <LootBoxList lootBoxes={lootBoxes} />
                ) : (
                  <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
                    <CardContent className="pt-6 text-center">
                      <Player
                        src="https://assets2.lottiefiles.com/packages/lf20_jbb5yfim.json"
                        className="w-40 h-40 mx-auto"
                        autoplay
                        loop
                      />
                      <h3 className="text-xl font-medium text-white mt-4">Nenhum Prêmio</h3>
                      <p className="text-gray-400 mt-2">Complete missões especiais para desbloquear prêmios disponibilizados pelos anunciantes!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RewardsPage;
