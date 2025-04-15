
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import DashboardHeader from "@/components/advertiser/DashboardHeader";
import MetricsOverview from "@/components/advertiser/MetricsOverview";
import TopUsers from "@/components/advertiser/TopUsers";
import CampaignsList from "@/components/advertiser/CampaignsList";
import EngagementCharts from "@/components/advertiser/EngagementCharts";
import SubmissionsApproval from "@/components/advertiser/SubmissionsApproval";
import CreditsPurchase from "@/components/advertiser/CreditsPurchase";
import AlertsPanel from "@/components/advertiser/AlertsPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdvertiserDashboard = () => {
  const { userName } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Simulate loading
    const loadTimer = setTimeout(() => {
      setLoading(false);
      
      // Play welcome sound when dashboard loads
      playSound("chime");
      
      // Show low balance alert if less than 500 credits
      const mockCredits = 350;
      if (mockCredits < 500) {
        toast({
          title: "Saldo baixo",
          description: "Seus créditos estão acabando. Considere adquirir mais.",
        });
      }
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, []); // Empty dependency array to run only once

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Play sound on tab change
    playSound("pop");
    
    // Track action in a real app
    console.log(`Tab changed to: ${value}`);
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
        <DashboardHeader userName={userName} />
        
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
            <CreditsPurchase />
            <SubmissionsApproval />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdvertiserDashboard;
