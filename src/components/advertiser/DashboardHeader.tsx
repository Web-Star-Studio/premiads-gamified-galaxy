
import React from "react";
import { motion } from "framer-motion";
import { Bell, Wallet, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  userName: string;
  credits?: number;
  isPremium?: boolean;
}

const DashboardHeader = ({ userName, credits, isPremium = false }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold font-heading">
            Olá, <span className="neon-text-pink">{userName}</span>!
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao seu Dashboard de Anunciante
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-galaxy-deepPurple/50 px-3 py-1.5 rounded-full border border-galaxy-purple/30"
          >
            <Wallet className="h-4 w-4 text-neon-cyan" />
            <span className="text-sm font-medium">
              {credits !== undefined ? `${credits} Créditos` : 'Créditos Disponíveis'}
            </span>
          </motion.div>
          
          {isPremium && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-galaxy-deepPurple/50 px-3 py-1.5 rounded-full border border-galaxy-purple/30"
            >
              <Star className="h-4 w-4 text-neon-pink" />
              <span className="text-sm font-medium">Status Premium</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHeader;
