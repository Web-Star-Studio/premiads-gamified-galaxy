
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import AdminOverview from "@/components/admin/AdminOverview";
import LoadingParticles from "@/components/admin/LoadingParticles";
import { useMediaQuery } from "@/hooks/use-mobile";

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
      
      // Try to play sound, but don't break if it fails
      try {
        playSound("chime");
      } catch (error) {
        console.log("Sound playback failed silently", error);
      }
      
      toast({
        title: "Painel Admin",
        description: "Acesso administrativo concedido.",
      });
    }, 1500);

    return () => clearTimeout(loadTimer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-4 max-w-[90vw]"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-lg sm:text-xl font-heading neon-text-pink truncate">Carregando painel master...</h2>
          <LoadingParticles />
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader title="Painel Master" subtitle="Controle completo do sistema" />
            <div className="mt-6 sm:mt-8">
              <AdminOverview />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
