import { useState } from 'react'
import { purchaseCredits, PurchaseCreditsRequest } from '@/lib/services/credits'

export interface PurchaseRifasRequest {
  userId: string
  packageId?: string
  customAmount?: number
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
    try {
      const data = await purchaseCredits(request)
      const { payment } = data as any
      if (payment?.payment_url) {
        window.location.href = payment.payment_url
      } else {
        setError('Falha ao obter URL de pagamento')
      }
    } catch (err: any) {
      setError(err.message || 'Falha ao iniciar compra')
    } finally {
      setLoading(false)
    }
  }

  return { purchaseRifas, isLoading, error, paymentUrl }
} 