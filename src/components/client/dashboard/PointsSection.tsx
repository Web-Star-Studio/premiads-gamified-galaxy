
import { motion } from "framer-motion";
import TicketsCard from "@/components/dashboard/TicketsCard";
import UserLevel from "@/components/client/dashboard/UserLevel";
import TicketsButton from "@/components/client/dashboard/TicketsButton";
import { useClientStats } from "@/hooks/useClientStats";
import { useUserLevel } from "@/hooks/useUserLevel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { getMoneyValue } from "@/utils/formatCurrency";

interface PointsSectionProps {
  totalPoints?: number;
}

const PointsSection = ({ totalPoints = 0 }: PointsSectionProps) => {
  const { data: stats, isLoading } = useClientStats();
  const effectivePoints = totalPoints || stats?.rifas || 0;
  const { levelInfo, loading: levelLoading } = useUserLevel(effectivePoints);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-4"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <TicketsCard 
                tickets_reward={effectivePoints}
                isLoading={isLoading}
              />
              <div className="absolute top-3 right-3">
                <Info className="h-4 w-4 text-neon-cyan cursor-help" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3 max-w-xs">
            <div className="space-y-2">
              <p className="text-sm font-medium">Conversão de Pontos e Créditos</p>
              <div className="text-xs space-y-1">
                <p>
                  <span className="text-neon-cyan">{effectivePoints}</span> tickets = <span className="text-neon-pink">{effectivePoints}</span> créditos = {getMoneyValue(effectivePoints)}
                </p>
                <p>• Cada 10 tickets equivalem a R$1,00</p>
                <p>• Pontos são ganhos completando missões</p>
                <p>• Créditos podem ser usados para sorteios</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {!levelLoading && levelInfo && (
        <UserLevel levelInfo={levelInfo} />
      )}
      
      <TicketsButton />
    </motion.div>
  );
};

export default PointsSection;
