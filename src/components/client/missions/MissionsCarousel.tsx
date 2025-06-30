
import React from 'react';
import { Mission } from '@/hooks/missions/types';

interface MissionsCarouselProps {
  missions: Mission[];
  onSelectMission: (mission: Mission) => void;
}

const MissionsCarousel: React.FC<MissionsCarouselProps> = ({ 
  missions, 
  onSelectMission 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Missões em Destaque</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.slice(0, 4).map((mission) => (
          <div 
            key={mission.id}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectMission(mission)}
          >
            <h4 className="font-medium">{mission.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{mission.description}</p>
            <div className="mt-2 text-xs text-blue-600">
              {mission.rifas} rifas • {mission.tickets_reward} tickets
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionsCarousel;
