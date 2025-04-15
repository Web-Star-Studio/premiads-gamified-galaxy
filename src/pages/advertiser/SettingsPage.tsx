
import React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";

const SettingsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <h1 className="text-2xl font-bold mb-6">Configurações</h1>
            <p>Ajuste as configurações da sua conta e preferências.</p>
            {/* Settings content will be added here */}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SettingsPage;
