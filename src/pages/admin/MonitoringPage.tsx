
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";

const MonitoringPage = () => {
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Monitoramento" 
              subtitle="Status e métricas do sistema em tempo real" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-galaxy-deepPurple/10 rounded-lg p-4 border border-galaxy-purple/30">
                  <h3 className="text-lg font-semibold mb-4">Status do Sistema</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Todos os serviços operacionais</span>
                  </div>
                </div>
                
                <div className="bg-galaxy-deepPurple/10 rounded-lg p-4 border border-galaxy-purple/30">
                  <h3 className="text-lg font-semibold mb-4">Desempenho</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>CPU</span>
                      <span>12%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-neon-pink h-2 rounded-full w-[12%]"></div>
                    </div>
                    <div className="flex justify-between">
                      <span>Memória</span>
                      <span>34%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-neon-pink h-2 rounded-full w-[34%]"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-galaxy-deepPurple/10 rounded-lg p-4 border border-galaxy-purple/30 mt-4">
                <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-galaxy-purple/20">
                    <span>Login do usuário #5632</span>
                    <span className="text-sm text-muted-foreground">2 min atrás</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-galaxy-purple/20">
                    <span>Backup automático concluído</span>
                    <span className="text-sm text-muted-foreground">15 min atrás</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-galaxy-purple/20">
                    <span>Atualização de cashback</span>
                    <span className="text-sm text-muted-foreground">32 min atrás</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default MonitoringPage;
