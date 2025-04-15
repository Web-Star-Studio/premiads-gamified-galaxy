import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Lottery } from './types';

interface SpinningWheelProps {
  isSpinning?: boolean;
  onComplete?: () => void;
  selectedLottery?: Lottery;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ 
  isSpinning = false, 
  onComplete,
  selectedLottery
}) => {
  const wheelSegments = [
    { color: 'bg-neon-cyan', value: '100 Pontos' },
    { color: 'bg-neon-pink', value: '50 Pontos' },
    { color: 'bg-neon-lime', value: '200 Pontos' },
    { color: 'bg-amber-400', value: '10 Pontos' },
    { color: 'bg-purple-500', value: '500 Pontos' },
    { color: 'bg-blue-500', value: '75 Pontos' },
    { color: 'bg-red-500', value: '25 Pontos' },
    { color: 'bg-green-500', value: '300 Pontos' },
  ];

  // Animation control
  const spinDuration = 5; // seconds
  const spinRotations = isSpinning ? 5 : 0; // total rotations

  React.useEffect(() => {
    if (isSpinning) {
      const timer = setTimeout(() => {
        onComplete?.();
      }, spinDuration * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, onComplete]);

  return (
    <div className="relative flex justify-center items-center my-8">
      {/* Wheel container */}
      <div className="relative w-64 h-64">
        {/* Spinning wheel */}
        <motion.div 
          className="w-full h-full rounded-full overflow-hidden border-4 border-galaxy-purple relative"
          animate={{ 
            rotate: isSpinning ? 360 * spinRotations : 0 
          }}
          transition={{ 
            duration: spinDuration,
            ease: "easeInOut",
            times: [0, 0.7, 1],
          }}
        >
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-4">
            {wheelSegments.map((segment, i) => (
              <div 
                key={i}
                className={`${segment.color} flex items-center justify-center transform origin-center rotate-${45 * i} opacity-80`}
                style={{ 
                  clipPath: "polygon(50% 50%, 100% 0, 100% 100%)",
                  transform: `rotate(${45 * i}deg)`,
                  transformOrigin: "0 50%",
                  padding: "0 0 0 50%"
                }}
              >
                <span className="text-white text-xs font-semibold ml-8 transform -rotate-45">
                  {segment.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Center of wheel */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-galaxy-dark border-2 border-galaxy-purple flex items-center justify-center z-10">
          <Sparkles className="w-4 h-4 text-neon-pink" />
        </div>
        
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-8 z-10">
          <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-neon-cyan"></div>
        </div>
      </div>
    </div>
  );
};

export default SpinningWheel;
