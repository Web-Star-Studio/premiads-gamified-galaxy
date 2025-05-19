
import { useState, useEffect } from "react";
import { TreasureChest, Award, Gift, Calendar, Clock3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import ClientHeader from "@/components/client/ClientHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@lottiefiles/react-lottie-player";
import BadgeList from "@/components/client/rewards/BadgeList";
import LootBoxList from "@/components/client/rewards/LootBoxList";
import DailyStreaksList from "@/components/client/rewards/DailyStreaksList";

const RewardsPage = () => {
  const [loading, setLoading] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);
  const [lootBoxes, setLootBoxes] = useState<any[]>([]);
  const [dailyStreaks, setDailyStreaks] = useState<any[]>([]);
  const { toast } = useToast();
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const fetchRewards = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Usuário não autenticado");

        // Fetch badges
        const { data: badgesData, error: badgesError } = await supabase
          .from("user_badges")
          .select(`
            id,
            badge_name,
            badge_description,
            badge_image_url,
            earned_at,
            mission_id,
            missions:missions(title)
          `)
          .eq("user_id", user.id)
          .order("earned_at", { ascending: false });

        if (badgesError) throw badgesError;
        setBadges(badgesData || []);

        // Fetch loot boxes
        const { data: lootBoxesData, error: lootBoxesError } = await supabase
          .from("loot_box_rewards")
          .select(`
            id,
            reward_type,
            reward_amount,
            awarded_at,
            mission_id,
            missions:missions(title)
          `)
          .eq("user_id", user.id)
          .order("awarded_at", { ascending: false });

        if (lootBoxesError) throw lootBoxesError;
        setLootBoxes(lootBoxesData || []);

        // Fetch daily streaks
        const { data: streaksData, error: streaksError } = await supabase
          .from("daily_streaks")
          .select(`
            id,
            current_streak,
            max_streak,
            last_completion_date,
            mission_id,
            missions:missions(title, points, streak_multiplier)
          `)
          .eq("user_id", user.id)
          .order("current_streak", { ascending: false });

        if (streaksError) throw streaksError;
        setDailyStreaks(streaksData || []);
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

    fetchRewards();
  }, [toast]);

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
                <p className="text-gray-400 mt-1">Conquistas, caixas de recompensa e sequências diárias</p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <Button variant="outline" className="bg-galaxy-deepPurple/40 border-galaxy-purple/30">
                  <TreasureChest className="mr-2 h-4 w-4" />
                  Centro de Recompensas
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="badges" className="mt-6">
              <TabsList className="bg-galaxy-deepPurple/40 border border-galaxy-purple/30">
                <TabsTrigger value="badges" className="data-[state=active]:bg-neon-pink/20 data-[state=active]:text-white">
                  <Award className="mr-2 h-4 w-4" />
                  Badges
                </TabsTrigger>
                <TabsTrigger value="lootboxes" className="data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-white">
                  <Gift className="mr-2 h-4 w-4" />
                  Loot Boxes
                </TabsTrigger>
                <TabsTrigger value="streaks" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Sequências
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="badges" className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
                  </div>
                ) : badges.length > 0 ? (
                  <BadgeList badges={badges} />
                ) : (
                  <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
                    <CardContent className="pt-6 text-center">
                      <Player
                        src="https://assets3.lottiefiles.com/packages/lf20_wsp1zlt6.json"
                        className="w-40 h-40 mx-auto"
                        autoplay
                        loop
                      />
                      <h3 className="text-xl font-medium text-white mt-4">Sem badges ainda</h3>
                      <p className="text-gray-400 mt-2">Complete missões para ganhar suas primeiras badges!</p>
                    </CardContent>
                  </Card>
                )}
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
                      <h3 className="text-xl font-medium text-white mt-4">Nenhuma Loot Box</h3>
                      <p className="text-gray-400 mt-2">Complete missões especiais para desbloquear loot boxes com recompensas!</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="streaks" className="mt-6">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="w-10 h-10 border-4 border-t-purple-500 border-galaxy-purple rounded-full animate-spin"></div>
                  </div>
                ) : dailyStreaks.length > 0 ? (
                  <DailyStreaksList streaks={dailyStreaks} />
                ) : (
                  <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
                    <CardContent className="pt-6 text-center">
                      <Player
                        src="https://assets10.lottiefiles.com/packages/lf20_ikvz7qhc.json"
                        className="w-40 h-40 mx-auto"
                        autoplay
                        loop
                      />
                      <h3 className="text-xl font-medium text-white mt-4">Nenhuma Sequência Ativa</h3>
                      <p className="text-gray-400 mt-2">Complete missões diárias para iniciar sequências e ganhar bônus extras!</p>
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
