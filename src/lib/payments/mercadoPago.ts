import axios from 'axios'
import { supabase } from '@/integrations/supabase/client'

interface MercadoPagoPaymentParams {
  amount: number
  method: string
  purchaseId: string
  userId?: string
}

/**
 * Initiates a payment through Mercado Pago
 * @param params Payment parameters
 * @returns Payment result with success status and data or error
 */
export async function initiateMercadoPago({ 
  amount, 
  method, 
  purchaseId,
  userId 
}: MercadoPagoPaymentParams) {
  try {
    // Get user ID if not provided
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession()
      userId = sessionData?.session?.user?.id
      if (!userId) {
        return { 
          success: false, 
          error: 'Usuário não autenticado' 
        }
      }
    }

    // Call Mercado Pago API (in production, this would be a server-side call)
    // For now, we'll simulate the API call
    const response = await axios.post('/api/mercado-pago', {
      amount,
      method,
      purchaseId,
      userId,
      description: `Compra de créditos - ${purchaseId}`
    })

    return { 
      success: true, 
      data: response.data 
    }
  } catch (error: any) {
    console.error('Erro ao conectar Mercado Pago:', error)
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erro ao conectar Mercado Pago' 
    }
  }
}

/**
 * Verifies the status of a Mercado Pago payment
 * @param paymentId Payment ID from Mercado Pago
 * @returns Payment verification result
 */
export async function verifyMercadoPagoPayment(paymentId: string) {
  try {
    // In production, this would be a server-side call to Mercado Pago's API
    // For now, we'll simulate the API call
    const response = await axios.get(`/api/mercado-pago/status/${paymentId}`)
    
    return {
      success: true,
      status: response.data.status,
      data: response.data
    }
  } catch (error: any) {
    console.error('Erro ao verificar pagamento Mercado Pago:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao verificar pagamento'
    }
  }
} 