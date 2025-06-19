import React, { useState } from "react";
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
import { CreditsDebug } from "@/components/credits/credits-debug";
import ErrorBoundary from "@/components/ErrorBoundary";

const AdvertiserCampaigns = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const [activeTab, setActiveTab] = useState("active");
  const { userName = "Desenvolvedor" } = useUser();
  const { stats } = useAdvertiserCampaigns();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };

  // Campaign stats mapped from the hook data
  const statCards = [
    { 
      title: "Campanhas Ativas", 
      value: stats.activeCampaigns.toString(), 
      description: "campanhas em andamento", 
      icon: <TrendingUp className="h-4 w-4 text-green-400" /> 
    },
    { 
      title: "Total de Missões", 
      value: stats.totalCompletions.toString(), 
      description: "completadas neste mês", 
      icon: <BarChart3 className="h-4 w-4 text-blue-400" /> 
    },
    { 
      title: "Taxa de Conclusão", 
      value: `${stats.completionRate}%`, 
      description: "média das campanhas", 
      icon: <PieChart className="h-4 w-4 text-purple-400" /> 
    },
    { 
      title: "Usuários Engajados", 
      value: stats.uniqueUsers.toString(), 
      description: "pessoas participantes", 
      icon: <Users className="h-4 w-4 text-pink-400" /> 
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
            
            {/* Debug component - temporary */}
            <div className="mb-4">
              <ErrorBoundary fallback={<div className="text-red-400 text-xs">Erro no componente de debug</div>}>
                <CreditsDebug />
              </ErrorBoundary>
            </div>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statCards.map((stat, index) => (
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
