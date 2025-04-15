
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Clock, PlayCircle, Timer } from "lucide-react";

const DailyChallenge = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 0,
    seconds: 0
  });
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 1200);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
          
          if (totalSeconds <= 0) {
            clearInterval(interval);
            setIsActive(false);
            toast({
              title: "Desafio concluído!",
              description: "Você completou o desafio diário",
            });
            playSound("reward");
            return { hours: 0, minutes: 0, seconds: 0 };
          }
          
          const hours = Math.floor(totalSeconds / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);
          const seconds = totalSeconds % 60;
          
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, toast, playSound]);
  
  const startChallenge = () => {
    setIsActive(true);
    playSound("pop");
    toast({
      title: "Desafio iniciado!",
      description: "Complete o desafio antes do tempo acabar",
    });
  };
  
  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0');
  };

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Desafio do Dia</h2>
        <Timer className="w-5 h-5 text-neon-pink" />
      </div>
      
      <div className="text-center py-3">
        <h3 className="font-medium mb-2">Quiz Relâmpago</h3>
        <p className="text-sm text-gray-400 mb-4">
          Responda 10 perguntas rápidas sobre nossos produtos
        </p>
        
        <div className="flex justify-center items-center space-x-2 my-4">
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-galaxy-deepPurple/50 rounded-lg">
            <span className="text-xl font-bold">{formatTime(timeLeft.hours)}</span>
            <span className="text-xs text-gray-400">horas</span>
          </div>
          <span className="text-xl font-bold text-neon-cyan">:</span>
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-galaxy-deepPurple/50 rounded-lg">
            <span className="text-xl font-bold">{formatTime(timeLeft.minutes)}</span>
            <span className="text-xs text-gray-400">min</span>
          </div>
          <span className="text-xl font-bold text-neon-cyan">:</span>
          <div className="flex flex-col items-center justify-center w-16 h-16 bg-galaxy-deepPurple/50 rounded-lg">
            <span className="text-xl font-bold">{formatTime(timeLeft.seconds)}</span>
            <span className="text-xs text-gray-400">seg</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1 mb-2">
          <div className="flex items-center text-sm text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>Duração: 3h</span>
          </div>
          <div className="text-sm">
            <span className="font-medium text-neon-pink">250</span>
            <span className="text-gray-400 text-xs ml-1">pontos</span>
          </div>
        </div>
        
        <Button 
          onClick={startChallenge} 
          disabled={isActive}
          className="neon-button mt-2 w-full"
        >
          <PlayCircle className="w-4 h-4 mr-2" />
          {isActive ? "Em andamento" : "Iniciar Desafio"}
        </Button>
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
