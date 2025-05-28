import { CashbackCampaign } from './types'

interface CashbackPreviewProps {
  data: Partial<Pick<CashbackCampaign, 'title' | 'description' | 'discount_percentage' | 'minimum_purchase' | 'end_date' | 'category' | 'advertiser_logo'>>
}

function CashbackPreview({ data }: CashbackPreviewProps) {
  return (
    <div className="bg-card rounded-lg shadow p-6 flex flex-col gap-3 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        {data.advertiser_logo ? (
          <img src={data.advertiser_logo} alt="Ícone" className="w-12 h-12 rounded-full bg-muted" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-xl text-muted-foreground">?</div>
        )}
        <div>
          <div className="font-bold text-lg">{data.title || 'Título do Cupom'}</div>
          <div className="text-xs text-muted-foreground">{data.category || 'Categoria'}</div>
        </div>
        <span className="ml-auto text-primary font-bold text-lg">{data.discount_percentage ? `${data.discount_percentage}%` : '--'} OFF</span>
      </div>
      <div className="text-sm text-muted-foreground line-clamp-2">{data.description || 'Descrição do cupom.'}</div>
      <div className="flex gap-4 text-xs mt-2">
        <div className="flex items-center gap-1">
          <span className="font-medium">Valor Mínimo:</span>
          <span>{data.discount_percentage === 100 ? 'Não exige' : data.minimum_purchase ? `R$ ${Number(data.minimum_purchase).toFixed(2)}` : '--'}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">Validade:</span>
          <span>{data.end_date ? new Date(data.end_date).toLocaleDateString() : '--'}</span>
        </div>
      </div>
    </div>
  )
}

export { CashbackPreview } 