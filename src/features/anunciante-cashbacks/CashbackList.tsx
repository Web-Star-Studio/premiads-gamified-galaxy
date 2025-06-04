import { useState } from 'react'
import { useCashbacks } from './useCashbacks.hook'
import { CashbackCampaign } from './types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import CashbackForm from './CashbackForm'

interface CashbackListProps {
  advertiserId: string
}

function CashbackList({ advertiserId }: CashbackListProps) {
  const {
    campaigns,
    isLoading,
    isError,
    deleteCashback,
    isDeleting,
    refetch
  } = useCashbacks(advertiserId)
  const [editing, setEditing] = useState<CashbackCampaign | null>(null)
  const [open, setOpen] = useState(false)

  if (isLoading) return <div className="text-center py-8">Carregando...</div>
  if (isError) return <div className="text-center py-8 text-red-500">Erro ao carregar cupons.</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Seus Cupons de Cashback</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)} variant="default">Novo Cupom</Button>
          </DialogTrigger>
          <DialogContent>
            <CashbackForm
              advertiserId={advertiserId}
              initialData={editing}
              onClose={() => {
                setOpen(false)
                setEditing(null)
                refetch()
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns?.map(campaign => (
          <div key={campaign.id} className="bg-card rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={campaign.advertiser_logo} alt="Ícone" className="w-10 h-10 rounded-full bg-muted" />
              <div>
                <div className="font-semibold">{campaign.title}</div>
                <div className="text-xs text-muted-foreground">{campaign.category}</div>
              </div>
              <span className="ml-auto text-primary font-bold">{campaign.discount_percentage}%</span>
            </div>
            <div className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => { setEditing(campaign); setOpen(true) }}>Editar</Button>
              <Button size="sm" variant="destructive" disabled={isDeleting} onClick={() => deleteCashback(campaign.id)}>Remover</Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Válido até: {new Date(campaign.end_date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { CashbackList } 