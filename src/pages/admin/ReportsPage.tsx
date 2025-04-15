
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";

const ReportsPage = () => {
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Relatórios" 
              subtitle="Análise de dados e estatísticas do sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <div className="bg-galaxy-deepPurple/10 rounded-lg p-4 border border-galaxy-purple/30">
                <h3 className="text-lg font-semibold mb-4">Análise de Dados</h3>
                <p className="text-muted-foreground">
                  Este módulo permite visualizar relatórios detalhados sobre o desempenho do sistema.
                </p>
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ReportsPage;
