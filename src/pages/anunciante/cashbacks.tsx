import { CashbackList } from '@/features/anunciante-cashbacks/CashbackList'
import { useAuth } from '@/hooks/useAuth'

function AnuncianteCashbacksPage() {
  const { user, isLoading: authLoading } = useAuth()
  if (authLoading) return <div className="text-center py-8">Carregando usuário...</div>
  if (!user) return <div className="text-center py-8 text-red-500">Usuário não autenticado.</div>
  const advertiserId = user.id

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Cupons de Cashback</h1>
      <CashbackList advertiserId={advertiserId} />
    </div>
  )
}

export default AnuncianteCashbacksPage 