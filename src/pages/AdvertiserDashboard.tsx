
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdvertiserSidebar from "@/components/advertiser/dashboard/AdvertiserSidebar";
import AdvertiserHeader from "@/components/advertiser/AdvertiserHeader";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import DashboardOverview from "@/components/advertiser/dashboard/DashboardOverview";
import SubmissionsApproval from "@/components/advertiser/SubmissionsApproval";
import { useMediaQuery } from "@/hooks/use-mobile";

const AdvertiserDashboard = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (userType !== "anunciante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [userType, navigate, toast]);

  if (userType !== "anunciante") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-cyan">Verificando permissões...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdvertiserSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <AdvertiserHeader />
          
          <div className="container px-4 py-8 mx-auto">
            <DashboardOverview />
            
            <div className="mt-8">
              <SubmissionsApproval />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdvertiserDashboard;
