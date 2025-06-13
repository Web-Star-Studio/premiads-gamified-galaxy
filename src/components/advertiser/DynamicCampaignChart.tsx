import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { supabase } from '@/integrations/supabase/client'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CampaignData {
  name: string
  submissions: number
  aprovadas: number
  taxa_aprovacao: number
}

function DynamicCampaignChart() {
  const [campaignData, setCampaignData] = useState<CampaignData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444']

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
          status
        `)
        .eq('created_by', user.id)

      if (missionsError) throw missionsError

      // Para cada mission, buscar suas submissions
      const campaignDataFormatted: CampaignData[] = []

      for (const mission of missions || []) {
        const { data: submissions, error: submissionsError } = await supabase
          .from('mission_submissions')
          .select('id, status')
          .eq('mission_id', mission.id)

        if (submissionsError) {
          console.error('Error fetching submissions for mission', mission.id, submissionsError)
          continue
        }

        const totalSubmissions = submissions?.length || 0
        const approvedSubmissions = submissions?.filter(s => s.status === 'aprovado').length || 0
        const taxaAprovacao = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions) * 100 : 0

        campaignDataFormatted.push({
          name: mission.title || `Campanha ${mission.id.slice(0, 8)}`,
          submissions: totalSubmissions,
          aprovadas: approvedSubmissions,
          taxa_aprovacao: Math.round(taxaAprovacao)
        })
      }

      setCampaignData(campaignDataFormatted)

      // Se não há dados reais, mostrar dados de exemplo
      if (campaignDataFormatted.length === 0) {
        setCampaignData([
          { name: 'Nenhuma campanha encontrada', submissions: 0, aprovadas: 0, taxa_aprovacao: 0 }
        ])
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      console.error('Error fetching campaign data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Desempenho de Campanhas</CardTitle>
          <CardDescription>Comparativo entre suas campanhas ativas</CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de barras - Submissions */}
              <div className="h-96">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Participações por Campanha</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaignData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
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
                    <Bar dataKey="submissions" fill="#8B5CF6" name="Total de Participações" />
                    <Bar dataKey="aprovadas" fill="#10B981" name="Aprovadas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfico de pizza - Taxa de aprovação */}
              <div className="h-96">
                <h3 className="text-sm font-medium mb-4 text-gray-300">Taxa de Aprovação</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaignData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, taxa_aprovacao }) => `${name}: ${taxa_aprovacao}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="taxa_aprovacao"
                    >
                      {campaignData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F9FAFB' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabela resumo */}
      <Card className="bg-galaxy-darkPurple border-galaxy-purple/30">
        <CardHeader className="px-6">
          <CardTitle>Resumo das Campanhas</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {isLoading ? (
            <Skeleton className="w-full h-32" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-2 text-gray-300">Campanha</th>
                    <th className="text-right p-2 text-gray-300">Participações</th>
                    <th className="text-right p-2 text-gray-300">Aprovadas</th>
                    <th className="text-right p-2 text-gray-300">Taxa</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignData.map((campaign, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="p-2 text-white">{campaign.name}</td>
                      <td className="p-2 text-right text-gray-300">{campaign.submissions}</td>
                      <td className="p-2 text-right text-green-400">{campaign.aprovadas}</td>
                      <td className="p-2 text-right text-blue-400">{campaign.taxa_aprovacao}%</td>
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

export default DynamicCampaignChart 