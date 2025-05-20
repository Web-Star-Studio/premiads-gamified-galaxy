
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, ZapIcon, LayersIcon, BadgeCheck, Gift, Check } from "lucide-react";
import { Mission } from "@/hooks/missions/types";
import { getMissionDifficulty, getEstimatedTime } from "@/hooks/missions/types";
import { useSounds } from "@/hooks/use-sounds";

interface MissionCardProps {
  mission: Mission;
  isAccepted: boolean;
  onAcceptMission: (missionId: string) => void;
  getMissionTypeLabel: (type: string) => string;
}

const MissionCard = ({ 
  mission,
  isAccepted,
  onAcceptMission,
  getMissionTypeLabel
}: MissionCardProps) => {
  const [isShaking, setIsShaking] = useState(false);
  const { playSound } = useSounds();
  
  // Get difficulty based on points
  const difficulty = getMissionDifficulty({
    points: mission.points,
    type: mission.type,
    requirements: mission.requirements || []
  });
  
  // Get estimated time based on mission type
  const estimatedTime = getEstimatedTime({
    type: mission.type,
    requirements: mission.requirements || []
  });
  
  // Handle accepting a mission
  const handleAccept = useCallback(() => {
    playSound("pop");
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      onAcceptMission(mission.id);
    }, 400);
  }, [mission.id, onAcceptMission, playSound]);
  
  // Determine what icon to show based on mission type
  const getMissionIcon = () => {
    switch (mission.type) {
      case "photo":
        return <LayersIcon className="h-5 w-5 text-neon-cyan" />;
      case "form":
        return <Star className="h-5 w-5 text-neon-pink" />;
      default:
        return <ZapIcon className="h-5 w-5 text-neon-cyan" />;
    }
  };
  
  return (
    <motion.div 
      className={`group relative h-full overflow-hidden rounded-lg border border-galaxy-purple/30 p-4 shadow-lg transition-all duration-300 hover:border-neon-cyan/50 hover:shadow-neon-cyan/20 ${
        isShaking ? "animate-shake" : ""
      }`}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mission Type Badge */}
      <div className="absolute right-0 top-0 rounded-bl-lg bg-gradient-to-r from-galaxy-purple/80 to-galaxy-blue/80 px-3 py-1 text-xs font-medium text-white">
        {getMissionTypeLabel(mission.type)}
      </div>
      
      {/* Mission Title */}
      <h3 className="mt-5 text-lg font-semibold text-white">{mission.title}</h3>
      
      {/* Mission Description */}
      <p className="mt-2 text-sm text-gray-300 line-clamp-2">{mission.description}</p>
      
      {/* Mission Points */}
      <div className="mt-4 flex flex-col items-start sm:flex-row sm:items-center sm:flex-wrap gap-1">
        <div className="flex h-8 items-center rounded-full bg-galaxy-deepPurple/50 px-3 text-sm font-medium text-white flex-shrink-0 min-w-max">
          <Star className="h-4 w-4 text-yellow-400 mr-1" />
          <span className="whitespace-nowrap inline-block">{mission.points} pontos</span>
        </div>
        
        {/* Additional reward indicators */}
        {mission.has_badge && (
          <div className="flex h-8 items-center rounded-full bg-galaxy-deepPurple/50 px-3 text-sm font-medium text-white flex-shrink-0 min-w-max">
            <BadgeCheck className="h-4 w-4 text-neon-cyan mr-1" />
            <span className="whitespace-nowrap inline-block">Badge</span>
          </div>
        )}
        
        {mission.has_lootbox && (
          <div className="flex h-8 items-center rounded-full bg-galaxy-deepPurple/50 px-3 text-sm font-medium text-white flex-shrink-0 min-w-max">
            <Gift className="h-4 w-4 text-neon-pink mr-1" />
            <span className="whitespace-nowrap inline-block">Loot Box</span>
          </div>
        )}
      </div>
      
      {/* Mission details */}
      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div>Dificuldade: {difficulty}</div>
        </div>
        <div>Tempo: {estimatedTime}</div>
      </div>
      
      {/* Action Button */}
      <button
        className={`mt-4 w-full rounded-md py-2 text-sm font-medium transition-all duration-300 ${
          isAccepted
            ? "bg-green-600/20 text-green-400"
            : "bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 text-white hover:from-neon-pink/30 hover:to-neon-cyan/30"
        }`}
        onClick={handleAccept}
        disabled={isAccepted}
      >
        {isAccepted ? (
          <div className="flex items-center justify-center gap-1">
            <Check className="h-4 w-4" />
            <span>Aceita</span>
          </div>
        ) : (
          "Aceitar Missão"
        )}
      </button>
    </motion.div>
  );
};

export default MissionCard;
