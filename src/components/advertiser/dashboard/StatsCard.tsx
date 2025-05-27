import React from 'react'

interface StatsCardProps {
  completionRate: number
  engagementRate: number
  totalParticipants: number
  totalCompleted: number
}

export function StatsCard({ completionRate, engagementRate, totalParticipants, totalCompleted }: StatsCardProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="glass-panel p-4 flex flex-col items-center">
        <span className="text-xs text-gray-400 mb-1">Conclusão</span>
        <span className="text-2xl font-bold text-neon-lime">{completionRate.toFixed(1)}%</span>
      </div>
      <div className="glass-panel p-4 flex flex-col items-center">
        <span className="text-xs text-gray-400 mb-1">Engajamento</span>
        <span className="text-2xl font-bold text-neon-cyan">{engagementRate.toFixed(1)}%</span>
      </div>
      <div className="glass-panel p-4 flex flex-col items-center">
        <span className="text-xs text-gray-400 mb-1">Participantes</span>
        <span className="text-2xl font-bold">{totalParticipants}</span>
      </div>
      <div className="glass-panel p-4 flex flex-col items-center">
        <span className="text-xs text-gray-400 mb-1">Concluíram</span>
        <span className="text-2xl font-bold text-neon-lime">{totalCompleted}</span>
      </div>
    </div>
  )
}

export type { StatsCardProps } 