import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface EngagementData {
  name: string
  participacao: number
  conversao: number
}

interface UseEngagementDataProps {
  dateRange?: '7days' | '30days' | '3months' | '6months' | '12months'
}

export function useEngagementData({ dateRange = '30days' }: UseEngagementDataProps = {}) {
  const [engagementData, setEngagementData] = useState<EngagementData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getDateFilter = () => {
    const now = new Date()
    const daysMap = {
      '7days': 7,
      '30days': 30,
      '3months': 90,
      '6months': 180,
      '12months': 365
    }
    
    const days = daysMap[dateRange]
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
    return startDate.toISOString()
  }

  const calculateEngagementScore = (participacao: number, conversao: number): number => {
    if (participacao === 0) return 0
    
    // Fórmula de engajamento: (conversao / participacao) * 100 + (participacao * 0.1)
    // Considera tanto a taxa de conversão quanto o volume de participações
    const conversionRate = (conversao / participacao) * 100
    const volumeBonus = participacao * 0.1
    
    return Math.round(conversionRate + volumeBonus)
  }

  const fetchEngagementData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const startDate = getDateFilter()

      // Buscar submissions das missions do usuário no período especificado
      const { data: submissions, error: submissionsError } = await supabase
        .from('mission_submissions')
        .select(`
          submitted_at,
          status,
          missions!inner(
            created_by,
            title,
            created_at
          )
        `)
        .eq('missions.created_by', user.id)
        .gte('submitted_at', startDate)
        .order('submitted_at', { ascending: true })

      if (submissionsError) {
        console.error('Supabase error:', submissionsError)
        throw submissionsError
      }

      // Agrupar dados por mês
      const groupedData: { [key: string]: { participacao: number; conversao: number } } = {}
      
      submissions?.forEach(submission => {
        const date = new Date(submission.submitted_at!)
        // Usar mês em inglês para consistência
        const monthKey = date.toLocaleDateString('en-US', { 
          month: 'short',
          year: dateRange === '12months' ? '2-digit' : undefined
        }).replace('.', '')
        
        if (!groupedData[monthKey]) {
          groupedData[monthKey] = { participacao: 0, conversao: 0 }
        }
        
        groupedData[monthKey].participacao += 1
        if (submission.status === 'aprovado' || submission.status === 'approved') {
          groupedData[monthKey].conversao += 1
        }
      })

      // Converter para array e ordenar por data
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      
      const engagementDataFormatted = Object.entries(groupedData)
        .map(([name, data]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          participacao: data.participacao,
          conversao: data.conversao
        }))
        .sort((a, b) => {
          const aIndex = monthOrder.findIndex(month => 
            a.name.includes(month)
          )
          const bIndex = monthOrder.findIndex(month => 
            b.name.includes(month)
          )
          return aIndex - bIndex
        })

      // Se não há dados reais, mostrar meses vazios para o período
      if (engagementDataFormatted.length === 0) {
        const emptyMonths = dateRange === '30days' ? ['Últimos 30 dias'] : 
                          dateRange === '7days' ? ['Última semana'] :
                          ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
        
        setEngagementData(emptyMonths.map(month => ({
          name: month,
          participacao: 0,
          conversao: 0
        })))
      } else {
        setEngagementData(engagementDataFormatted)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de engajamento')
      console.error('Error fetching engagement data:', err)
      
      // Fallback para dados vazios em caso de erro
      setEngagementData([
        { name: 'Jan', participacao: 0, conversao: 0 },
        { name: 'Fev', participacao: 0, conversao: 0 },
        { name: 'Mar', participacao: 0, conversao: 0 },
        { name: 'Abr', participacao: 0, conversao: 0 },
        { name: 'Mai', participacao: 0, conversao: 0 },
        { name: 'Jun', participacao: 0, conversao: 0 },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEngagementData()
  }, [dateRange])

  return {
    engagementData,
    isLoading,
    error,
    refetch: fetchEngagementData,
    calculateEngagementScore
  }
} 