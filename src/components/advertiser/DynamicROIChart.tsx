import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { supabase } from '@/integrations/supabase/client'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

interface ROIData {
  campanha: string
  investimento: number
  engajamento: number
  roi_percentage: number
  submissions_count: number
  aprovadas_count: number
}

interface ROITimeData {
  month: string
  roi_medio: number
  investimento_total: number
  engajamento_total: number
}

function DynamicROIChart() {
  const [roiData, setRoiData] = useState<ROIData[]>([])
  const [roiTimeData, setRoiTimeData] = useState<ROITimeData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      // Buscar missions do anunciante
      const { data: missions, error: missionsError } = await supabase
        .from('missions')
        .select(`
          id,
          title,
          created_at
        `)
        .eq('created_by', user.id)

      if (missionsError) throw missionsError

      const roiDataFormatted: ROIData[] = []
      const monthlyData: Record<string, { investimento: number; engajamento: number; count: number }> = {}

      for (const mission of missions || []) {
        // Buscar submissions para cada mission
        const { data: submissions } = await supabase
          .from('mission_submissions')
          .select('id, status, submitted_at')
          .eq('mission_id', mission.id)

        const totalSubmissions = submissions?.length || 0
        const approvedSubmissions = submissions?.filter(s => s.status === 'aprovado').length || 0

        // Calcular investimento estimado (R$10 por submission aprovada)
        const investimento = approvedSubmissions * 10

        // Calcular engajamento estimado (R$25 por participação)
        const engajamento = totalSubmissions * 25

        // Calcular ROI
        const roiPercentage = investimento > 0 ? ((engajamento - investimento) / investimento) * 100 : 0

        roiDataFormatted.push({
          campanha: mission.title || `Campanha ${mission.id.slice(0, 8)}`,
          investimento,
          engajamento,
          roi_percentage: Math.round(roiPercentage),
          submissions_count: totalSubmissions,
          aprovadas_count: approvedSubmissions
        })

        // Agrupar por mês para análise temporal
        const monthKey = new Date(mission.created_at!).toLocaleDateString('pt-BR', { 
          month: 'short',
          year: '2-digit'
        })

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { investimento: 0, engajamento: 0, count: 0 }
        }

        monthlyData[monthKey].investimento += investimento
        monthlyData[monthKey].engajamento += engajamento
        monthlyData[monthKey].count += 1
      }

      // Converter dados mensais para gráfico temporal
      const roiTimeFormatted = Object.entries(monthlyData).map(([month, data]) => ({
        month,
        roi_medio: data.investimento > 0 ? Math.round(((data.engajamento - data.investimento) / data.investimento) * 100) : 0,
        investimento_total: data.investimento,
        engajamento_total: data.engajamento
      }))

      setRoiData(roiDataFormatted)
      setRoiTimeData(roiTimeFormatted)

      // Se não há dados reais, mostrar dados de exemplo
      if (roiDataFormatted.length === 0) {
        setRoiData([
          { 
            campanha: 'Nenhuma campanha encontrada', 
            investimento: 0, 
            engajamento: 0, 
            roi_percentage: 0,
            submissions_count: 0,
            aprovadas_count: 0
          }
        ])
        setRoiTimeData([
          { month: 'Jan', roi_medio: 0, investimento_total: 0, engajamento_total: 0 }
        ])
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      console.error('Error fetching ROI data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Calcular métricas resumo
  const totalInvestimento = roiData.reduce((sum, item) => sum + item.investimento, 0)
  const totalEngajamento = roiData.reduce((sum, item) => sum + item.engajamento, 0)
  const roiMedio = totalInvestimento > 0 ? ((totalEngajamento - totalInvestimento) / totalInvestimento) * 100 : 0
  const melhorCampanha = roiData.length > 0 ? roiData.reduce((best, current) => 
    current.roi_percentage > best.roi_percentage ? current : best
  ) : null

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">ROI Médio</p>
                <p className={`text-2xl font-bold ${roiMedio >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {roiMedio.toFixed(1)}%
                </p>
              </div>
              {roiMedio >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-400" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-400" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-400">Investimento Total</p>
              <p className="text-2xl font-bold text-blue-400">
                R$ {totalInvestimento.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-400">Engajamento Total</p>
              <p className="text-2xl font-bold text-purple-400">
                R$ {totalEngajamento.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-400">Melhor Campanha</p>
              <p className="text-sm font-bold text-green-400">
                {melhorCampanha ? `${melhorCampanha.campanha.slice(0, 15)}...` : 'N/A'}
              </p>
              <p className="text-xs text-gray-500">
                {melhorCampanha ? `${melhorCampanha.roi_percentage}% ROI` : '0% ROI'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico temporal de ROI */}
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>ROI ao Longo do Tempo</CardTitle>
          <CardDescription>Análise temporal do retorno sobre investimento</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={roiTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                  formatter={(value, name) => [
                    `${value}${name === 'roi_medio' ? '%' : ''}`,
                    name === 'roi_medio' ? 'ROI Médio' : 
                    name === 'investimento_total' ? 'Investimento' : 'Engajamento'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="roi_medio" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="ROI Médio (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de ROI por campanha */}
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>ROI por Campanha</CardTitle>
          <CardDescription>Comparativo de retorno sobre investimento</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="campanha" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Bar 
                  dataKey="roi_percentage" 
                  fill="#8B5CF6"
                  name="ROI (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Tabela detalhada */}
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Análise Detalhada de ROI</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <Skeleton className="w-full h-48" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-3 text-gray-300">Campanha</th>
                    <th className="text-right p-3 text-gray-300">Participações</th>
                    <th className="text-right p-3 text-gray-300">Aprovadas</th>
                    <th className="text-right p-3 text-gray-300">Investimento</th>
                    <th className="text-right p-3 text-gray-300">Engajamento</th>
                    <th className="text-right p-3 text-gray-300">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {roiData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-3 text-white max-w-40 truncate">{item.campanha}</td>
                      <td className="p-3 text-right text-gray-300">{item.submissions_count}</td>
                      <td className="p-3 text-right text-green-400">{item.aprovadas_count}</td>
                      <td className="p-3 text-right text-red-400">R$ {item.investimento}</td>
                      <td className="p-3 text-right text-blue-400">R$ {item.engajamento}</td>
                      <td className={`p-3 text-right font-bold ${item.roi_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {item.roi_percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DynamicROIChart 