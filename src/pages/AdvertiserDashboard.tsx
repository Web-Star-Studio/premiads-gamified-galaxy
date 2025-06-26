import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import LoadingState from "@/components/advertiser/dashboard/LoadingState";
import NotificationBanner from "@/components/advertiser/dashboard/NotificationBanner";
import MetricsOverview from "@/components/advertiser/MetricsOverview";
import DynamicEngagementChart from "@/components/advertiser/DynamicEngagementChart";
import AlertsPanel from "@/components/advertiser/AlertsPanel";
import DashboardHeader from "@/components/advertiser/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useSounds } from "@/hooks/use-sounds";
import { usePendingSubmissions } from "@/hooks/advertiser";
import { motion } from "framer-motion";

const AdvertiserDashboard = () => {
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(5000);
  const [userName, setUserName] = useState("Desenvolvedor");
  
  // Hook dinâmico para submissões pendentes
  const { 
    data: pendingSubmissions = 0, 
    isLoading: isLoadingSubmissions,
    error: submissionsError 
  } = usePendingSubmissions();

  // Simulated data loading for development
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
      
      // Try to play sound, but don't break if it fails
      try {
        playSound("chime");
      } catch (error) {
        console.log("Sound playback failed silently", error);
      }
    }, 1000);
    
    return () => clearTimeout(loadTimer);
  }, [playSound]);

  // Log de erro das submissões se houver
  useEffect(() => {
    if (submissionsError) {
      console.error("Erro ao carregar submissões pendentes:", submissionsError);
    }
  }, [submissionsError]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader 
            title="Dashboard do Anunciante" 
            userName={userName}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DashboardHeader />
            
            <div className="mt-6">
              <NotificationBanner 
                pendingSubmissions={pendingSubmissions} 
                onViewClick={() => console.log("View pending submissions")} 
              />
            </div>
            
            <div className="mt-8 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 gap-8"
              >
                <div className="flex flex-col gap-8 w-full">
                  <MetricsOverview />
                  <DynamicEngagementChart />
                  <AlertsPanel />
                </div>
              </motion.div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdvertiserDashboard;
