
import React, { useState } from 'react';
import { CashbackList } from '@/features/anunciante-cashbacks/CashbackList'
import { CashbackForm } from '@/features/anunciante-cashbacks/CashbackForm'
import { useCashbacks } from '@/features/anunciante-cashbacks/useCashbacks.hook'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus } from 'lucide-react'
import { CashbackCampaign } from '@/features/anunciante-cashbacks/types'
import { useToast } from '@/hooks/use-toast'

function AnuncianteCashbacksPage() {
  const { user, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editCampaign, setEditCampaign] = useState<CashbackCampaign | null>(null)
  
  if (authLoading) return <div className="text-center py-8">Carregando usuário...</div>
  if (!user) return <div className="text-center py-8 text-red-500">Usuário não autenticado.</div>
  
  const advertiserId = user.id
  const { campaigns, isLoading, deleteCashback, isDeleting } = useCashbacks(advertiserId)

  const handleEdit = (campaign: CashbackCampaign) => {
    setEditCampaign(campaign)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      try {
        await deleteCashback(id)
        toast({
          title: 'Sucesso',
          description: 'Campanha excluída com sucesso!'
        })
      } catch (error: any) {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao excluir campanha',
          variant: 'destructive'
        })
      }
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditCampaign(null)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="px-2">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold ml-2">Gerenciar Cupons de Cashback</h1>
        </div>
        
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Campanha
        </Button>
      </div>
      
      <CashbackList 
        campaigns={campaigns || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
      
      <CashbackForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editCampaign={editCampaign}
        advertiserId={advertiserId}
        onSuccess={() => {
          // A lista será atualizada automaticamente pelo react-query
        }}
      />
    </div>
  )
}

export default AnuncianteCashbacksPage
