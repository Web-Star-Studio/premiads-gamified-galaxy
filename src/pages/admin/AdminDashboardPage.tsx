
import React from 'react';
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHeader from "@/components/admin/DashboardHeader";
import SystemStatus from "@/components/admin/dashboard/SystemStatus";
import SystemMetrics from "@/components/admin/dashboard/SystemMetrics";
import RecentActivities from "@/components/admin/dashboard/RecentActivities";
import { useMediaQuery } from "@/hooks/use-mobile";

const AdminDashboardPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <AdminSidebar />
        <SidebarInset className="overflow-y-auto pb-20 fancy-scrollbar">
          <div className="container px-4 py-6 sm:py-8 mx-auto max-w-7xl">
            <DashboardHeader 
              title="Dashboard de Administração" 
              subtitle="Visualize métricas e gerencie o sistema" 
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 sm:mt-8 grid gap-6"
            >
              <SystemStatus />
              <SystemMetrics />
              <RecentActivities />
            </motion.div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboardPage;
