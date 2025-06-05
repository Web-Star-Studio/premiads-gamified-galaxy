import { CashbackList } from '@/features/anunciante-cashbacks/CashbackList'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

function AnuncianteCashbacksPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  if (authLoading) return <div className="text-center py-8">Carregando usuário...</div>
  if (!user) return <div className="text-center py-8 text-red-500">Usuário não autenticado.</div>
  const advertiserId = user.id

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-4 flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="px-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold ml-2">Gerenciar Cupons de Cashback</h1>
      </div>
      <CashbackList advertiserId={advertiserId} />
    </div>
  )
}

export default AnuncianteCashbacksPage 