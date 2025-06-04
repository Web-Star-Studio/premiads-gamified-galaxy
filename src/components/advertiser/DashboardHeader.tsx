import React from "react";
import { motion } from "framer-motion";
import { Bell, Wallet, Star, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMoneyValue } from "@/utils/formatCurrency";

interface DashboardHeaderProps {
  userName: string;
  credits?: number;
  isPremium?: boolean;
}

const DashboardHeader = ({ userName, credits, isPremium = false }: DashboardHeaderProps) => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Olá, <span className="neon-text-pink">{userName}</span>!
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu Dashboard de Anunciante
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-galaxy-deepPurple/50 px-3 py-1.5 rounded-full border border-galaxy-purple/30 cursor-help"
                >
                  <Wallet className="h-4 w-4 text-neon-cyan" />
                  <span className="text-sm font-medium">
                    {credits !== undefined ? `${credits} Rifas` : 'Rifas Disponíveis'}
                  </span>
                  <Info className="h-3 w-3 text-gray-400" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Valor estimado: {credits !== undefined ? getMoneyValue(credits) : 'R$0,00'}</p>
                  <p className="text-xs text-gray-400">100 rifas = R$5,00</p>
                  <p className="text-xs text-gray-400">Cada rifa vale R$0,05</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
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

export default DashboardHeader;
