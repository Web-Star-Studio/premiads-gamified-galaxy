
import { useState, useEffect } from 'react'
import { CashbackCampaign } from './types'

interface CashbackPreviewProps {
  data: Partial<Pick<CashbackCampaign, 'title' | 'description' | 'cashback_percentage' | 'minimum_purchase' | 'end_date' | 'category'>> & { advertiser_logo?: any }
}

function CashbackPreview({ data }: CashbackPreviewProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null
    
    if (data.advertiser_logo) {
      if (typeof data.advertiser_logo === 'string') {
        setLogoPreview(data.advertiser_logo)
      } else if (data.advertiser_logo instanceof File) {
        objectUrl = URL.createObjectURL(data.advertiser_logo)
        setLogoPreview(objectUrl)
      }
    } else {
      setLogoPreview(null)
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [data.advertiser_logo])

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 flex flex-col gap-4 max-w-sm mx-auto border border-border">
      <div className="flex items-center gap-4">
        {logoPreview ? (
          <img src={logoPreview} alt="Ícone do Anunciante" className="w-14 h-14 rounded-full bg-muted object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl text-muted-foreground">?</div>
        )}
        <div className="flex-1">
          <div className="font-bold text-xl text-foreground truncate">{data.title || 'Título do Cupom'}</div>
          <div className="text-sm text-muted-foreground capitalize">{data.category || 'Categoria'}</div>
        </div>
        <div className="text-primary font-bold text-2xl whitespace-nowrap">{data.cashback_percentage || 0}% CASHBACK</div>
      </div>
      <p className="text-sm text-muted-foreground min-h-[40px]">{data.description || 'Descrição do cupom aparecerá aqui.'}</p>
      <div className="border-t border-border pt-3 mt-2 flex justify-between items-center text-xs text-muted-foreground">
        <div>
          <span className="font-semibold">Valor Mínimo:</span>
          <span className="ml-1">{data.cashback_percentage === 100 ? 'Não aplicável' : `R$ ${Number(data.minimum_purchase || 0).toFixed(2)}`}</span>
        </div>
        <div>
          <span className="font-semibold">Validade:</span>
          <span className="ml-1">{data.end_date ? new Date(data.end_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'dd/mm/aaaa'}</span>
        </div>
      </div>
    </div>
  )
}

export { CashbackPreview }
