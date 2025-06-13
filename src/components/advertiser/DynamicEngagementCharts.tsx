import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { supabase } from '@/integrations/supabase/client'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface EngagementData {
  name: string
  participacao: number
  conversao: number
}

interface CampaignData {
  name: string
  valor: number
}

interface DynamicEngagementChartsProps {
  showExtended?: boolean
  dateRange?: string
}

function DynamicEngagementCharts({ showExtended = false, dateRange = 'month' }: DynamicEngagementChartsProps) {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([])
  const [campaignData, setCampaignData] = useState<CampaignData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDateFilter = () => {
    const now = new Date()
    let startDate = new Date()

    switch (dateRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    return startDate.toISOString()
  }

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const startDate = getDateFilter()

      // Buscar submissions das missions do usuário
      const { data: submissions, error: submissionsError } = await supabase
        .from('mission_submissions')
        .select(`
          submitted_at,
          status,
          missions!inner(
            created_by,
            title
          )
        `)
        .eq('missions.created_by', user.id)
        .gte('submitted_at', startDate)
        .order('submitted_at', { ascending: true })

      if (submissionsError) throw submissionsError

      // Processar dados de engajamento
      const groupedData: { [key: string]: { participacao: number; conversao: number } } = {}
      
      submissions?.forEach(submission => {
        const date = new Date(submission.submitted_at!)
        const monthKey = date.toLocaleDateString('pt-BR', { 
          month: 'short',
          year: dateRange === 'year' ? '2-digit' : undefined
        })
        
        if (!groupedData[monthKey]) {
          groupedData[monthKey] = { participacao: 0, conversao: 0 }
        }
        
        groupedData[monthKey].participacao += 1
        if (submission.status === 'aprovado') {
          groupedData[monthKey].conversao += 1
        }
      })

      const engagementDataFormatted = Object.entries(groupedData).map(([name, data]) => ({
        name,
        participacao: data.participacao,
        conversao: data.conversao
      }))

      setEngagementData(engagementDataFormatted)

      // Se não há dados reais, mostrar dados de exemplo
      if (engagementDataFormatted.length === 0) {
        setEngagementData([
          { name: 'Jan', participacao: 0, conversao: 0 },
          { name: 'Fev', participacao: 0, conversao: 0 },
          { name: 'Mar', participacao: 0, conversao: 0 },
          { name: 'Abr', participacao: 0, conversao: 0 },
          { name: 'Mai', participacao: 0, conversao: 0 },
          { name: 'Jun', participacao: 0, conversao: 0 },
        ])
      }

      // Buscar dados de campanha se necessário
      if (showExtended) {
        const { data: missions, error: missionsError } = await supabase
          .from('missions')
          .select(`
            id,
            title,
            mission_submissions!inner(
              id,
              status
            )
          `)
          .eq('created_by', user.id)

        if (missionsError) throw missionsError

        const campaignDataFormatted = missions?.map(mission => ({
          name: mission.title || 'Campanha',
          valor: mission.mission_submissions?.length || 0
        })) || []

        setCampaignData(campaignDataFormatted)

        // Se não há dados reais, mostrar dados de exemplo
        if (campaignDataFormatted.length === 0) {
          setCampaignData([
            { name: 'Nenhuma campanha', valor: 0 }
          ])
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados')
      console.error('Error fetching engagement data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [dateRange, showExtended])

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
      <Card className="border-gray-800 bg-gray-900/50">
        <CardHeader>
          <CardTitle className="text-white">Engajamento ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="w-full h-full" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F9FAFB' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="participacao" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Participações"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversao" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Aprovações"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {showExtended && (
        <Card className="border-gray-800 bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Performance por Campanha</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    labelStyle={{ color: '#F9FAFB' }}
                  />
                  <Bar dataKey="valor" fill="#8B5CF6" name="Participações" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DynamicEngagementCharts 