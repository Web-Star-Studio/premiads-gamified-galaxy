import { useReferralTracking } from '@/hooks/useReferralTracking'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const stepLabels = {
  signup_attempt: 'Tentativa de Cadastro',
  signup_success: 'Cadastro Realizado',
  referral_bonus_applied: 'Bônus Aplicado',
  first_mission_submitted: 'Primeira Missão Enviada',
  first_mission_approved: 'Primeira Missão Aprovada',
  referral_completed: 'Indicação Completada',
  milestone_reached: 'Marco Alcançado'
}

const stepDescriptions = {
  signup_attempt: 'Usuário tentou se cadastrar com código de referência',
  signup_success: 'Cadastro realizado com sucesso',
  referral_bonus_applied: '50 rifas de bônus foram concedidas',
  first_mission_submitted: 'Primeira missão foi submetida para aprovação',
  first_mission_approved: 'Primeira missão foi aprovada',
  referral_completed: 'Indicação foi completada, 200 rifas concedidas ao referenciador',
  milestone_reached: 'Marco de indicações foi alcançado'
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-500" />
    case 'processing':
      return <Clock className="h-5 w-5 text-yellow-500" />
    default:
      return <AlertCircle className="h-5 w-5 text-gray-400" />
  }
}

function StatusBadge({ status }: { status: string }) {
  const variants = {
    completed: 'default',
    failed: 'destructive',
    processing: 'secondary',
    pending: 'outline'
  } as const

  const labels = {
    completed: 'Completo',
    failed: 'Falhou',
    processing: 'Processando',
    pending: 'Pendente'
  }

  return (
    <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
      {labels[status as keyof typeof labels] || status}
    </Badge>
  )
}

export function ReferralTrackingView() {
  const { loading, trackingSteps, getProgressSummary } = useReferralTracking()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rastreamento de Indicações</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const summary = getProgressSummary()

  if (trackingSteps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rastreamento de Indicações</CardTitle>
          <CardDescription>
            Nenhuma atividade de indicação encontrada ainda.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo do Progresso */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso das Indicações</CardTitle>
          <CardDescription>
            Acompanhe o status de suas indicações em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-sm text-muted-foreground">
              {summary.completedSteps} de {summary.totalSteps} etapas
            </span>
          </div>
          <Progress value={summary.progressPercentage} className="w-full" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.completedSteps}
              </div>
              <div className="text-xs text-muted-foreground">Completas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {summary.failedSteps}
              </div>
              <div className="text-xs text-muted-foreground">Falharam</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.progressPercentage}%
              </div>
              <div className="text-xs text-muted-foreground">Progresso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {summary.hasFailures ? '⚠️' : '✅'}
              </div>
              <div className="text-xs text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Etapas */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Atividades</CardTitle>
          <CardDescription>
            Histórico detalhado de todas as etapas do processo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackingSteps.map((step, index) => (
              <div
                key={step.id}
                className="flex items-start space-x-4 p-4 rounded-lg border bg-card"
              >
                <StatusIcon status={step.status} />
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">
                      {stepLabels[step.step] || step.step}
                    </h4>
                    <StatusBadge status={step.status} />
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {stepDescriptions[step.step] || 'Etapa do processo de indicação'}
                  </p>
                  
                  {step.referral_code && (
                    <div className="text-xs text-blue-600">
                      Código: {step.referral_code}
                    </div>
                  )}
                  
                  {step.error_message && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      Erro: {step.error_message}
                    </div>
                  )}
                  
                  {step.data && Object.keys(step.data).length > 0 && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                        Ver detalhes
                      </summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                        {JSON.stringify(step.data, null, 2)}
                      </pre>
                    </details>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(step.created_at), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 