import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, TrendingUp, Users, CheckCircle } from "lucide-react"
import { useEngagementData } from '@/hooks/advertiser/useEngagementData'

interface DynamicEngagementChartProps {
  showExtended?: boolean
  dateRange?: '7days' | '30days' | '3months' | '6months' | '12months'
}

/**
 * Componente de gráfico de engajamento dinâmico que substitui o EngagementCharts estático.
 * Busca dados reais das missions e submissions do anunciante.
 * 
 * @param showExtended - Se deve mostrar gráficos estendidos
 * @param dateRange - Período para filtrar os dados
 */
function DynamicEngagementChart({ showExtended = false, dateRange = '30days' }: DynamicEngagementChartProps) {
  const { engagementData, isLoading, error, calculateEngagementScore } = useEngagementData({ dateRange })

  // Calcular métricas de resumo
  const totalParticipacao = engagementData.reduce((sum, item) => sum + item.participacao, 0)
  const totalConversao = engagementData.reduce((sum, item) => sum + item.conversao, 0)
  const taxaConversao = totalParticipacao > 0 ? (totalConversao / totalParticipacao) * 100 : 0
  const engagementScore = calculateEngagementScore(totalParticipacao, totalConversao)

  // Preparar dados para gráfico de barras das campanhas (se showExtended)
  const campanhaData = showExtended ? engagementData.map((item, index) => ({
    name: `${item.name}`,
    valor: item.participacao + item.conversao, // Soma total como valor da campanha
    participacao: item.participacao,
    conversao: item.conversao
  })) : []

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
      {/* Métricas de Resumo */}
      {showExtended && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-4 flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-xs text-gray-400">Total Participações</p>
                <p className="text-xl font-bold text-white">{totalParticipacao}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Aprovações</p>
                <p className="text-xl font-bold text-white">{totalConversao}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400">Taxa de Conversão</p>
                <p className="text-xl font-bold text-white">{taxaConversao.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-800 bg-gray-900/50">
            <CardContent className="p-4 flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Score Engajamento</p>
                <p className="text-xl font-bold text-white">{engagementScore}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico Principal de Engajamento */}
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white">Engajamento ao Longo do Tempo</CardTitle>
          <p className="text-sm text-gray-400">
            Participações e aprovações das suas campanhas
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="w-full h-full bg-gray-800" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                  formatter={(value, name) => [
                    value,
                    name === 'participacao' ? 'Participações' : 'Aprovações'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="participacao" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Participações"
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversao" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Aprovações"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Gráfico Estendido - Performance por Período */}
      {showExtended && (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Performance por Período</CardTitle>
            <p className="text-sm text-gray-400">
              Distribuição de atividade ao longo do tempo
            </p>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full bg-gray-800" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campanhaData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F9FAFB' }}
                    formatter={(value, name) => {
                      if (name === 'valor') return [value, 'Total de Atividade']
                      return [value, name === 'participacao' ? 'Participações' : 'Aprovações']
                    }}
                  />
                  <Bar 
                    dataKey="valor" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mensagem informativa quando não há dados */}
      {!isLoading && totalParticipacao === 0 && (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="h-12 w-12 text-gray-500" />
              <h3 className="text-lg font-medium text-white">Nenhum dado de engajamento ainda</h3>
              <p className="text-sm text-gray-400 max-w-md">
                Seus dados de engajamento aparecerão aqui conforme as pessoas interagirem com suas campanhas.
                Crie suas primeiras missões para começar a ver os resultados!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DynamicEngagementChart 