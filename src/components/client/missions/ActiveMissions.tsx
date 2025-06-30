
import React from 'react';
import { useMissions } from '@/hooks/useMissions';

const ActiveMissions: React.FC = () => {
  const { missions, loading } = useMissions({ initialFilter: 'in_progress' });

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Missões Ativas</h3>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Suas Missões Ativas</h3>
      {missions.length === 0 ? (
        <p className="text-gray-500">Nenhuma missão ativa no momento.</p>
      ) : (
        <div className="space-y-2">
          {missions.map((mission) => (
            <div key={mission.id} className="p-3 border rounded-lg">
              <h4 className="font-medium">{mission.title}</h4>
              <div className="text-sm text-gray-600 mt-1">
                Em progresso
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActiveMissions;
