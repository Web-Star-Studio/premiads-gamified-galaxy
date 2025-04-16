
import React, { useEffect, useState } from "react";
import { Helmet } from 'react-helmet-async';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import { CreditsPurchase } from "@/components/advertiser/credits";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

const CreditsPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userName } = useUser();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserCredits = async () => {
      setLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (userId) {
          const { data, error } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();
          
          if (error) throw error;
          if (data) {
            setCredits(data.credits || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserCredits();
  }, []);

  return (
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
            <div className="max-w-2xl mx-auto">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-galaxy-deepPurple/40 rounded-lg w-3/4"></div>
                  <div className="h-80 bg-galaxy-deepPurple/30 rounded-lg"></div>
                </div>
              ) : (
                <CreditsPurchase currentCredits={credits} />
              )}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default CreditsPage;
