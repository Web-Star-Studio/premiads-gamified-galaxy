import React from 'react'

interface CRMFiltersProps {
  campaigns: { id: string, title: string }[]
  selectedCampaign?: string
  onCampaignChange: (id: string) => void
  startDate?: string
  endDate?: string
  onDateChange: (start: string, end: string) => void
}

export function CRMFilters({ campaigns, selectedCampaign, onCampaignChange, startDate, endDate, onDateChange }: CRMFiltersProps) {
  return (
    <div className="glass-panel p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Campanha</label>
        <select
          className="bg-galaxy-deepPurple/40 border border-galaxy-purple/30 rounded px-3 py-2 text-sm"
          value={selectedCampaign || ''}
          onChange={e => onCampaignChange(e.target.value)}
        >
          <option value="">Todas</option>
          {campaigns.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Período</label>
        <div className="flex gap-2">
          <input
            type="date"
            className="bg-galaxy-deepPurple/40 border border-galaxy-purple/30 rounded px-3 py-2 text-sm"
            value={startDate || ''}
            onChange={e => onDateChange(e.target.value, endDate || '')}
          />
          <span className="text-gray-400">até</span>
          <input
            type="date"
            className="bg-galaxy-deepPurple/40 border border-galaxy-purple/30 rounded px-3 py-2 text-sm"
            value={endDate || ''}
            onChange={e => onDateChange(startDate || '', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export type { CRMFiltersProps } 