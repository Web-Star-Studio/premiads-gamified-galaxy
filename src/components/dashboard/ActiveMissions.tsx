
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Hourglass, CheckCircle, Clock, Target } from "lucide-react";

// Mock data for active missions
const ACTIVE_MISSIONS = [
  {
    id: 101,
    title: "Complete o Quiz Semanal",
    totalSteps: 10,
    currentStep: 7,
    reward: 200,
    deadline: "2025-04-20T23:59:59",
    checktickets_reward: [
      { id: 1, name: "Responder parte 1", completed: true },
      { id: 2, name: "Responder parte 2", completed: true },
      { id: 3, name: "Responder desafio final", completed: false },
    ]
  },
  {
    id: 102,
    title: "Visite 3 Lojas Parceiras",
    totalSteps: 3,
    currentStep: 1,
    reward: 120,
    deadline: "2025-04-25T23:59:59",
    checktickets_reward: [
      { id: 1, name: "Visitar loja 1", completed: true },
      { id: 2, name: "Visitar loja 2", completed: false },
      { id: 3, name: "Visitar loja 3", completed: false },
    ]
  }
];

const ActiveMissions = () => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [missions, setMissions] = useState(ACTIVE_MISSIONS);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      playSound("chime");
    }, 900);
    
    return () => clearTimeout(timer);
  }, [playSound]);
  
  const completeCheckpoint = (missionId: number, checkpointId: number) => {
    setMissions(prevMissions => 
      prevMissions.map(mission => {
        if (mission.id === missionId) {
          const updatedChecktickets_reward = mission.checktickets_reward.map(cp => 
            cp.id === checkpointId ? { ...cp, completed: true } : cp
          );
          
          const completedChecktickets_reward = updatedChecktickets_reward.filter(cp => cp.completed).length;
          
          return {
            ...mission,
            checktickets_reward: updatedChecktickets_reward,
            currentStep: completedChecktickets_reward
          };
        }
        return mission;
      })
    );
    
    // Play success sound
    playSound("reward");
    
    // Show success notification
    toast({
      title: "Checkpoint concluído!",
      description: "Continue assim para completar a missão",
    });
    
    // In a real app, we would trigger vibration on mobile
    // if ("vibrate" in navigator) {
    //   navigator.vibrate(200);
    // }
  };
  
  const formatTimeRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff <= 0) return "Expirado";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h`;
    }
    
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Missões em Andamento</h2>
        <Hourglass className="w-5 h-5 text-neon-cyan" />
      </div>
      
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Nenhuma missão em andamento.</p>
          <p className="text-sm text-gray-500 mt-2">Aceite missões recomendadas para começar!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {missions.map((mission) => {
            const progress = Math.round((mission.currentStep / mission.totalSteps) * 100);
            
            return (
              <div key={mission.id} className="bg-galaxy-deepPurple/30 rounded-lg p-4 border border-galaxy-purple/20">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{mission.title}</h3>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>Prazo: {formatTimeRemaining(mission.deadline)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      <span className="font-medium text-neon-cyan">{mission.reward}</span>
                      <span className="text-gray-400 text-xs ml-1">tickets</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {mission.currentStep}/{mission.totalSteps} completados
                    </div>
                  </div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Progress 
                    value={progress} 
                    className="h-2 my-2"
                  />
                </motion.div>
                
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium mb-2">Checktickets_reward:</h4>
                  {mission.checktickets_reward.map((checkpoint) => (
                    <div key={checkpoint.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {checkpoint.completed ? (
                          <CheckCircle className="w-4 h-4 text-neon-lime mr-2" />
                        ) : (
                          <Target className="w-4 h-4 text-gray-400 mr-2" />
                        )}
                        <span className={`text-sm ${checkpoint.completed ? 'line-through text-gray-400' : ''}`}>
                          {checkpoint.name}
                        </span>
                      </div>
                      
                      {!checkpoint.completed && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => completeCheckpoint(mission.id, checkpoint.id)}
                          className="text-xs h-7 px-2 bg-galaxy-deepPurple/50 border-galaxy-purple/30 hover:bg-galaxy-purple/20"
                        >
                          Completar
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default ActiveMissions;
