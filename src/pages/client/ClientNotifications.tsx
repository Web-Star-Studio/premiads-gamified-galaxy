
import React from 'react';
import { motion } from "framer-motion";
import ClientHeader from "@/components/client/ClientHeader";

const ClientNotifications = () => (
    <div className="min-h-screen bg-galaxy-dark">
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
    </div>
  );

export default ClientNotifications;
