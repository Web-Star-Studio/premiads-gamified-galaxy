
import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import LoadingState from "@/components/advertiser/dashboard/LoadingState";
import NotificationBanner from "@/components/advertiser/dashboard/NotificationBanner";
import DashboardTabs from "@/components/advertiser/dashboard/DashboardTabs";
import DashboardHeader from "@/components/advertiser/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useSounds } from "@/hooks/use-sounds";

const AdvertiserDashboard = () => {
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [credits, setCredits] = useState(5000);
  const [pendingSubmissions, setPendingSubmissions] = useState(3);
  const [userName, setUserName] = useState("Desenvolvedor");

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    playSound("pop");
  };

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
          
          <div className="container px-4 py-8 mx-auto">
            <DashboardHeader userName={userName} credits={credits} isPremium={true} />
            
            <NotificationBanner 
              pendingSubmissions={pendingSubmissions} 
              onViewClick={() => setActiveTab("finance")} 
            />
            
            <DashboardTabs 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
              credits={credits} 
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdvertiserDashboard;
