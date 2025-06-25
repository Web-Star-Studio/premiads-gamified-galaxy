import React, { useState, useEffect } from 'react'
import { useAdvertiserCrm } from '@/hooks/useAdvertiserCrm'
import { StatsCard } from './StatsCard'
import { DemographicsChart } from './DemographicsChart'
import { ParticipationTable } from './ParticipationTable'
import { CRMFilters } from './CRMFilters'
import { Button } from '@/components/ui/button'
import { Info, Users, BarChart3 } from 'lucide-react'
import { getSupabaseClient } from '@/services/supabase'

export function CrmDashboard({ advertiserId }: { advertiserId: string }) {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [campaigns, setCampaigns] = useState<{ id: string, title: string }[]>([])

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

  const renderInfoPanel = () => {
    return (
      <div className="glass-panel p-4 mb-6 bg-blue-900/20 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <Info size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-400 mb-2">Novo Sistema de Desbloqueio</h3>
            <p className="text-sm text-gray-300 mb-3">
              Agora você tem controle total sobre quais dados demográficos acessar. O sistema mudou de 
              cobrança por campanha para cobrança por participante individual.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-400" />
                <span className="text-gray-300">
                  <strong>Dados gerais:</strong> Sempre visíveis (conclusão, engajamento, total de participantes)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-gray-300">
                  <strong>Dados demográficos:</strong> 2 rifas por participante individual
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">CRM do Anunciante</h1>
      
      {/* Painel informativo sobre o novo sistema */}
      {renderInfoPanel()}
      
      <CRMFilters
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        onCampaignChange={setSelectedCampaign}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => { setStartDate(start); setEndDate(end) }}
      />
      
      {isLoading && <div className="text-center py-12">Carregando...</div>}
      {error && <div className="text-center text-red-500 py-12">Erro ao carregar dados do CRM</div>}
      {data && (
        <>
          {/* Estatísticas gerais - sempre visíveis */}
          <StatsCard {...data.stats} />
          
          {/* Gráficos demográficos agregados - sempre visíveis mas com dados básicos */}
          <DemographicsChart demographics={data.demographics} />
          
          {/* Tabela de participantes com desbloqueio individual */}
          {selectedCampaign ? (
            <ParticipationTable 
              participants={data.participants}
              advertiserId={advertiserId}
              missionId={selectedCampaign}
              showDemographics={true}
            />
          ) : (
            <div className="glass-panel p-8 text-center text-gray-400">
              <Users size={48} className="mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Selecione uma Campanha</h3>
              <p>
                Para visualizar os participantes e seus dados demográficos, 
                selecione uma campanha específica nos filtros acima.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
} 