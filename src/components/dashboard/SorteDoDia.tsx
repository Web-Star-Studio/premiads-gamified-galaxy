
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { Button } from "@/components/ui/button";
import { Gift, ClockIcon, PackageOpen } from "lucide-react";

interface SorteDoDiaProps {
  count?: number;
}

// Reward types with varying probabilities
const REWARDS = [
  { id: 1, name: "50 Pontos Extras", type: "common", color: "text-blue-400" },
  { id: 2, name: "100 Pontos Extras", type: "uncommon", color: "text-green-400" },
  { id: 3, name: "Badge Exclusivo", type: "rare", color: "text-purple-400" },
  { id: 4, name: "Tema de Dashboard", type: "epic", color: "text-yellow-400" },
  { id: 5, name: "Booster de XP (24h)", type: "legendary", color: "text-red-400" },
];

const SorteDoDia = ({ count = 1 }: SorteDoDiaProps) => {
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [isOpening, setIsOpening] = useState(false);
  const [nextAvailableTime, setNextAvailableTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [rewardAvailable, setRewardAvailable] = useState(false);
  
  // Check if reward is available or calculate time until next reward
  useEffect(() => {
    const checkRewardAvailability = () => {
      const lastClaimedStr = localStorage.getItem("sorteDoDia_lastClaimed");
      
      if (!lastClaimedStr) {
        // First time user, reward is available
        setRewardAvailable(true);
        return;
      }
      
      const lastClaimed = new Date(lastClaimedStr);
      const now = new Date();
      
      // Add 24 hours to last claimed time
      const nextAvailable = new Date(lastClaimed);
      nextAvailable.setHours(nextAvailable.getHours() + 24);
      
      if (now >= nextAvailable) {
        // 24 hours have passed, reward is available
        setRewardAvailable(true);
        setNextAvailableTime(null);
      } else {
        // Reward not available yet, set next available time
        setRewardAvailable(false);
        setNextAvailableTime(nextAvailable);
      }
    };
    
    // Initial check
    checkRewardAvailability();
    
    // Check every minute
    const interval = setInterval(checkRewardAvailability, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Update countdown timer
  useEffect(() => {
    if (!nextAvailableTime) return;
    
    const updateTimeRemaining = () => {
      const now = new Date();
      const diffMs = nextAvailableTime.getTime() - now.getTime();
      
      if (diffMs <= 0) {
        setRewardAvailable(true);
        setTimeRemaining("");
        return;
      }
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    // Initial update
    updateTimeRemaining();
    
    // Update every second
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [nextAvailableTime]);
  
  const openDailyReward = () => {
    if (!rewardAvailable) {
      toast({
        title: "Recompensa indisponível",
        description: `Próxima recompensa disponível em ${timeRemaining}`,
        variant: "destructive",
      });
      playSound("error");
      return;
    }
    
    setIsOpening(true);
    playSound("pop");
    
    // Simulate reward opening animation
    setTimeout(() => {
      const randomReward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      
      playSound("reward");
      toast({
        title: `Recompensa ${randomReward.type.toUpperCase()}!`,
        description: `Você ganhou: ${randomReward.name}`,
      });
      
      // Mark as claimed and set next available time
      const now = new Date();
      localStorage.setItem("sorteDoDia_lastClaimed", now.toString());
      
      const nextAvailable = new Date(now);
      nextAvailable.setHours(nextAvailable.getHours() + 24);
      setNextAvailableTime(nextAvailable);
      setRewardAvailable(false);
      
      setIsOpening(false);
    }, 1500);
  };

  return (
    <motion.div
      className="glass-panel p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-heading">Sorte do Dia</h2>
        <Gift className="w-5 h-5 text-neon-lime" />
      </div>
      
      <div className="text-center py-4">
        <motion.div 
          className="relative w-24 h-24 mx-auto"
          animate={isOpening ? {
            rotateY: [0, 360],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <PackageOpen className="w-full h-full text-neon-pink" />
          {rewardAvailable && (
            <motion.div 
              className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-neon-cyan rounded-full text-galaxy-dark font-bold"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
            >
              1
            </motion.div>
          )}
        </motion.div>
        
        <h3 className="font-medium mt-4 mb-2">
          {rewardAvailable 
            ? "Recompensa disponível!" 
            : "Próxima recompensa em:"}
        </h3>
        
        {!rewardAvailable && timeRemaining && (
          <div className="flex items-center justify-center mb-3">
            <ClockIcon className="w-4 h-4 mr-2 text-neon-cyan" />
            <div className="text-lg font-bold text-neon-cyan">{timeRemaining}</div>
          </div>
        )}
        
        <p className="text-sm text-gray-400 mb-4">
          {rewardAvailable 
            ? "Abra sua recompensa diária e ganhe prêmios exclusivos!" 
            : "Volte mais tarde para receber sua recompensa diária."}
        </p>
        
        <Button 
          onClick={openDailyReward} 
          disabled={!rewardAvailable || isOpening}
          className="neon-button w-full"
        >
          {isOpening ? "Abrindo..." : rewardAvailable ? "Abrir Recompensa" : "Indisponível"}
        </Button>
      </div>
    </motion.div>
  );
};

export default SorteDoDia;
