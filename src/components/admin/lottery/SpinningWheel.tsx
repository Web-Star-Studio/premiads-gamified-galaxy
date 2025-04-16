
import React, { useState } from 'react';
import { Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Lottery } from './types';
import { useSounds } from '@/hooks/use-sounds';
import { toastSuccess, toastInfo } from '@/utils/toast';

interface SpinningWheelProps {
  selectedLottery: Lottery;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ selectedLottery }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const { playSound } = useSounds();

  const handleSpin = () => {
    try {
      playSound('chime');
    } catch (error) {
      console.log("Error playing sound", error);
    }
    
    setIsSpinning(true);
    
    // Simulate spinning for 3 seconds
    setTimeout(() => {
      setIsSpinning(false);
      
      // Show toast for winning
      if (selectedLottery.prizes.length > 0) {
        // Get a random prize based on probability
        const randomPrize = getRandomPrize(selectedLottery.prizes);
        
        toastSuccess(
          'Prêmio sorteado!',
          `O prêmio "${randomPrize.name}" foi sorteado!`
        );
        
        try {
          playSound('reward');
        } catch (error) {
          console.log("Error playing sound", error);
        }
      } else {
        toastInfo('Sem prêmios', 'Adicione prêmios para poder sortear.');
      }
    }, 3000);
  };
  
  // Function to get a random prize based on probability
  const getRandomPrize = (prizes: Array<{id: number, name: string, probability: number}>) => {
    // Calculate total probability
    const totalProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);
    
    // Generate a random number between 0 and total probability
    let random = Math.random() * totalProbability;
    
    // Find the prize based on probability
    for (const prize of prizes) {
      random -= prize.probability;
      if (random <= 0) {
        return prize;
      }
    }
    
    // Fallback
    return prizes[0];
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center">
        <Award className="h-5 w-5 mr-2 text-neon-pink" />
        Roda de Sorteio
      </h3>
      
      <div className="flex flex-col items-center justify-center p-6 bg-galaxy-dark/50 rounded-md border border-galaxy-purple/20 h-[280px]">
        {selectedLottery.status === 'active' || selectedLottery.status === 'completed' ? (
          <>
            <motion.div
              animate={isSpinning ? { rotate: 1440 } : { rotate: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              className="mb-6"
            >
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-pink via-galaxy-purple to-neon-cyan flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-galaxy-dark flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-neon-lime" />
                </div>
              </div>
            </motion.div>
            
            <Button
              variant="neon"
              disabled={isSpinning || selectedLottery.status === 'completed' || selectedLottery.prizes.length === 0}
              onClick={handleSpin}
              className="w-40"
            >
              {isSpinning ? 'Sorteando...' : 'Sortear Agora'}
            </Button>
            
            {selectedLottery.status === 'completed' && (
              <p className="text-sm text-muted-foreground mt-2">
                Este sorteio já foi finalizado.
              </p>
            )}
          </>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              O sorteio precisa estar ativo para permitir sorteios.
            </p>
            <p className="text-sm text-muted-foreground">
              Status atual: <span className="text-white capitalize">{selectedLottery.status}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinningWheel;
