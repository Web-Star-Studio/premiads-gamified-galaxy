import React from 'react';
import { motion } from "framer-motion";
import ClientHeader from "@/components/client/ClientHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useMediaQuery } from "@/hooks/use-mobile";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";

const ClientNotifications = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          <main className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold mb-6">Notificações</h1>
              <div className="bg-galaxy-dark/50 rounded-lg border border-galaxy-purple/30 p-6">
                <p className="text-gray-400">Nenhuma notificação no momento.</p>
              </div>
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientNotifications;
