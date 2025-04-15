
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

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadTimer = setTimeout(() => {
      setLoading(false);
      playSound("chime");
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
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-pink border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-pink">Carregando painel master...</h2>
          <LoadingParticles />
        </motion.div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <div className="container px-4 py-8 mx-auto">
            <DashboardHeader title="Painel Master" subtitle="Controle completo do sistema" />
            <div className="mt-8">
              <AdminOverview />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;
