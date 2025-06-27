import { useState, useCallback } from 'react'
import { PaymentMethod, PaymentProvider } from '@/lib/payments'

interface PaymentSelection {
  provider: PaymentProvider
  method: PaymentMethod
}

export function usePaymentSelection() {
  const [selection, setSelection] = useState<PaymentSelection>({
    provider: 'mercado_pago',
    method: 'pix'
  })

  const updateProvider = useCallback((provider: PaymentProvider) => {
    setSelection(prev => ({
      ...prev,
      provider,
      // Define método padrão baseado no provider
      method: provider === 'stripe' ? 'credit_card' : 'pix'
    }))
  }, [])

  const updateMethod = useCallback((method: PaymentMethod) => {
    setSelection(prev => {
      // Define quais métodos são válidos para cada provider
      const mercadoPagoMethods: PaymentMethod[] = ['pix', 'credit_card', 'boleto']
      const stripeMethods: PaymentMethod[] = ['credit_card', 'debit']
      
      // Mantém o provider atual se o método for válido para ele
      const currentProvider = prev.provider
      
      let newProvider: PaymentProvider
      if (currentProvider === 'mercado_pago' && mercadoPagoMethods.includes(method)) {
        newProvider = 'mercado_pago' // Mantém Mercado Pago se método for válido
      } else if (currentProvider === 'stripe' && stripeMethods.includes(method)) {
        newProvider = 'stripe' // Mantém Stripe se método for válido
      } else {
        // Se método não for válido para provider atual, escolhe o provider apropriado
        newProvider = mercadoPagoMethods.includes(method) ? 'mercado_pago' : 'stripe'
      }
      
      return {
        ...prev,
        method,
        provider: newProvider
      }
    })
  }, [])

  return {
    selectedProvider: selection.provider,
    selectedMethod: selection.method,
    updateProvider,
    updateMethod,
    getPaymentConfig: () => selection
  }
} 