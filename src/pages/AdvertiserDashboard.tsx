import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { User } from "lucide-react";
import DashboardHeader from "@/components/advertiser/DashboardHeader";
import MetricsOverview from "@/components/advertiser/MetricsOverview";
import TopUsers from "@/components/advertiser/TopUsers";
import CampaignsList from "@/components/advertiser/CampaignsList";
import EngagementCharts from "@/components/advertiser/EngagementCharts";
import SubmissionsApproval from "@/components/advertiser/SubmissionsApproval";
import CreditsPurchase from "@/components/advertiser/CreditsPurchase";
import AlertsPanel from "@/components/advertiser/AlertsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const AdvertiserDashboard = () => {
  const { userName, userType } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [credits, setCredits] = useState(0);
  const [missionsCount, setMissionsCount] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);

  // Verify user access and fetch data
  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      
      // Redirect if user is not an advertiser
      if (userType !== "anunciante") {
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      try {
        // Get current user session
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        
        // Fetch advertiser credits
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching credits:", profileError);
        } else if (profileData) {
          setCredits(profileData.credits || 0);
        }
        
        // Fetch missions count
        const { count: missionsCountData, error: missionsError } = await supabase
          .from("missions")
          .select("*", { count: 'exact', head: true })
          .eq("advertiser_id", userId);
          
        if (missionsError) {
          console.error("Error fetching missions count:", missionsError);
        } else {
          setMissionsCount(missionsCountData || 0);
        }
        
        // Fetch pending submissions count - using a different approach to avoid type issues
        const { data: missionIds, error: missionIdsError } = await supabase
          .from("missions")
          .select("id")
          .eq("advertiser_id", userId);
        
        if (missionIdsError) {
          console.error("Error fetching mission IDs:", missionIdsError);
        } else if (missionIds && missionIds.length > 0) {
          const ids = missionIds.map(m => m.id);
          
          const { count: submissionsCountData, error: submissionsError } = await supabase
            .from("mission_submissions")
            .select("*", { count: 'exact', head: true })
            .eq("status", "pending")
            .in("mission_id", ids);
            
          if (submissionsError) {
            console.error("Error fetching submissions count:", submissionsError);
          } else {
            setPendingSubmissions(submissionsCountData || 0);
          }
        }
        
        // Check for low credits
        if ((profileData?.credits || 0) < 500) {
          toast({
            title: "Saldo baixo",
            description: "Seus créditos estão acabando. Considere adquirir mais.",
          });
        }
        
        playSound("chime");
      } catch (error: any) {
        console.error("Error loading advertiser dashboard:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar os dados do dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [userType, navigate, toast, playSound]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };
  
  const handleProfileClick = () => {
    navigate("/anunciante/perfil");
  };
  
  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-pink">Carregando painel de gestão...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <DashboardHeader userName={userName} />
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-muted-foreground">Créditos disponíveis</p>
              <p className="text-xl font-bold text-neon-pink">{credits.toLocaleString()}</p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0 border border-gray-700">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleProfileClick}>
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {pendingSubmissions > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 border border-amber-500/30 bg-amber-500/10 rounded-md"
          >
            <p className="text-amber-300 flex items-center text-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>
              Você tem {pendingSubmissions} {pendingSubmissions === 1 ? 'submissão' : 'submissões'} pendente{pendingSubmissions === 1 ? '' : 's'} de aprovação.
              <Button 
                variant="link" 
                className="text-amber-300 hover:text-amber-200 p-0 h-auto text-sm ml-2"
                onClick={() => setActiveTab("finance")}
              >
                Ver agora
              </Button>
            </p>
          </motion.div>
        )}
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
          <TabsList className="w-full md:w-auto grid grid-cols-4 md:flex md:gap-4">
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="campaigns">Missões</TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="analytics">Relatórios</TabsTrigger>
            <TabsTrigger className="data-[state=active]:neon-text-pink" value="finance">Finanças</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2"
              >
                <MetricsOverview />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <TopUsers />
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <EngagementCharts />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <AlertsPanel />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="campaigns" className="mt-6">
            <CampaignsList />
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-6">
            <EngagementCharts showExtended={true} />
          </TabsContent>
          
          <TabsContent value="finance" className="mt-6 space-y-6">
            <CreditsPurchase currentCredits={credits} />
            <SubmissionsApproval />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;
