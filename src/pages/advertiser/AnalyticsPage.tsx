
import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import EngagementCharts from "@/components/advertiser/EngagementCharts";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useUser } from "@/context/UserContext";

const AnalyticsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  const { userName = "Desenvolvedor" } = useUser();
  
  const refreshData = () => {
    setIsLoading(true);
    playSound("pop");
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      playSound("chime");
    }, 1500);
  };
  
  useEffect(() => {
    refreshData();
  }, [dateRange]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };
  
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader
            title="Análises"
            userName={userName}
            description="Monitore o desempenho das suas campanhas"
          />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">Análises</h1>
                <p className="text-muted-foreground">Monitore o desempenho das suas campanhas</p>
              </div>
              
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="pt-6">
                  <Tabs value={dateRange} onValueChange={handleDateRangeChange}>
                    <TabsList>
                      <TabsTrigger value="week">7 dias</TabsTrigger>
                      <TabsTrigger value="month">30 dias</TabsTrigger>
                      <TabsTrigger value="quarter">3 meses</TabsTrigger>
                      <TabsTrigger value="year">12 meses</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                <TabsTrigger value="audience">Audiência</TabsTrigger>
                <TabsTrigger value="roi">ROI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <EngagementCharts showExtended={true} />
                </div>
              </TabsContent>
              
              <TabsContent value="campaigns">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle>Desempenho de Campanhas</CardTitle>
                      <CardDescription>Comparativo entre suas campanhas ativas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        Gráfico de desempenho comparativo de campanhas
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="audience">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle>Análise de Audiência</CardTitle>
                      <CardDescription>Perfil dos usuários que participam das suas campanhas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        Gráficos de demografia e comportamento da audiência
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="roi">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                    <CardHeader>
                      <CardTitle>Retorno sobre Investimento</CardTitle>
                      <CardDescription>Análise de custo-benefício das suas campanhas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 flex items-center justify-center text-muted-foreground">
                        Gráficos de ROI por campanha e por período
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AnalyticsPage;
