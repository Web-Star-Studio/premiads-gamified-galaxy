import React from 'react'

interface Demographics {
  averageAge: number
  ageDistribution: Record<string, number>
  genderDistribution: Record<string, number>
  regionDistribution: Record<string, number>
  interestsDistribution: Record<string, number>
  incomeRangeDistribution: Record<string, number>
}

interface DemographicsChartProps {
  demographics: Demographics
}

export function DemographicsChart({ demographics }: DemographicsChartProps) {
  // Placeholder: Renderiza listas, pode trocar por gráficos reais depois
  return (
    <div className="glass-panel p-6 mb-6">
      <h3 className="font-bold text-lg mb-4">Demografia dos Concluintes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 text-xs text-gray-400">Idade Média: <span className="text-white font-bold">{demographics.averageAge?.toFixed(1) || '-'}</span></div>
          <div className="mb-2 text-xs text-gray-400">Faixa Etária:</div>
          <ul className="mb-2">
            {Object.entries(demographics.ageDistribution || {}).map(([age, count]) => (
              <li key={age} className="text-sm">{age}: <span className="font-bold">{count}</span></li>
            ))}
          </ul>
          <div className="mb-2 text-xs text-gray-400">Gênero:</div>
          <ul className="mb-2">
            {Object.entries(demographics.genderDistribution || {}).map(([gender, count]) => (
              <li key={gender} className="text-sm">{gender}: <span className="font-bold">{count}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-2 text-xs text-gray-400">Região:</div>
          <ul className="mb-2">
            {Object.entries(demographics.regionDistribution || {}).map(([region, count]) => (
              <li key={region} className="text-sm">{region}: <span className="font-bold">{count}</span></li>
            ))}
          </ul>
          <div className="mb-2 text-xs text-gray-400">Renda:</div>
          <ul className="mb-2">
            {Object.entries(demographics.incomeRangeDistribution || {}).map(([range, count]) => (
              <li key={range} className="text-sm">{range}: <span className="font-bold">{count}</span></li>
            ))}
          </ul>
          <div className="mb-2 text-xs text-gray-400">Interesses:</div>
          <ul>
            {Object.entries(demographics.interestsDistribution || {}).map(([interest, count]) => (
              <li key={interest} className="text-sm">{interest}: <span className="font-bold">{count}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export type { Demographics, DemographicsChartProps } 