import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, RefreshCw, X } from 'lucide-react';
import { useSounds } from '@/hooks/use-sounds';

interface NumberGeneratorProps {
  min: number;
  max: number;
  onClose: () => void;
  isVisible: boolean;
}

const NumberGenerator: React.FC<NumberGeneratorProps> = ({ min, max, onClose, isVisible }) => {
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const { playSound } = useSounds();
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);
  
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  const startGeneration = () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    setResult(null);
    playSound('pop');
    
    // Fast animation initially
    let speed = 50;
    let duration = 0;
    const maxDuration = 3000; // 3 seconds total animation
    
    const animateNumbers = () => {
      setCurrentNumber(generateRandomNumber());
      duration += speed;
      
      // Gradually slow down the animation
      if (duration > maxDuration * 0.5) {
        speed = 100;
      }
      
      if (duration > maxDuration * 0.7) {
        speed = 200;
      }
      
      if (duration > maxDuration * 0.8) {
        speed = 300;
      }
      
      if (duration > maxDuration * 0.9) {
        speed = 400;
      }
      
      if (duration >= maxDuration) {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
        
        // Set final result
        const finalNumber = generateRandomNumber();
        setCurrentNumber(finalNumber);
        setResult(finalNumber);
        setIsGenerating(false);
        playSound('reward');
      }
    };
    
    // Start animation
    animationRef.current = setInterval(animateNumbers, speed);
  };
  
  const resetGenerator = () => {
    setResult(null);
    setCurrentNumber(null);
    playSound('pop');
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div 
            className="bg-galaxy-deepPurple rounded-xl border border-galaxy-purple/30 p-6 w-full max-w-md shadow-xl"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gerador de Números</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="text-center mb-6">
              <p className="text-gray-300 mb-4">
                Gerando número entre <span className="font-bold">{min}</span> e <span className="font-bold">{max}</span>
              </p>
              
              <div className="bg-black/30 p-8 rounded-lg border border-galaxy-purple/20">
                <AnimatePresence mode="wait">
                  {currentNumber !== null ? (
                    <motion.div
                      key={currentNumber}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`text-5xl font-bold ${result !== null ? 'text-neon-cyan' : 'text-white'}`}
                      transition={{ duration: 0.2 }}
                    >
                      {currentNumber}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      className="text-5xl font-bold text-gray-500"
                    >
                      ?
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {result !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-lg text-neon-pink"
                  >
                    Número sorteado!
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex justify-center space-x-3">
              <Button
                variant="outline"
                onClick={resetGenerator}
                disabled={isGenerating}
                className="border-galaxy-purple/30 bg-galaxy-dark/50 hover:bg-galaxy-purple/20"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reiniciar
              </Button>
              
              <Button
                onClick={startGeneration}
                disabled={isGenerating}
                className="bg-gradient-to-r from-neon-cyan to-neon-pink hover:opacity-90"
              >
                <Play className="mr-2 h-4 w-4" />
                {isGenerating ? "Gerando..." : "Sortear Número"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NumberGenerator; 