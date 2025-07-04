import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X, Calendar, Users, Target, Trophy, FileText, Camera, Video, MapPin, Share, Tag, BarChart3, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import CampaignStatusBadge from "./CampaignStatusBadge"

interface CampaignDetailsModalProps {
  campaignId: string
  isOpen: boolean
  onClose: () => void
}

interface CampaignDetails {
  id: string
  title: string
  description?: string
  type: string
  status: string
  target_audience?: string
  start_date?: string
  end_date?: string
  requirements?: string[]
  rifas: number
  max_participants?: number
  cashback_reward?: number
  has_badge?: boolean
  has_lootbox?: boolean
  created_at?: string
  approved_submissions: number
  pending_submissions: number
  rejected_submissions: number
}

type MissionType = 'form' | 'photo' | 'video' | 'checkin' | 'social' | 'coupon' | 'survey' | 'review'

function CampaignDetailsModal({ campaignId, isOpen, onClose }: CampaignDetailsModalProps) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && campaignId) {
      fetchCampaignDetails()
    }
  }, [isOpen, campaignId])

  const fetchCampaignDetails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch campaign details
      const { data: campaignData, error: campaignError } = await supabase
        .from('missions')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (campaignError) throw campaignError

      // Fetch submission statistics
      const { data: submissionStats, error: statsError } = await supabase
        .from('mission_submissions')
        .select('status')
        .eq('mission_id', campaignId)

      if (statsError) throw statsError

      // Calculate submission counts
      const approved = submissionStats?.filter(s => s.status === 'approved').length || 0
      const pending = submissionStats?.filter(s => s.status === 'pending').length || 0
      const rejected = submissionStats?.filter(s => s.status === 'rejected').length || 0

      setCampaign({
        ...campaignData,
        approved_submissions: approved,
        pending_submissions: pending,
        rejected_submissions: rejected
      })
    } catch (err) {
      console.error('Error fetching campaign details:', err)
      setError('Erro ao carregar detalhes da campanha')
    } finally {
      setIsLoading(false)
    }
  }

  const getTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      form: 'Formulário',
      photo: 'Foto',
      video: 'Vídeo',
      checkin: 'Check-in',
      social: 'Social',
      coupon: 'Cupom',
      survey: 'Pesquisa',
      review: 'Avaliação'
    }
    return typeLabels[type] || type
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      form: <FileText className="h-4 w-4" />,
      photo: <Camera className="h-4 w-4" />,
      video: <Video className="h-4 w-4" />,
      checkin: <MapPin className="h-4 w-4" />,
      social: <Share className="h-4 w-4" />,
      coupon: <Tag className="h-4 w-4" />,
      survey: <BarChart3 className="h-4 w-4" />,
      review: <Star className="h-4 w-4" />
    }
    return icons[type] || <FileText className="h-4 w-4" />
  }

  const getAudienceLabel = (audience?: string): string => {
    const audienceLabels: Record<string, string> = {
      todos: 'Todos',
      novos: 'Novos usuários',
      ativos: 'Usuários ativos',
      premium: 'Usuários premium'
    }
    return audienceLabels[audience || 'todos'] || audience || 'Todos'
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A'
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })
    } catch {
      return 'Data inválida'
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 backdrop-blur-sm shadow-2xl">
        <DialogHeader className="pb-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
            Detalhes da Campanha
          </h2>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-600 border-t-neon-cyan shadow-lg"></div>
              <div className="absolute inset-0 animate-pulse rounded-full border-2 border-transparent border-t-neon-pink/50" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
              <div className="text-red-400 font-medium">{error}</div>
            </div>
          </div>
        )}

        {campaign && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Campaign Header */}
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-3 leading-tight">{campaign.title}</h3>
                  <p className="text-gray-300 text-base leading-relaxed">{campaign.description}</p>
                </div>
                <div className="ml-6">
                  <CampaignStatusBadge status={campaign.status} />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Badge variant="glow" className="text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10 shadow-[0_0_15px_rgba(47,128,237,0.3)] px-3 py-1.5">
                  {getTypeIcon(campaign.type)}
                  <span className="ml-2 font-medium">{getTypeLabel(campaign.type)}</span>
                </Badge>
                <Badge variant="outline" className="text-gray-300 border-gray-500/50 bg-gray-800/50 px-3 py-1.5">
                  <Target className="h-4 w-4 mr-2" />
                  {getAudienceLabel(campaign.target_audience)}
                </Badge>
                {campaign.has_badge && (
                  <Badge variant="warning" className="text-yellow-400 border-yellow-400/30 bg-yellow-400/10 shadow-[0_0_10px_rgba(255,193,7,0.3)] px-3 py-1.5">
                    <Trophy className="h-4 w-4 mr-2" />
                    Badge
                  </Badge>
                )}
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl p-6 border border-gray-600/30 hover:border-neon-cyan/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(47,128,237,0.1)]">
                <div className="text-3xl font-bold text-neon-cyan mb-2">{campaign.approved_submissions}</div>
                <div className="text-sm text-gray-300 font-medium">Aprovadas</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl p-6 border border-gray-600/30 hover:border-yellow-400/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,193,7,0.1)]">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{campaign.pending_submissions}</div>
                <div className="text-sm text-gray-300 font-medium">Pendentes</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl p-6 border border-gray-600/30 hover:border-red-400/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="text-3xl font-bold text-red-400 mb-2">{campaign.rejected_submissions}</div>
                <div className="text-sm text-gray-300 font-medium">Rejeitadas</div>
              </div>
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-700/60 rounded-xl p-6 border border-gray-600/30 hover:border-neon-pink/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                <div className="text-3xl font-bold text-neon-pink mb-2">{campaign.rifas}</div>
                <div className="text-sm text-gray-300 font-medium">Rifas por missão</div>
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />

            {/* Campaign Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Timeline */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-semibold text-white flex items-center mb-6">
                  <Calendar className="h-6 w-6 mr-3 text-neon-cyan" />
                  Timeline
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-300 font-medium">Criada em:</span>
                    <span className="text-white font-semibold">{formatDate(campaign.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-300 font-medium">Início:</span>
                    <span className="text-white font-semibold">{formatDate(campaign.start_date)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300 font-medium">Fim:</span>
                    <span className="text-white font-semibold">{formatDate(campaign.end_date)}</span>
                  </div>
                </div>
              </div>

              {/* Limits & Rewards */}
              <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-xl p-6 border border-gray-600/30">
                <h3 className="text-xl font-semibold text-white flex items-center mb-6">
                  <Users className="h-6 w-6 mr-3 text-neon-cyan" />
                  Limites & Recompensas
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-300 font-medium">Max. participantes:</span>
                    <span className="text-white font-semibold">{campaign.max_participants || 'Ilimitado'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-600/30">
                    <span className="text-gray-300 font-medium">Rifas por missão:</span>
                    <span className="text-neon-pink font-semibold">{campaign.rifas}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-300 font-medium">Cashback:</span>
                    <span className="text-neon-lime font-semibold">R$ {Number(campaign.cashback_reward || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            {campaign.requirements && campaign.requirements.length > 0 && (
              <>
                <Separator className="bg-gradient-to-r from-transparent via-gray-600/50 to-transparent" />
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center">
                    <FileText className="h-6 w-6 mr-3 text-neon-cyan" />
                    Requisitos
                  </h3>
                  <div className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 rounded-xl p-6 border border-gray-600/30">
                    <ul className="space-y-3">
                      {campaign.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-200 leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default CampaignDetailsModal 