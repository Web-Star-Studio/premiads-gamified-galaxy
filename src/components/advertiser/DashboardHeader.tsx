import React from "react";
import { motion } from "framer-motion";
import { Bell, Wallet, Star, Info, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getMoneyValue } from "@/utils/formatCurrency";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  credits?: number;
  isPremium?: boolean;
}

const DashboardHeader = () => {
  const { user } = useUser();
  const { availableCredits: rifas, isLoading } = useUserCredits();
  const navigate = useNavigate();

  const handleCreditsPurchase = () => {
    navigate("/anunciante/creditos");
  };

  return (
    <div className="bg-galaxy-dark border-b border-galaxy-purple/30 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {user?.name || 'Anunciante'}!
          </h1>
          <p className="text-gray-400">Bem-vindo ao seu Dashboard de Anunciante</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-bold text-white">
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  `${rifas} Rifas`
                )}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="cursor-help">
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3 max-w-xs">
                  <div className="space-y-1 text-xs">
                    <p className="font-medium text-sm">Conversão de valores</p>
                    <p>100 rifas = R$5,00</p>
                    <p>Cada rifa vale R$0,05</p>
                    <p className="text-gray-400 mt-1">Rifas usadas para campanhas e promoções</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          <Button
            onClick={handleCreditsPurchase}
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Comprar Rifas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
