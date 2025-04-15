
import React, { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import CampaignsList from "@/components/advertiser/CampaignsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import { useNavigate } from "react-router-dom";
import { BarChart3, LineChart, PieChart, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

const AdvertiserCampaigns = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };

  // Campaign stats summary
  const stats = [
    { 
      title: "Campanhas Ativas", 
      value: "4", 
      description: "campanhas em andamento", 
      icon: <TrendingUp className="h-4 w-4 text-green-400" /> 
    },
    { 
      title: "Total de Missões", 
      value: "510", 
      description: "completadas neste mês", 
      icon: <BarChart3 className="h-4 w-4 text-blue-400" /> 
    },
    { 
      title: "Taxa de Conclusão", 
      value: "78%", 
      description: "média das campanhas", 
      icon: <PieChart className="h-4 w-4 text-purple-400" /> 
    },
    { 
      title: "Usuários Engajados", 
      value: "286", 
      description: "pessoas participantes", 
      icon: <Users className="h-4 w-4 text-pink-400" /> 
    },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold">Gerenciamento de Campanhas</h1>
              <p className="text-muted-foreground">Crie e gerencie suas campanhas publicitárias</p>
            </div>
            
            {/* Stats overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
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
              className="mb-6"
            >
              <TabsList className="grid w-full max-w-md grid-cols-3">
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
              
              <TabsContent value="active" className="mt-4">
                <CampaignsList initialFilter="ativa" />
              </TabsContent>
              
              <TabsContent value="pending" className="mt-4">
                <CampaignsList initialFilter="pendente" />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-4">
                <CampaignsList initialFilter="encerrada" />
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdvertiserCampaigns;
