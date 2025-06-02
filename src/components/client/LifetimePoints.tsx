
import { Trophy, TrendingUp, Award, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useUserLevel } from "@/hooks/useUserLevel";
import { useEffect } from "react";
import { getMoneyValue } from "@/utils/formatCurrency";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LifetimePointsProps {
  totalPoints: number;
  rank: number;
  totalUsers: number;
}

const LifetimePoints = ({ totalPoints, rank, totalUsers }: LifetimePointsProps) => {
  const { playSound } = useSounds();
  const { levelInfo, loading } = useUserLevel(totalPoints);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 500);
    
    return () => clearTimeout(timer);
  }, [playSound]);

  // Calculate percentile ranking
  const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);

  return (
    <motion.div
      className="glass-panel p-6 overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-glow opacity-20 -z-10 animate-float"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Pontos Acumulados</h2>
        <Trophy className="w-5 h-5 text-neon-pink" />
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-baseline cursor-help">
              <span className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</span>
              <span className="ml-1 text-sm text-neon-pink">tickets</span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3">
            <div className="space-y-1 text-xs">
              <p className="font-medium text-sm">Conversão de valores</p>
              <p>{totalPoints.toLocaleString()} tickets = {totalPoints.toLocaleString()} créditos</p>
              <p>Valor estimado: {getMoneyValue(totalPoints)}</p>
              <p className="text-gray-400">10 tickets = R$1,00</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <div className="flex items-center mt-2">
        <Wallet className="w-4 h-4 text-neon-cyan mr-2" />
        <span className="text-sm text-gray-300">
          {totalPoints.toLocaleString()} créditos • {getMoneyValue(totalPoints)}
        </span>
      </div>
      
      {!loading && levelInfo && (
        <div className="flex items-center gap-2 mt-2">
          <Award className="w-4 h-4" style={{ color: levelInfo.currentLevel.color }} />
          <span style={{ color: levelInfo.currentLevel.color }}>
            Nível {levelInfo.currentLevel.name}
          </span>
          {levelInfo.nextLevel && (
            <span className="text-xs text-gray-400">
              ({levelInfo.pointsToNextLevel} tickets para {levelInfo.nextLevel.name})
            </span>
          )}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-galaxy-purple/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Seu ranking</div>
            <div className="text-lg font-medium">{rank}º lugar</div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 bg-galaxy-deepPurple rounded-full"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm">Top {percentile}%</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LifetimePoints;
