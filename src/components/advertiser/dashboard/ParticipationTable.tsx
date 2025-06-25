import React from 'react'
import { Button } from '@/components/ui/button'
import { Lock, Unlock, User, Mail, Calendar } from 'lucide-react'
import { useDesbloqueioParticipante } from '@/hooks/advertiser/useDesbloqueioParticipantes'

interface Participant {
  id: string
  name: string
  email: string
  status: 'completed' | 'pending' | 'abandoned'
  startedAt: string
  completedAt?: string
  demographics?: {
    age?: number
    gender?: string
    location?: string
    income?: string
  }
}

interface ParticipationTableProps {
  participants: Participant[]
  advertiserId: string
  missionId: string
  showDemographics?: boolean
}

function ParticipantRow({ participant, advertiserId, missionId, showDemographics }: {
  participant: Participant
  advertiserId: string
  missionId: string
  showDemographics?: boolean
}) {
  const {
    canUnlock,
    hasUnlocked,
    unlockData,
    isUnlocking,
    rifasBalance,
    requiredRifas,
    participantDemographics
  } = useDesbloqueioParticipante(advertiserId, participant.id, missionId)

  const renderDemographicsData = () => {
    if (!hasUnlocked) {
      return (
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <Lock size={16} />
            <span className="text-sm">Dados bloqueados</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-400">
              Saldo: {rifasBalance} rifas | Custo: {requiredRifas} rifas
            </span>
            <Button
              onClick={unlockData}
              disabled={!canUnlock || isUnlocking}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isUnlocking ? 'Desbloqueando...' : `Desbloquear (${requiredRifas} rifas)`}
            </Button>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 bg-green-900/20 rounded-lg">
        <div className="flex items-center gap-2 text-green-400 mb-3">
          <Unlock size={16} />
          <span className="text-sm font-medium">Dados desbloqueados</span>
        </div>
        
        {participantDemographics ? (
          <div className="grid grid-cols-1 gap-2 text-sm">
            {participantDemographics.age && (
              <div className="flex justify-between">
                <span className="text-gray-400">Faixa Etária:</span>
                <span className="text-white">{participantDemographics.age}</span>
              </div>
            )}
            {participantDemographics.gender && (
              <div className="flex justify-between">
                <span className="text-gray-400">Gênero:</span>
                <span className="text-white">{participantDemographics.gender}</span>
              </div>
            )}
            {participantDemographics.location && (
              <div className="flex justify-between">
                <span className="text-gray-400">Localização:</span>
                <span className="text-white">{participantDemographics.location}</span>
              </div>
            )}
            {participantDemographics.income && (
              <div className="flex justify-between">
                <span className="text-gray-400">Renda:</span>
                <span className="text-white">{participantDemographics.income}</span>
              </div>
            )}
            {participantDemographics.profession && (
              <div className="flex justify-between">
                <span className="text-gray-400">Profissão:</span>
                <span className="text-white">{participantDemographics.profession}</span>
              </div>
            )}
            {participantDemographics.education && (
              <div className="flex justify-between">
                <span className="text-gray-400">Escolaridade:</span>
                <span className="text-white">{participantDemographics.education}</span>
              </div>
            )}
            {participantDemographics.maritalStatus && (
              <div className="flex justify-between">
                <span className="text-gray-400">Estado Civil:</span>
                <span className="text-white">{participantDemographics.maritalStatus}</span>
              </div>
            )}
            {participantDemographics.interests && participantDemographics.interests.length > 0 && (
              <div className="space-y-1">
                <span className="text-gray-400">Interesses:</span>
                <div className="flex flex-wrap gap-1">
                  {participantDemographics.interests.map((interest, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-xs"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-400">
              Dados demográficos não disponíveis para este participante.
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="glass-panel p-6 hover:bg-white/5 transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dados básicos do participante */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-medium text-white">{participant.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} />
                <span>{participant.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} />
              <span>Iniciado em: {new Date(participant.startedAt).toLocaleDateString('pt-BR')}</span>
            </div>
            {participant.completedAt && (
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar size={14} />
                <span>Concluído em: {new Date(participant.completedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${
                participant.status === 'completed' 
                  ? 'bg-green-900/50 text-green-400'
                  : participant.status === 'pending'
                  ? 'bg-yellow-900/50 text-yellow-400'
                  : 'bg-red-900/50 text-red-400'
              }`}>
                {participant.status === 'completed' ? 'Concluído' : 
                 participant.status === 'pending' ? 'Pendente' : 'Abandonado'}
              </span>
            </div>
          </div>
        </div>

        {/* Dados demográficos com controle de desbloqueio */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-3">Dados Demográficos</h4>
          {renderDemographicsData()}
        </div>
      </div>
    </div>
  )
}

export function ParticipationTable({ participants, advertiserId, missionId, showDemographics = true }: ParticipationTableProps) {
  if (!participants || participants.length === 0) {
    return (
      <div className="glass-panel p-8 text-center">
        <User size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-300 mb-2">Nenhum participante encontrado</h3>
        <p className="text-gray-400">
          Ainda não há participantes nesta campanha ou nos filtros selecionados.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Participantes ({participants.length})
        </h2>
        <div className="text-sm text-gray-400">
          {showDemographics ? 'Desbloqueio individual por participante' : 'Visão geral'}
        </div>
      </div>

      <div className="space-y-4">
        {participants.map((participant) => (
          <ParticipantRow
            key={participant.id}
            participant={participant}
            advertiserId={advertiserId}
            missionId={missionId}
            showDemographics={showDemographics}
          />
        ))}
      </div>

      {participants.length > 0 && showDemographics && (
        <div className="glass-panel p-4 bg-blue-900/20 border border-blue-500/30">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Lock size={16} />
            <span className="font-medium">Sistema de Desbloqueio por Participante</span>
          </div>
          <p className="text-sm text-gray-300">
            Agora você paga 2 rifas por cada participante cujos dados demográficos você deseja visualizar. 
            Isso permite um controle mais granular sobre seus gastos e dados acessados.
          </p>
        </div>
      )}
    </div>
  )
}

export type { Participant, ParticipationTableProps } 