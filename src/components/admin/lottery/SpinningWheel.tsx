
import React, { useState } from 'react';
import { Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Lottery } from './types';
import { toastInfo } from "@/utils/toast";
import { useSounds } from '@/hooks/use-sounds';

interface SpinningWheelProps {
  selectedLottery: Lottery;
}

const SpinningWheel: React.FC<SpinningWheelProps> = ({ selectedLottery }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const { playSound } = useSounds();
  
  const handleSpin = () => {
    if (isSpinning) return;
    
    // Verificar se há prizes configurados
    if (!selectedLottery.prizes || selectedLottery.prizes.length === 0) {
      toastInfo("Sem prêmios", "Configure prêmios antes de testar a roleta.");
      return;
    }
    
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    setIsSpinning(true);
    
    // Gerar rotação aleatória (3-10 rotações completas)
    const newRotation = rotation + 1080 + Math.floor(Math.random() * 2520);
    setRotation(newRotation);
    
    // Após 3 segundos, terminar animação
    setTimeout(() => {
      setIsSpinning(false);
      
      try {
        playSound('reward');
      } catch (error) {
        console.log("Som não reproduzido", error);
      }
      
      toastInfo("Teste completo", "Em um sorteio real, o prêmio seria entregue ao ganhador!");
    }, 3000);
  };
  
  // Cores para os segmentos da roleta (mais vibrantes para tema espacial)
  const wheelColors = [
    "bg-neon-pink",
    "bg-neon-cyan",
    "bg-neon-lime",
    "bg-neon-orange",
    "bg-galaxy-purple",
    "bg-galaxy-blue",
  ];
  
  // Criar segmentos da roleta (ou usar placeholders se não houver prizes)
  const segments = selectedLottery.prizes && selectedLottery.prizes.length > 0
    ? selectedLottery.prizes
    : [
        { id: 1, name: "Prêmio 1", rarity: "common", probability: 40 },
        { id: 2, name: "Prêmio 2", rarity: "uncommon", probability: 30 },
        { id: 3, name: "Prêmio 3", rarity: "rare", probability: 20 },
        { id: 4, name: "Prêmio 4", rarity: "legendary", probability: 10 },
      ];
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Roleta de Sorteio</h3>
      
      <div className="relative flex flex-col items-center justify-center aspect-square">
        {/* Wheel */}
        <motion.div
          className="w-4/5 aspect-square rounded-full overflow-hidden relative"
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 3,
            ease: [0.32, 0.72, 0.35, 0.94] 
          }}
        >
          {segments.map((segment, index) => {
            // Percentual para o segmento convertido em graus
            const segmentDegrees = 360 * (segment.probability / 100);
            
            // Para posicionar o segmento corretamente
            const cumulativeSegmentsDegrees = segments
              .slice(0, index)
              .reduce((acc, s) => acc + (s.probability / 100) * 360, 0);
            
            return (
              <div
                key={segment.id}
                className={`absolute h-1/2 w-1/2 origin-bottom-right ${wheelColors[index % wheelColors.length]}`}
                style={{
                  transform: `rotate(${cumulativeSegmentsDegrees}deg)`,
                  clipPath: `polygon(0 0, 100% 0, 100% 100%)`,
                  height: '100%',
                  transformOrigin: 'center',
                }}
              >
                <div className="absolute top-5 left-1/2 -translate-x-1/2 rotate-90 text-center w-full text-xs text-white font-medium truncate px-2">
                  {segment.name}
                </div>
              </div>
            );
          })}
        </motion.div>
        
        {/* Center pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-white z-10"></div>
        
        {/* Center logo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-galaxy-dark flex items-center justify-center border-2 border-white">
          <Award className="h-8 w-8 text-neon-lime" />
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button
          onClick={handleSpin}
          disabled={isSpinning || selectedLottery.status === 'completed'}
          className="bg-neon-lime text-black hover:bg-neon-lime/80"
        >
          {isSpinning ? (
            <span className="flex items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
              </motion.div>
              Girando...
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Testar Roleta
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        {(!selectedLottery.prizes || selectedLottery.prizes.length === 0) && "Esta é apenas uma simulação. Configure os prêmios para personalizar a roleta."}
      </p>
    </div>
  );
};

export default SpinningWheel;
