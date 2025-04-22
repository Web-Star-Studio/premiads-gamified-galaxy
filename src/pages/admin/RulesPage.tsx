
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import { useMediaQuery } from "@/hooks/use-mobile";
import RulesConfiguration from "@/components/admin/RulesConfiguration";

const RulesPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Regras do Sistema" 
              subtitle="Gerenciamento das regras e políticas do sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8"
            >
              <RulesConfiguration />
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default RulesPage;
