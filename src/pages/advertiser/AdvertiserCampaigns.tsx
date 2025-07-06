import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import CampaignsList from "@/components/advertiser/CampaignsList";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { BarChart3, LineChart, PieChart, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { useAdvertiserCampaigns } from "@/hooks/useAdvertiserCampaigns";
import { useAdvertiserMetrics } from "@/hooks/advertiser/useAdvertiserMetrics";
import { useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const AdvertiserCampaigns = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const [activeTab, setActiveTab] = useState("active");
  const { userName = "Desenvolvedor" } = useUser();
  const { stats: campaignStats } = useAdvertiserCampaigns();
  const { data: metrics, isLoading: metricsLoading } = useAdvertiserMetrics();
  const location = useLocation();
  const { toast } = useToast();

  // Verificar se chegou aqui após criar uma campanha
  useEffect(() => {
    const state = location.state as any;
    if (state?.fromCampaignCreation && state?.campaignCreated) {
      console.log('Usuário redirecionado após criar campanha com sucesso');
      
      // Mostrar toast de confirmação
      toast({
        title: "✅ Redirecionamento realizado!",
        description: "Sua campanha foi criada com sucesso e você foi redirecionado para a página de campanhas.",
        duration: 4000,
      });
      
      playSound('success');
      
      // Limpar o estado para evitar mostrar novamente
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast, playSound]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };

  // Campaign stats mapped from the hook data
  const statCards = [
    {
      title: "Campanhas Ativas",
      value: campaignStats.activeCampaigns.toString(),
      description: "campanhas em andamento",
      icon: <TrendingUp className="h-4 w-4 text-green-400" />,
    },
    {
      title: "Total de Missões",
      value: metrics?.missionsCompleted ?? "0",
      description: "completadas neste mês",
      icon: <BarChart3 className="h-4 w-4 text-blue-400" />,
    },
    {
      title: "Taxa de Conclusão",
      value: metrics?.completionRate ?? "0%",
      description: "média das campanhas",
      icon: <PieChart className="h-4 w-4 text-purple-400" />,
    },
    {
      title: "Usuários Engajados",
      value: metrics?.uniqueUsers ?? "0",
      description: "pessoas participantes",
      icon: <Users className="h-4 w-4 text-pink-400" />,
    },
  ];

  // Map tab values to campaign filter values
  const getFilterValue = (tabValue: string) => {
    switch (tabValue) {
      case "active": return "ativa";
      case "pending": return "pendente";
      case "completed": return "encerrada";
      default: return null;
    }
  };

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Campanhas"
            userName={userName}
            description="Gerencie suas campanhas publicitárias"
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Gerenciamento de Campanhas</h1>
              <p className="text-muted-foreground">Crie e gerencie suas campanhas publicitárias</p>
            </div>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {metricsLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <Card
                      key={index}
                      className="bg-galaxy-darkPurple border-galaxy-purple/30"
                    >
                      <CardContent className="p-4 pt-4">
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <p className="text-sm text-muted-foreground">
                              <Skeleton className="h-4 w-24" />
                            </p>
                            <h3 className="text-2xl font-bold mt-2">
                              <Skeleton className="h-8 w-16" />
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              <Skeleton className="h-3 w-32" />
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                : statCards.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                        <CardContent className="p-4 pt-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.title}</p>
                              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                            </div>
                            <div className="p-2 rounded-full bg-galaxy-purple/20">
                              {stat.icon}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </div>
            
            {/* Tabs for campaign categories */}
            <Tabs 
              defaultValue="active" 
              value={activeTab}
              onValueChange={handleTabChange}
              className="mb-8"
            >
              <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
                <TabsTrigger value="active" className="data-[state=active]:bg-galaxy-purple/20">
                  Ativas
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-galaxy-purple/20">
                  Pendentes
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-galaxy-purple/20">
                  Encerradas
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active">
                <CampaignsList initialFilter={getFilterValue(activeTab)} />
              </TabsContent>
              
              <TabsContent value="pending">
                <CampaignsList initialFilter={getFilterValue(activeTab)} />
              </TabsContent>
              
              <TabsContent value="completed">
                <CampaignsList initialFilter={getFilterValue(activeTab)} />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdvertiserCampaigns;
