import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Lock, Unlock, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseClient } from '@/services/supabase'
import { useQueryClient } from '@tanstack/react-query'

interface Participant {
  name: string
  email: string
  status: 'completed' | 'started' | 'abandoned'
  startedAt: string
  completedAt?: string
  missionId?: string
  dataUnlocked?: boolean
}

interface ParticipationTableProps {
  participants: Participant[]
}

export function ParticipationTable({ participants }: ParticipationTableProps) {
  const [unlockingMissions, setUnlockingMissions] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Agrupar participantes por missão para mostrar botão de desbloqueio por campanha
  const participantsByMission = participants.reduce((acc, participant) => {
    if (!participant.missionId) return acc
    
    if (!acc[participant.missionId]) {
      acc[participant.missionId] = []
    }
    acc[participant.missionId].push(participant)
    return acc
  }, {} as Record<string, Participant[]>)

  const handleUnlockData = async (missionId: string) => {
    setUnlockingMissions(prev => new Set([...prev, missionId]))
    
    try {
      const client = await getSupabaseClient()
      
      // Verificar se anunciante tem rifas suficientes
      const { data: advertiserProfile } = await client
        .from('profiles')
        .select('rifas')
        .eq('id', (await client.auth.getUser()).data.user?.id)
        .single()

      if (!advertiserProfile || advertiserProfile.rifas < 2) {
        toast({
          title: 'Rifas insuficientes',
          description: 'Você precisa de 2 rifas para desbloquear os dados desta campanha.',
          variant: 'destructive'
        })
        return
      }

      // Chamar edge function para desbloquear dados
      const { data, error } = await client.functions.invoke('unlock-crm-details', {
        body: { mission_id: missionId }
      })

      if (error) throw error

      toast({
        title: 'Dados desbloqueados!',
        description: `Os dados dos participantes desta campanha foram desbloqueados por 2 rifas.`,
        variant: 'default'
      })

      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['advertiser-crm'] })
      
    } catch (error: any) {
      console.error('Erro ao desbloquear dados:', error)
      toast({
        title: 'Erro ao desbloquear dados',
        description: error.message || 'Ocorreu um erro ao tentar desbloquear os dados.',
        variant: 'destructive'
      })
    } finally {
      setUnlockingMissions(prev => {
        const newSet = new Set(prev)
        newSet.delete(missionId)
        return newSet
      })
    }
  }

  if (participants.length === 0) {
    return (
      <div className="glass-panel p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Participantes</h3>
        <div className="text-center py-8 text-gray-400">
          Nenhum participante encontrado
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 mb-6 overflow-x-auto">
      <h3 className="font-bold text-lg mb-4">Participantes</h3>
      
      {Object.entries(participantsByMission).map(([missionId, missionParticipants]) => {
        const isUnlocked = missionParticipants[0]?.dataUnlocked
        const isUnlocking = unlockingMissions.has(missionId)
        
        return (
          <div key={missionId} className="mb-8">
            <div className="flex items-center justify-between mb-4 p-3 bg-galaxy-deepPurple/30 rounded-lg">
              <div>
                <h4 className="font-medium text-white">
                  Campanha: {missionParticipants.length} participante(s)
                </h4>
                <p className="text-sm text-gray-400">
                  {isUnlocked ? 'Dados desbloqueados' : 'Dados bloqueados'}
                </p>
              </div>
              
              {!isUnlocked && (
                <Button
                  onClick={() => handleUnlockData(missionId)}
                  disabled={isUnlocking}
                  variant="outline"
                  size="sm"
                  className="border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-galaxy-dark"
                >
                  {isUnlocking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Desbloqueando...
                    </>
                  ) : (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Desbloquear por 2 rifas
                    </>
                  )}
                </Button>
              )}
              
              {isUnlocked && (
                <div className="flex items-center text-neon-lime text-sm">
                  <Lock className="mr-2 h-4 w-4" />
                  Desbloqueado
                </div>
              )}
            </div>

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
                {missionParticipants.map((participant, i) => (
                  <tr key={i} className="border-b border-gray-700/30 hover:bg-galaxy-deepPurple/10">
                    <td className="py-2 px-2 font-medium">{participant.name}</td>
                    <td className="py-2 px-2">{participant.email}</td>
                    <td className="py-2 px-2">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        participant.status === 'completed' 
                          ? 'bg-neon-lime/20 text-neon-lime' 
                          : participant.status === 'started' 
                            ? 'bg-neon-cyan/20 text-neon-cyan' 
                            : 'bg-amber-400/20 text-amber-400'
                      }`}>
                        {participant.status}
                      </span>
                    </td>
                    <td className="py-2 px-2">
                      {new Date(participant.startedAt).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2 px-2">
                      {participant.completedAt ? new Date(participant.completedAt).toLocaleString('pt-BR') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

export type { Participant, ParticipationTableProps } 