import React from 'react'

interface Participant {
  name: string
  email: string
  status: 'completed' | 'started' | 'abandoned'
  startedAt: string
  completedAt?: string
}

interface ParticipationTableProps {
  participants: Participant[]
}

export function ParticipationTable({ participants }: ParticipationTableProps) {
  return (
    <div className="glass-panel p-6 mb-6 overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">Participantes</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400">
            <th className="py-2 px-2">Nome</th>
            <th className="py-2 px-2">Email</th>
            <th className="py-2 px-2">Status</th>
            <th className="py-2 px-2">Início</th>
            <th className="py-2 px-2">Conclusão</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p, i) => (
            <tr key={i} className="border-b border-gray-700/30 hover:bg-galaxy-deepPurple/10">
              <td className="py-2 px-2 font-medium">{p.name}</td>
              <td className="py-2 px-2">{p.email}</td>
              <td className="py-2 px-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'completed' ? 'bg-neon-lime/20 text-neon-lime' : p.status === 'started' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-amber-400/20 text-amber-400'}`}>{p.status}</span>
              </td>
              <td className="py-2 px-2">{new Date(p.startedAt).toLocaleString('pt-BR')}</td>
              <td className="py-2 px-2">{p.completedAt ? new Date(p.completedAt).toLocaleString('pt-BR') : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type { Participant, ParticipationTableProps } 