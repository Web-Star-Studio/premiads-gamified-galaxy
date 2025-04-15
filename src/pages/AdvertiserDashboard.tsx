import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import LoadingState from "@/components/advertiser/dashboard/LoadingState";
import NotificationBanner from "@/components/advertiser/dashboard/NotificationBanner";
import DashboardTabs from "@/components/advertiser/dashboard/DashboardTabs";
import { useMediaQuery } from "@/hooks/use-mobile";

const AdvertiserDashboard = () => {
  const { userName, userType } = useUser();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [credits, setCredits] = useState(0);
  const [missionsCount, setMissionsCount] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);

  // Verify user access and fetch data
  useEffect(() => {
    const checkAccess = async () => {
      setLoading(true);
      
      // Redirect if user is not an advertiser
      if (userType !== "anunciante") {
        toast({
          title: "Acesso restrito",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive",
        });
        navigate("/");
        return;
      }
      
      try {
        // Get current user session
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData?.session?.user?.id;
        
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }
        
        // Fetch advertiser credits
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", userId)
          .single();
          
        if (profileError) {
          console.error("Error fetching credits:", profileError);
        } else if (profileData) {
          setCredits(profileData.credits || 0);
          // Store in localStorage for sidebar
          localStorage.setItem("userCredits", (profileData.credits || 0).toString());
        }
        
        // Store user name in localStorage for sidebar
        localStorage.setItem("userName", userName || "Anunciante");
        
        // Fetch missions count
        const { count: missionsCountData, error: missionsError } = await supabase
          .from("missions")
          .select("*", { count: 'exact', head: true })
          .eq("advertiser_id", userId);
          
        if (missionsError) {
          console.error("Error fetching missions count:", missionsError);
        } else {
          setMissionsCount(missionsCountData || 0);
        }
        
        // Fetch pending submissions count
        const { data: missionIds, error: missionIdsError } = await supabase
          .from("missions")
          .select("id")
          .eq("advertiser_id", userId);
        
        if (missionIdsError) {
          console.error("Error fetching mission IDs:", missionIdsError);
        } else if (missionIds && missionIds.length > 0) {
          const ids = missionIds.map(m => m.id);
          
          const { count: submissionsCountData, error: submissionsError } = await supabase
            .from("mission_submissions")
            .select("*", { count: 'exact', head: true })
            .eq("status", "pending")
            .in("mission_id", ids);
            
          if (submissionsError) {
            console.error("Error fetching submissions count:", submissionsError);
          } else {
            setPendingSubmissions(submissionsCountData || 0);
          }
        }
        
        // Check for low credits
        if ((profileData?.credits || 0) < 500) {
          toast({
            title: "Saldo baixo",
            description: "Seus créditos estão acabando. Considere adquirir mais.",
          });
        }
        
        playSound("chime");
      } catch (error: any) {
        console.error("Error loading advertiser dashboard:", error);
        toast({
          title: "Erro ao carregar dados",
          description: error.message || "Ocorreu um erro ao carregar os dados do dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkAccess();
  }, [userType, navigate, toast, playSound, userName]);

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
          <AdvertiserHeader />
          
          <div className="container px-4 pt-20 py-8 mx-auto">
            <DashboardHeader userName={userName} />
            
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
