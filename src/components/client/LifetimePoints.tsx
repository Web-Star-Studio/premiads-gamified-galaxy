
import { Trophy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useEffect } from "react";

interface LifetimePointsProps {
  totalPoints: number;
  rank: number;
  totalUsers: number;
}

const LifetimePoints = ({ totalPoints, rank, totalUsers }: LifetimePointsProps) => {
  const { playSound } = useSounds();
  
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
      
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</span>
        <span className="ml-1 text-sm text-neon-pink">pontos</span>
      </div>
      
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
