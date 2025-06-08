
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, CheckCircle } from "lucide-react";

const DailyChallenge = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [progress, setProgress] = useState(65);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("5h 23m");

  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 600);
    
    return () => clearTimeout(timer);
  }, [playSound]);

  const completeChallenge = () => {
    if (isCompleted) return;
    
    setProgress(100);
    setIsCompleted(true);
    playSound("reward");
    
    toast({
      title: "Desafio concluído!",
      description: "Você ganhou 250 tickets extras!",
    });
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
        <Trophy className="w-5 h-5 text-neon-lime" />
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-white mb-2">Quiz Relâmpago</h3>
          <p className="text-sm text-gray-400">
            Responda 10 perguntas rápidas sobre nossos produtos
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progresso</span>
          <span className="text-neon-cyan">{progress}%</span>
        </div>
        
        <Progress value={progress} className="h-2" />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Duração: 3h</span>
          </div>
          <span className="text-sm font-medium text-neon-pink">250 tickets</span>
        </div>
        
        <Button 
          onClick={completeChallenge} 
          disabled={isCompleted}
          className={`w-full ${isCompleted ? 'bg-green-600' : 'neon-button'}`}
        >
          {isCompleted ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>Desafio Concluído</span>
            </div>
          ) : (
            "Iniciar Desafio"
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
