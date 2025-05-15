import axios from 'axios'
import { supabase } from '@/integrations/supabase/client'

interface StripePaymentParams {
  amount: number
  method: string
  purchaseId: string
  userId?: string
}

/**
 * Initiates a payment through Stripe
 * @param params Payment parameters
 * @returns Payment result with success status and data or error
 */
export async function initiateStripe({ 
  amount, 
  method, 
  purchaseId,
  userId 
}: StripePaymentParams) {
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

    // Call Stripe API (in production, this would be a server-side call)
    // For now, we'll simulate the API call
    const response = await axios.post('/api/stripe', {
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
    console.error('Erro ao conectar Stripe:', error)
    return { 
      success: false, 
      error: error.response?.data?.message || 'Erro ao conectar Stripe' 
    }
  }
}

/**
 * Verifies the status of a Stripe payment
 * @param paymentId Payment ID from Stripe
 * @returns Payment verification result
 */
export async function verifyStripePayment(paymentId: string) {
  try {
    // In production, this would be a server-side call to Stripe's API
    // For now, we'll simulate the API call
    const response = await axios.get(`/api/stripe/status/${paymentId}`)
    
    return {
      success: true,
      status: response.data.status,
      data: response.data
    }
  } catch (error: any) {
    console.error('Erro ao verificar pagamento Stripe:', error)
    return {
      success: false,
      error: error.response?.data?.message || 'Erro ao verificar pagamento'
    }
  }
} 