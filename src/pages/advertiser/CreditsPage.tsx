import React from "react";
import { Helmet } from 'react-helmet-async';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useUser } from "@/context/UserContext";
import { CreditsPurchasePage } from "@/features/credits/CreditsPurchasePage";

const CreditsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userName } = useUser();

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Créditos | PremiAds</title>
        <meta name="description" content="Compre e gerencie seus créditos para campanhas publicitárias" />
      </Helmet>
      
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
          <AdvertiserSidebar />
          <SidebarInset className="overflow-y-auto pb-20">
            <AdvertiserHeader 
              title="Gerenciamento de Créditos" 
              description="Compre e gerencie seus créditos para campanhas"
              userName={userName}
            />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <CreditsPurchasePage />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
};

export default CreditsPage;
