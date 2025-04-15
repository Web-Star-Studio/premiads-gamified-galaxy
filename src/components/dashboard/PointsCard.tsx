
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useSounds } from "@/hooks/use-sounds";
import { useEffect } from "react";
import { Award, TrendingUp } from "lucide-react";

interface PointsCardProps {
  points: number;
  level: number;
  progress: number;
}

const PointsCard = ({ points, level, progress }: PointsCardProps) => {
  const { playSound } = useSounds();
  
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
        </div>
        
        <motion.div 
          className="flex items-center gap-2 px-3 py-1 bg-galaxy-deepPurple rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Award className="w-4 h-4 text-neon-pink" />
          <span className="text-sm font-semibold">Nível {level}</span>
        </motion.div>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-400">Progresso para o próximo nível</span>
          <span className="text-xs font-medium text-neon-cyan">{progress}%</span>
        </div>
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100%" }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Progress 
            value={progress} 
            className="h-2 bg-galaxy-deepPurple/50" 
          />
        </motion.div>
      </div>
      
      <div className="flex justify-between mt-3">
        <span className="text-xs text-gray-500">Nível {level}</span>
        <span className="text-xs text-gray-500">Nível {level + 1}</span>
      </div>
    </motion.div>
  );
};

export default PointsCard;
