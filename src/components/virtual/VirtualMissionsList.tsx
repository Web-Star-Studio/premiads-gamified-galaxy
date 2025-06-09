
import React, { useMemo } from 'react';
import { useVirtualScrolling } from '@/utils/performance';
import { Mission } from '@/hooks/missions/types';
import { Badge } from '@/components/ui/badge';
import { Clock, Award } from 'lucide-react';

interface VirtualMissionsListProps {
  missions: Mission[];
  onMissionClick: (mission: Mission) => void;
  containerHeight?: number;
  itemHeight?: number;
}

const ITEM_HEIGHT = 120;
const CONTAINER_HEIGHT = 400;

const VirtualMissionsList = React.memo<VirtualMissionsListProps>(({
  missions,
  onMissionClick,
  containerHeight = CONTAINER_HEIGHT,
  itemHeight = ITEM_HEIGHT
}) => {
  const {
    items: visibleMissions,
    startIndex,
    totalHeight,
    offsetY,
    onScroll
  } = useVirtualScrolling(missions, itemHeight, containerHeight);

  const missionItems = useMemo(() => 
    visibleMissions.map((mission, index) => (
      <div
        key={mission.id}
        className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20 cursor-pointer transition-all hover:border-neon-cyan/40 mb-3"
        style={{ height: itemHeight - 12 }} // Account for margin
        onClick={() => onMissionClick(mission)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-sm">{mission.title}</h4>
            <p className="text-xs text-gray-400">{mission.brand || "PremiAds"}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs">
              <Award className="w-3 h-3" />
              <span>{mission.tickets_reward} pts</span>
            </Badge>
          </div>
        </div>
        <div className="flex items-center mt-2 text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-1" />
          <span>Disponível</span>
        </div>
      </div>
    )),
    [visibleMissions, itemHeight, onMissionClick]
  );

  if (missions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Nenhuma missão disponível</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-heading mb-4">Missões Disponíveis ({missions.length})</h3>
      
      <div 
        className="relative overflow-auto"
        style={{ height: containerHeight }}
        onScroll={onScroll}
      >
        <div style={{ height: totalHeight }}>
          <div 
            style={{ transform: `translateY(${offsetY}px)` }}
            className="relative"
          >
            {missionItems}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualMissionsList.displayName = 'VirtualMissionsList';

export default VirtualMissionsList;
