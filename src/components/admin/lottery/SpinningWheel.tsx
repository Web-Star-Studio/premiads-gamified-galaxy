
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lottery } from './LotteryList';
import { useSounds } from '@/hooks/use-sounds';
import { toast } from '@/hooks/use-toast';

interface SpinningWheelProps {
  selectedLottery: Lottery;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ selectedLottery }) => {
  const [previewActive, setPreviewActive] = useState(false);
  const [spinResult, setSpinResult] = useState<any | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSounds();
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-400 text-black';
      case 'uncommon': return 'bg-neon-cyan text-black';
      case 'rare': return 'bg-neon-lime text-black';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-neon-pink text-white';
      default: return 'bg-slate-400 text-black';
    }
  };

  const startPreview = () => {
    setPreviewActive(true);
    playSound('chime');
    
    // Reset any previous result
    setSpinResult(null);
    
    // Start spinning
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 0.2s ease-in-out';
      wheelRef.current.style.transform = 'rotate(0deg)';
      
      setTimeout(() => {
        if (wheelRef.current) {
          // Random number of full rotations plus the position we want
          const randomRotations = 5 + Math.random() * 5; // 5-10 full rotations
          const totalDegrees = randomRotations * 360;
          
          wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
          wheelRef.current.style.transform = `rotate(${totalDegrees}deg)`;
          
          // Determine the prize after spinning
          setTimeout(() => {
            const prizes = selectedLottery.prizes;
            // Weight by probability
            const totalProbability = prizes.reduce((sum: number, prize: any) => sum + prize.probability, 0);
            const random = Math.random() * totalProbability;
            
            let cumulativeProbability = 0;
            let selectedPrize = prizes[0];
            
            for (const prize of prizes) {
              cumulativeProbability += prize.probability;
              if (random <= cumulativeProbability) {
                selectedPrize = prize;
                break;
              }
            }
            
            setSpinResult(selectedPrize);
            playSound('reward');
            
            toast({
              title: "Parabéns!",
              description: `Você ganhou: ${selectedPrize.name}`,
            });
            
            // Reset after animation completes
            setTimeout(() => {
              setPreviewActive(false);
            }, 2000);
            
          }, 4200); // Wait for the spin to finish
        }
      }, 100);
    }
  };

  return (
    <div>
      <h4 className="font-medium mb-3 flex items-center">
        <RotateCw className="h-4 w-4 mr-2 text-neon-lime" />
        Preview da Roleta
      </h4>
      
      <div className="bg-galaxy-dark rounded-md border border-galaxy-purple/30 p-4 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          {/* Spinning wheel */}
          <div 
            ref={wheelRef}
            className="absolute inset-0 rounded-full border-4 border-neon-pink overflow-hidden"
            style={{
              background: `conic-gradient(${
                selectedLottery.prizes.map((prize: any, index: number) => {
                  const startPercent = selectedLottery.prizes
                    .slice(0, index)
                    .reduce((sum: number, p: any) => sum + p.probability, 0);
                  const endPercent = startPercent + prize.probability;
                  const color = prize.rarity === 'common' ? '#94A3B8' :
                              prize.rarity === 'uncommon' ? '#00FFE7' :
                              prize.rarity === 'rare' ? '#b4f10a' :
                              prize.rarity === 'epic' ? '#9b87f5' : '#FF00C8';
                  return `${color} ${startPercent}%, ${color} ${endPercent}%`;
                }).join(', ')
              })`
            }}
          />
          
          {/* Center point */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full z-10" />
          
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
            <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[16px] border-l-transparent border-r-transparent border-b-white mx-auto" />
          </div>
        </div>
        
        {spinResult && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center mb-4"
          >
            <Badge className={`${getRarityColor(spinResult.rarity)} text-lg px-3 py-1`}>
              {spinResult.name}
            </Badge>
          </motion.div>
        )}
        
        <Button
          className="bg-neon-lime text-galaxy-dark hover:bg-neon-lime/80"
          onClick={startPreview}
          disabled={previewActive}
        >
          <Play className="h-4 w-4 mr-1" />
          {previewActive ? 'Girando...' : 'Testar Sorteio'}
        </Button>
      </div>
    </div>
  );
};

export default SpinningWheel;
