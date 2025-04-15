
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Prize } from "./raffleData";
import { formatDate } from "./raffleData";

interface RaffleWheelProps {
  prizes: Prize[];
  drawDate: string;
}

const RaffleWheel = ({ prizes, drawDate }: RaffleWheelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="my-6"
    >
      <div className="bg-galaxy-deepPurple/40 p-6 rounded-lg border border-neon-cyan/30 max-w-md mx-auto">
        <div className="w-64 h-64 mx-auto relative">
          <div className="absolute inset-0 rounded-full border-4 border-neon-pink animate-spin" style={{ animationDuration: '4s' }}></div>
          <div className="absolute inset-8 rounded-full bg-galaxy-deepPurple/70 border border-neon-cyan flex items-center justify-center">
            <div className="text-center">
              <Trophy className="w-12 h-12 text-neon-cyan mx-auto mb-2" />
              <p className="text-neon-lime font-bold">Boa Sorte!</p>
            </div>
          </div>
          
          {prizes.map((prize, index) => {
            const angle = (360 / prizes.length) * index;
            return (
              <div 
                key={prize.id}
                className="absolute w-4 h-4 rounded-full bg-neon-cyan"
                style={{ 
                  transform: `rotate(${angle}deg) translateY(-120px) rotate(-${angle}deg)`,
                  top: '50%',
                  left: '50%',
                }}
              ></div>
            );
          })}
        </div>
        <p className="text-center text-sm text-gray-400 mt-6">
          Esta é apenas uma simulação. O sorteio real acontecerá em {formatDate(drawDate)}.
        </p>
      </div>
    </motion.div>
  );
};

export default RaffleWheel;
