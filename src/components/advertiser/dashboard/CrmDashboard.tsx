import React, { useState, useEffect } from 'react'
import { useAdvertiserCrm } from '@/hooks/useAdvertiserCrm'
import { useDesbloqueioParticipantes } from '@/hooks/advertiser/useDesbloqueioParticipantes'
import { StatsCard } from './StatsCard'
import { DemographicsChart } from './DemographicsChart'
import { ParticipationTable } from './ParticipationTable'
import { CRMFilters } from './CRMFilters'
import { Button } from '@/components/ui/button'
import { Lock, Unlock } from 'lucide-react'
import { getSupabaseClient } from '@/services/supabase'

export function CrmDashboard({ advertiserId }: { advertiserId: string }) {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [campaigns, setCampaigns] = useState<{ id: string, title: string }[]>([])

  // Hook de desbloqueio (apenas ativo quando há campanha selecionada)
  const { 
    hasUnlocked, 
    canUnlock, 
    unlockData, 
    isUnlocking, 
    rifasBalance, 
    requiredRifas 
  } = useDesbloqueioParticipantes(advertiserId, selectedCampaign)

  useEffect(() => {
    async function fetchCampaigns() {
      const client = await getSupabaseClient()
      const { data, error } = await client
        .from('missions')
        .select('id, title')
        .eq('advertiser_id', advertiserId)
        .order('created_at', { ascending: false })
      if (!error && data) setCampaigns(data)
    }
    if (advertiserId) fetchCampaigns()
  }, [advertiserId])

  const { data, isLoading, error } = useAdvertiserCrm(advertiserId, {
    campaignId: selectedCampaign,
    startDate,
    endDate
  })

  // Renderizar botão de desbloqueio quando necessário
  const renderUnlockButton = () => {
    if (!selectedCampaign) return null
    if (hasUnlocked) return (
      <div className="glass-panel p-4 mb-6 flex items-center gap-3 text-green-400">
        <Unlock size={20} />
        <span>Dados demográficos desbloqueados para esta campanha</span>
      </div>
    )
    
    return (
      <div className="glass-panel p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-yellow-400">
            <Lock size={20} />
            <div>
              <p className="font-medium">Dados demográficos bloqueados</p>
              <p className="text-sm text-gray-400">
                Desbloqueie dados detalhados dos participantes desta campanha
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400 mb-2">
              Seu saldo: {rifasBalance} rifas | Custo: {requiredRifas} rifas
            </p>
            <Button
              onClick={unlockData}
              disabled={!canUnlock || isUnlocking}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isUnlocking ? 'Desbloqueando...' : `Desbloquear (${requiredRifas} rifas)`}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">CRM do Anunciante</h1>
      <CRMFilters
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => { setStartDate(start); setEndDate(end) }}
      />
      
      {/* Botão de desbloqueio quando aplicável */}
      {renderUnlockButton()}
      
      {isLoading && <div className="text-center py-12">Carregando...</div>}
      {error && <div className="text-center text-red-500 py-12">Erro ao carregar dados do CRM</div>}
      {data && (
        <>
          <StatsCard {...data.stats} />
          {/* Mostrar dados demográficos apenas se desbloqueado ou se não há campanha específica */}
          {(!selectedCampaign || hasUnlocked) ? (
            <>
              <DemographicsChart demographics={data.demographics} />
              <ParticipationTable participants={data.participants} />
            </>
          ) : (
            <div className="glass-panel p-8 text-center text-gray-400">
              <Lock size={48} className="mx-auto mb-4 text-yellow-400" />
              <p className="text-lg font-medium mb-2">Dados Demográficos Bloqueados</p>
              <p>Desbloqueie para visualizar informações detalhadas dos participantes desta campanha</p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 