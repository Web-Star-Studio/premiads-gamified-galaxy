import { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export interface PurchaseRifasRequest {
  userId: string
  packageId?: string
  customRifas?: number
  paymentProvider: 'stripe'
  paymentMethod: 'credit_card' | 'debit' | 'pix'
}

export function usePurchaseRifas() {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)

  async function purchaseRifas(request: PurchaseRifasRequest) {
    setLoading(true)
    setError(null)
    const res = await supabase.functions.invoke('purchase-rifas', {
      body: JSON.stringify(request),
      headers: { 'Content-Type': 'application/json' }
    })
    setLoading(false)
    if (res.error) {
      setError(res.error.message)
      return
    }
    const { payment } = res.data as any
    if (payment?.payment_url) {
      setPaymentUrl(payment.payment_url)
      window.location.href = payment.payment_url
    } else {
      setError('Falha ao obter URL de pagamento')
    }
  }

  return { purchaseRifas, isLoading, error, paymentUrl }
} 