
import { motion } from "framer-motion";
import { SidebarProvider } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PointsSection from "@/components/client/dashboard/PointsSection";
import MissionsSection from "@/components/client/dashboard/MissionsSection";
import SidePanel from "@/components/client/dashboard/SidePanel";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useNavigate } from "react-router-dom";

export const OptimizedDashboard = () => {
  const navigate = useNavigate();
  const { userName, loading } = useClientDashboard(navigate);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-galaxy-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-cyan mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-galaxy-dark">
        <ClientSidebar userName={userName} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardHeader userName={userName} />
            
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Left Column - Points and User Level */}
              <div className="lg:col-span-1">
                <PointsSection />
              </div>
              
              {/* Center Column - Missions */}
              <div className="lg:col-span-2 space-y-6">
                <MissionsSection />
              </div>
            </motion.div>
            
            {/* Bottom Section - Side Panel Components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <SidePanel />
            </motion.div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
