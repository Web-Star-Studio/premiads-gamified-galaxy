
import { motion } from "framer-motion";
import PointsCard from "@/components/dashboard/PointsCard";
import UserLevel from "@/components/client/dashboard/UserLevel";
import TicketsButton from "@/components/client/dashboard/TicketsButton";
import { useNavigate } from "react-router-dom";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useRealtimePoints } from "@/hooks/useRealtimePoints";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { getMoneyValue } from "@/utils/formatCurrency";
import { Skeleton } from "@/components/ui/skeleton";

interface PointsSectionProps {
  totalPoints?: number;
  userId?: string;
  isAdminView?: boolean;
}

const PointsSection = ({ totalPoints = 0, userId, isAdminView = false }: PointsSectionProps) => {
  const navigate = useNavigate();
  const { points: dashboardPoints, credits, loading: dashboardLoading } = useClientDashboard(navigate);
  const initialPoints = totalPoints || dashboardPoints;
  const { points: realtimePoints, loading: pointsLoading } = useRealtimePoints(initialPoints, userId);
  const { levelInfo, loading: levelLoading } = useUserLevel(realtimePoints);
  
  const isLoading = pointsLoading || dashboardLoading;
  
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
              {isLoading ? (
                <div className="p-6 rounded-lg border border-gray-800 bg-gray-900/60">
                  <Skeleton className="h-8 w-32 mb-3 bg-gray-800" />
                  <Skeleton className="h-12 w-40 bg-gray-800" />
                </div>
              ) : (
                <PointsCard points={realtimePoints} credits={credits} />
              )}
              <div className="absolute top-3 right-3">
                <Info className="h-4 w-4 text-neon-cyan cursor-help" />
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3 max-w-xs">
            <div className="space-y-2">
              <p className="text-sm font-medium">Conversão de Pontos e Créditos</p>
              <div className="text-xs space-y-1">
                <p><span className="text-neon-cyan">{realtimePoints}</span> pontos = <span className="text-neon-pink">{realtimePoints}</span> créditos = {getMoneyValue(realtimePoints)}</p>
                <p>• Cada 10 pontos equivalem a R$1,00</p>
                <p>• Pontos são ganhos completando missões</p>
                <p>• Créditos podem ser usados para sorteios e recursos premium</p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {levelLoading ? (
        <Skeleton className="h-32 w-full bg-gray-800" />
      ) : levelInfo && (
        <UserLevel levelInfo={levelInfo} />
      )}
      
      {!isAdminView && <TicketsButton />}
    </motion.div>
  );
};

export default PointsSection;
