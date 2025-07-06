import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSounds } from "@/hooks/use-sounds";
import DynamicEngagementCharts from "@/components/advertiser/DynamicEngagementCharts";
import DynamicCampaignChart from "@/components/advertiser/DynamicCampaignChart";
import DynamicAudienceChart from "@/components/advertiser/DynamicAudienceChart";
import DynamicROIChart from "@/components/advertiser/DynamicROIChart";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useAdvertiserCampaignsData } from "@/hooks/advertiser/useAdvertiserCampaignsData";
import { useCampaignExport } from "@/hooks/advertiser/useCampaignExport";

const AnalyticsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { playSound } = useSounds();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState("month");
  const { userName = "Desenvolvedor" } = useUser();

  const { data: campaignData, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useAdvertiserCampaignsData();
  const { exportToCsv } = useCampaignExport();
  
  const refreshData = () => {
    setIsLoading(true);
    playSound("pop");
    refetchCampaigns();
    
    // Simulate loading for other charts if necessary
    setTimeout(() => {
      setIsLoading(false);
      playSound("chime");
    }, 1500);
  };
  
  useEffect(() => {
    // Initial fetch is handled by the hook
  }, []);

  const handleExport = () => {
    exportToCsv(campaignData);
  }
  
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
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">Análises</h1>
                <p className="text-muted-foreground">Monitore o desempenho das suas campanhas</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refreshData}
                  disabled={isLoading || isLoadingCampaigns}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${(isLoading || isLoadingCampaigns) ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExport}
                  disabled={isLoadingCampaigns || !campaignData || campaignData.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
            
            <div className="mb-8">
              <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
                <CardContent className="pt-6 px-6">
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
                <div className="space-y-6 mb-8">
                  <DynamicEngagementCharts showExtended={true} dateRange={dateRange} />
                </div>
              </TabsContent>
              
              <TabsContent value="campaigns">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <DynamicCampaignChart />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="audience">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <DynamicAudienceChart />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="roi">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <DynamicROIChart />
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
