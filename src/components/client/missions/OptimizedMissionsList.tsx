
import React, { useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Clock, Award, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSounds } from "@/hooks/use-sounds";
import { Mission } from "@/hooks/useMissionsTypes";

interface OptimizedMissionsListProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onMissionClick: (mission: Mission) => void;
  emptyMessage: string;
}

// Memoized mission item component for better performance
const MissionItem = React.memo<{
  mission: Mission;
  isSelected: boolean;
  onClick: () => void;
}>(({ mission, isSelected, onClick }) => {
  // Memoize deadline formatting
  const formattedDeadline = useMemo(() => {
    if (!mission.deadline) return "Sem prazo";
    const date = new Date(mission.deadline);
    return date.toLocaleDateString('pt-BR');
  }, [mission.deadline]);

  return (
    <div 
      className={`bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20 cursor-pointer transition-all hover:border-neon-cyan/40 ${isSelected ? 'border-neon-cyan' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{mission.title}</h4>
          <p className="text-sm text-gray-400">{mission.brand || "PremiAds"}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge 
            variant="secondary" 
            className="flex items-center gap-1"
          >
            <Award className="w-3 h-3" />
            <span>{mission.tickets_reward || mission.rifas} pts</span>
          </Badge>
          
          {mission.has_badge && (
            <Badge variant="outline" className="text-xs bg-neon-pink/20 text-neon-pink border-neon-pink/30 flex items-center gap-1">
              <BadgeIcon className="w-3 h-3" />
              <span>Badge</span>
            </Badge>
          )}
        </div>
      </div>
      <div className="flex items-center mt-2 text-xs text-gray-400">
        <Clock className="w-3 h-3 mr-1" />
        <span>Prazo: {formattedDeadline}</span>
      </div>
    </div>
  );
});

MissionItem.displayName = 'MissionItem';

const OptimizedMissionsList = React.memo<OptimizedMissionsListProps>(({ 
  missions, 
  selectedMission, 
  onMissionClick, 
  emptyMessage 
}) => {
  const { playSound } = useSounds();

  // Memoize click handler to prevent unnecessary re-renders
  const handleMissionClick = useCallback((mission: Mission) => {
    onMissionClick(mission);
    playSound("pop");
  }, [onMissionClick, playSound]);

  // Memoize rendered mission items
  const missionItems = useMemo(() => 
    missions.map(mission => (
      <MissionItem
        key={mission.id}
        mission={mission}
        isSelected={selectedMission?.id === mission.id}
        onClick={() => handleMissionClick(mission)}
      />
    )), 
    [missions, selectedMission?.id, handleMissionClick]
  );

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-heading mb-4">Missões Disponíveis</h3>
      
      {missions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {missionItems}
        </div>
      )}
    </div>
  );
});

OptimizedMissionsList.displayName = 'OptimizedMissionsList';

export default OptimizedMissionsList;
