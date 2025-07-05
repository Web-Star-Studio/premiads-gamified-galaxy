import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar
} from "lucide-react"
import { getSupabaseClient } from "@/services/supabase"
import { Campaign } from "./campaignData"

interface CampaignAnalyticsModalProps {
  campaignId: string | null
  isOpen: boolean
  onClose: () => void
}

interface CampaignAnalytics {
  campaign: Campaign | null
  totalSubmissions: number
  approvedSubmissions: number
  pendingSubmissions: number
  rejectedSubmissions: number
  totalParticipants: number
  uniqueParticipants: number
  conversionRate: number
  avgTimeToComplete: number
  rifasDistributed: number
  rifasUsed: number
  rifasUtilizationRate: number
  submissionsByDay: Array<{ date: string; count: number }>
  participantsByAudience: Array<{ audience: string; count: number }>
  topPerformingDays: Array<{ date: string; submissions: number }>
}

function CampaignAnalyticsModal({ campaignId, isOpen, onClose }: CampaignAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!campaignId || !isOpen) return

    async function fetchAnalytics() {
      try {
        setLoading(true)
        setError(null)
        
        const client = await getSupabaseClient()
        
        // MCP Validation - Check if user has access to this campaign
        // Fetch campaign details directly - RLS policies will handle access control
        const { data: campaign, error: campaignError } = await client
          .from('missions')
          .select('*')
          .eq('id', campaignId)
          .single()
        
        if (campaignError) {
          // If we can't access the campaign, it means no permission
          throw new Error('Acesso negado: Você não tem permissão para visualizar analytics desta campanha.')
        }

        // Fetch submission analytics
        const { data: submissions, error: submissionsError } = await client
          .from('mission_submissions')
          .select('status, submitted_at, user_id')
          .eq('mission_id', campaignId)
        
        if (submissionsError) throw submissionsError

        // Fetch rifas transactions
        const { data: rifasTransactions, error: rifasError } = await client
          .from('rifas_transactions')
          .select('transaction_type, amount, created_at')
          .eq('mission_id', campaignId)
        
        if (rifasError) throw rifasError

        // Fetch participations
        const { data: participations, error: participationsError } = await client
          .from('participations')
          .select('status, started_at, completed_at, user_id')
          .eq('campaign_id', campaignId)
        
        if (participationsError) throw participationsError

        // Calculate analytics
        const totalSubmissions = submissions?.length || 0
        const approvedSubmissions = submissions?.filter(s => s.status === 'approved').length || 0
        const pendingSubmissions = submissions?.filter(s => s.status === 'pending').length || 0
        const rejectedSubmissions = submissions?.filter(s => s.status === 'rejected').length || 0
        
        const uniqueParticipants = new Set(submissions?.map(s => s.user_id)).size
        const totalParticipants = participations?.length || 0
        
        const conversionRate = totalParticipants > 0 ? (approvedSubmissions / totalParticipants) * 100 : 0
        
        // Calculate average time to complete
        const completedParticipations = participations?.filter(p => p.completed_at) || []
        const avgTimeToComplete = completedParticipations.length > 0 
          ? completedParticipations.reduce((acc, p) => {
              const start = new Date(p.started_at).getTime()
              const end = new Date(p.completed_at!).getTime()
              return acc + (end - start)
            }, 0) / completedParticipations.length / (1000 * 60 * 60) // Convert to hours
          : 0
        
        // Calculate rifas analytics
        const rifasEarned = rifasTransactions?.filter(t => t.transaction_type === 'earned') || []
        const rifasSpent = rifasTransactions?.filter(t => t.transaction_type === 'spent') || []
        
        const rifasDistributed = rifasEarned.reduce((acc, t) => acc + t.amount, 0)
        const rifasUsed = rifasSpent.reduce((acc, t) => acc + t.amount, 0)
        const rifasUtilizationRate = rifasDistributed > 0 ? (rifasUsed / rifasDistributed) * 100 : 0
        
        // Group submissions by day
        const submissionsByDay = submissions?.reduce((acc: any[], submission) => {
          const date = new Date(submission.submitted_at).toISOString().split('T')[0]
          const existing = acc.find(item => item.date === date)
          if (existing) {
            existing.count++
          } else {
            acc.push({ date, count: 1 })
          }
          return acc
        }, []).sort((a, b) => a.date.localeCompare(b.date)) || []
        
        // Get top performing days
        const topPerformingDays = [...submissionsByDay]
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map(day => ({ date: day.date, submissions: day.count }))
        
        // Audience analytics (simplified)
        const participantsByAudience = [
          { audience: campaign.target_audience || 'Todos', count: uniqueParticipants }
        ]

        setAnalytics({
          campaign: {
            ...campaign,
            id: campaign.id,
            title: campaign.title,
            description: campaign.description,
            type: campaign.type,
            points: campaign.rifas_per_mission || 0,
            status: campaign.status,
            target_audience: campaign.target_audience,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            has_badge: campaign.has_badge,
            has_lootbox: campaign.has_lootbox
          },
          totalSubmissions,
          approvedSubmissions,
          pendingSubmissions,
          rejectedSubmissions,
          totalParticipants,
          uniqueParticipants,
          conversionRate,
          avgTimeToComplete,
          rifasDistributed,
          rifasUsed,
          rifasUtilizationRate,
          submissionsByDay,
          participantsByAudience,
          topPerformingDays
        })
        
      } catch (err: any) {
        console.error('Error fetching analytics:', err)
        setError(err.message || 'Erro ao carregar analytics da campanha')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [campaignId, isOpen])

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-gray-700 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
            <BarChart3 className="inline-block w-6 h-6 mr-2 text-neon-cyan" />
            Analytics da Campanha
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan"></div>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neon-pink"></div>
              <span className="text-gray-300">Carregando analytics...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg font-medium">{error}</p>
            </div>
          </div>
        )}

        {analytics && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Campaign Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">{analytics.campaign?.title}</h3>
                  <p className="text-gray-300">{analytics.campaign?.description}</p>
                </div>
                <div className="ml-6">
                  <Badge variant="outline" className="text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10">
                    {analytics.campaign?.status}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-neon-cyan" />
                    Total de Participantes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.totalParticipants}</div>
                  <p className="text-xs text-gray-400">
                    {analytics.uniqueParticipants} únicos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-neon-pink" />
                    Submissões
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.totalSubmissions}</div>
                  <p className="text-xs text-gray-400">
                    {analytics.approvedSubmissions} aprovadas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-neon-lime" />
                    Taxa de Conversão
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</div>
                  <p className="text-xs text-gray-400">
                    aprovação/participação
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-yellow-400" />
                    Tempo Médio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{analytics.avgTimeToComplete.toFixed(1)}h</div>
                  <p className="text-xs text-gray-400">
                    para completar
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Submission Status Breakdown */}
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-neon-cyan" />
                  Status das Submissões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{analytics.approvedSubmissions}</div>
                    <p className="text-sm text-green-300">Aprovadas</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="text-2xl font-bold text-yellow-400">{analytics.pendingSubmissions}</div>
                    <p className="text-sm text-yellow-300">Pendentes</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="text-2xl font-bold text-red-400">{analytics.rejectedSubmissions}</div>
                    <p className="text-sm text-red-300">Rejeitadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rifas Analytics */}
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  <Award className="w-5 h-5 mr-2 text-neon-pink" />
                  Analytics de Rifas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-cyan">{analytics.rifasDistributed}</div>
                    <p className="text-sm text-gray-400">Rifas Distribuídas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-pink">{analytics.rifasUsed}</div>
                    <p className="text-sm text-gray-400">Rifas Utilizadas</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-lime">{analytics.rifasUtilizationRate.toFixed(1)}%</div>
                    <p className="text-sm text-gray-400">Taxa de Utilização</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Days */}
            {analytics.topPerformingDays.length > 0 && (
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-neon-lime" />
                    Dias com Melhor Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.topPerformingDays.map((day, index) => (
                      <div key={day.date} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-neon-cyan">{index + 1}</span>
                          </div>
                          <span className="text-white">{new Date(day.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="text-neon-pink font-semibold">{day.submissions} submissões</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Campaign Details */}
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 border-gray-600/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  <Target className="w-5 h-5 mr-2 text-neon-cyan" />
                  Detalhes da Campanha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Público-alvo</p>
                    <p className="text-white font-medium">{analytics.campaign?.target_audience || 'Todos'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tipo</p>
                    <p className="text-white font-medium">{analytics.campaign?.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Data de Início</p>
                    <p className="text-white font-medium">
                      {analytics.campaign?.start_date 
                        ? new Date(analytics.campaign.start_date).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Data de Término</p>
                    <p className="text-white font-medium">
                      {analytics.campaign?.end_date 
                        ? new Date(analytics.campaign.end_date).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {analytics.campaign?.has_badge && (
                    <Badge variant="secondary" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10">
                      <Award className="w-3 h-3 mr-1" />
                      Badge
                    </Badge>
                  )}
                  {analytics.campaign?.has_lootbox && (
                    <Badge variant="secondary" className="text-purple-400 border-purple-400/30 bg-purple-400/10">
                      <Target className="w-3 h-3 mr-1" />
                      Lootbox
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CampaignAnalyticsModal 