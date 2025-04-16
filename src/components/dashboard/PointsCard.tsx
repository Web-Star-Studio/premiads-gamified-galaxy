
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useSounds } from "@/hooks/use-sounds";
import { useEffect } from "react";
import { Award, TrendingUp, Wallet } from "lucide-react";
import { useUserLevel } from "@/hooks/useUserLevel";
import { getMoneyValue } from "@/utils/formatCurrency";

interface PointsCardProps {
  points: number;
  credits?: number;
  level?: number; // Keep for backward compatibility
  progress?: number; // Keep for backward compatibility
}

const PointsCard = ({ points, credits }: PointsCardProps) => {
  const { playSound } = useSounds();
  const { levelInfo, loading } = useUserLevel(points);
  
  // If credits are not provided, assume they equal points (1:1 conversion)
  const effectiveCredits = credits !== undefined ? credits : points;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 300);
    
    return () => clearTimeout(timer);
  }, [playSound]);

  return (
    <motion.div
      className="glass-panel p-6 overflow-hidden relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-purple-glow opacity-20 -z-10 animate-float"></div>
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Seu Progresso</h2>
        <TrendingUp className="w-5 h-5 text-neon-cyan" />
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm text-gray-400">Saldo atual</div>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-white">{points}</span>
            <span className="ml-1 text-sm text-neon-cyan">pontos</span>
          </div>
          <div className="flex items-baseline mt-1">
            <Wallet className="w-3 h-3 text-neon-pink mr-1" />
            <span className="text-sm text-gray-400">
              {effectiveCredits} créditos • {getMoneyValue(effectiveCredits)}
            </span>
          </div>
        </div>
        
        {!loading && levelInfo && (
          <motion.div 
            className="flex items-center gap-2 px-3 py-1 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              backgroundColor: `${levelInfo.currentLevel.color}30`,
              borderColor: levelInfo.currentLevel.color,
              borderWidth: '1px'
            }}
          >
            <Award className="w-4 h-4" style={{ color: levelInfo.currentLevel.color }} />
            <span className="text-sm font-semibold" style={{ color: levelInfo.currentLevel.color }}>
              {levelInfo.currentLevel.name}
            </span>
          </motion.div>
        )}
      </div>
      
      <div className="mt-4">
        {!loading && levelInfo && levelInfo.nextLevel && (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">
                Progresso para {levelInfo.nextLevel.name}
              </span>
              <span className="text-xs font-medium text-neon-cyan">{levelInfo.progress}%</span>
            </div>
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Progress 
                value={levelInfo.progress} 
                className="h-2 bg-galaxy-deepPurple/50" 
                indicatorClassName="bg-gradient-to-r from-[#8A2387] via-[#E94057] to-[#F27121]"
              />
            </motion.div>
            
            <div className="flex justify-between mt-3">
              <span className="text-xs text-gray-500">{levelInfo.currentLevel.name}</span>
              <span className="text-xs text-gray-500">{levelInfo.nextLevel.name}</span>
            </div>
          </>
        )}
        
        {!loading && levelInfo && !levelInfo.nextLevel && (
          <div className="mt-2 text-center py-2 px-3 bg-galaxy-deepPurple/50 rounded-md border border-neon-pink/30">
            <span className="text-sm text-neon-pink">Nível máximo atingido!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PointsCard;
