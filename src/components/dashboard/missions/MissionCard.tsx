import React from "react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/hooks/use-sounds";
import { Mission } from "@/hooks/useMissionsTypes";
import { getMissionDifficulty, getEstimatedTime } from "@/hooks/useMissionsTypes";
import MissionTypeIcon from "@/components/missions/MissionTypeIcon";

interface MissionCardProps {
  mission: Mission;
  onClick?: (mission: Mission) => void;
}

const MissionCard = ({ mission, onClick }: MissionCardProps) => {
  const { playSound } = useSounds();
  const difficulty = getMissionDifficulty({
    tickets_reward: mission.tickets_reward,
    type: mission.type,
    requirements: mission.requirements
  });
  const estimatedTime = getEstimatedTime(mission);

  const handleClick = () => {
    playSound("pop");
    onClick?.(mission);
  };

  return (
    <motion.div
      className="glass-panel p-4 cursor-pointer hover:border-neon-cyan/40 transition-all duration-300"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <MissionTypeIcon type={mission.type} />
          <div>
            <h3 className="font-semibold text-white">{mission.title}</h3>
            <p className="text-xs text-gray-400">{mission.brand || "PremiAds"}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            <Award className="w-3 h-3" />
            <span>{mission.rifas || mission.tickets_reward || 0} rifas</span>
          </Badge>
          
          {mission.has_badge && (
            <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink border-neon-pink/30">
              Badge
            </Badge>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-300 line-clamp-2">{mission.description}</p>

      <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
        <span>Dificuldade: {difficulty}</span>
        <span>Tempo estimado: {estimatedTime}</span>
      </div>
    </motion.div>
  );
};

export default MissionCard;
