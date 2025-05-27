import React, { useState, useEffect } from 'react'
import { useAdvertiserCrm } from '@/hooks/useAdvertiserCrm'
import { StatsCard } from './StatsCard'
import { DemographicsChart } from './DemographicsChart'
import { ParticipationTable } from './ParticipationTable'
import { CRMFilters } from './CRMFilters'
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
      {isLoading && <div className="text-center py-12">Carregando...</div>}
      {error && <div className="text-center text-red-500 py-12">Erro ao carregar dados do CRM</div>}
      {data && (
        <>
          <StatsCard {...data.stats} />
          <DemographicsChart demographics={data.demographics} />
          <ParticipationTable participants={data.participants} />
        </>
      )}
    </div>
  )
} 