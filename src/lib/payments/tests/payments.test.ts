import { describe, it, expect, vi, beforeEach } from 'vitest'
import { initiateMercadoPago, verifyMercadoPagoPayment } from '../mercadoPago'
import { initiateStripe, verifyStripePayment } from '../stripe'
import axios from 'axios'
import { supabase } from '@/integrations/supabase/client'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}))

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  }
}))

describe('Payment Integrations', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    
    // Mock successful auth session with minimal User object
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: {
        session: {
          // Only mock the properties we actually use
          user: { 
            id: 'test-user-id',
            // Add required User properties with dummy values
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: '2023-01-01T00:00:00.000Z'
          }
        }
      },
      error: null
    } as any) // Use type assertion to avoid having to implement the full type
  })
  
  describe('Mercado Pago Integration', () => {
    it('should successfully initiate a payment', async () => {
      // Mock successful API response
      vi.mocked(axios.post).mockResolvedValue({
        data: { 
          payment_id: 'mp-123', 
          payment_url: 'https://mercadopago.com/checkout/123',
          qr_code: 'data:image/png;base64,abc123'
        }
      })
      
      const result = await initiateMercadoPago({
        amount: 100,
        method: 'pix',
        purchaseId: 'purchase-123'
      })
      
      expect(result.success).toBe(true)
      expect(result.data.payment_id).toBe('mp-123')
      expect(axios.post).toHaveBeenCalledWith('/api/mercado-pago', {
        amount: 100,
        method: 'pix',
        purchaseId: 'purchase-123',
        userId: 'test-user-id',
        description: 'Compra de créditos - purchase-123'
      })
    })
    
    it('should handle API errors', async () => {
      // Mock API error
      vi.mocked(axios.post).mockRejectedValue({
        response: {
          data: {
            message: 'Invalid payment method'
          }
        }
      })
      
      const result = await initiateMercadoPago({
        amount: 100,
        method: 'invalid',
        purchaseId: 'purchase-123'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid payment method')
    })
    
    it('should verify payment status', async () => {
      // Mock successful verification
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          status: 'confirmed',
          payment_id: 'mp-123'
        }
      })
      
      const result = await verifyMercadoPagoPayment('mp-123')
      
      expect(result.success).toBe(true)
      expect(result.status).toBe('confirmed')
      expect(axios.get).toHaveBeenCalledWith('/api/mercado-pago/status/mp-123')
    })
  })
  
  describe('Stripe Integration', () => {
    it('should successfully initiate a payment', async () => {
      // Mock successful API response
      vi.mocked(axios.post).mockResolvedValue({
        data: { 
          payment_id: 'stripe-123', 
          payment_url: 'https://stripe.com/checkout/123'
        }
      })
      
      const result = await initiateStripe({
        amount: 100,
        method: 'credit_card',
        purchaseId: 'purchase-123'
      })
      
      expect(result.success).toBe(true)
      expect(result.data.payment_id).toBe('stripe-123')
      expect(axios.post).toHaveBeenCalledWith('/api/stripe', {
        amount: 100,
        method: 'credit_card',
        purchaseId: 'purchase-123',
        userId: 'test-user-id',
        description: 'Compra de créditos - purchase-123'
      })
    })
    
    it('should handle API errors', async () => {
      // Mock API error
      vi.mocked(axios.post).mockRejectedValue({
        response: {
          data: {
            message: 'Card declined'
          }
        }
      })
      
      const result = await initiateStripe({
        amount: 100,
        method: 'credit_card',
        purchaseId: 'purchase-123'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Card declined')
    })
    
    it('should verify payment status', async () => {
      // Mock successful verification
      vi.mocked(axios.get).mockResolvedValue({
        data: {
          status: 'confirmed',
          payment_id: 'stripe-123'
        }
      })
      
      const result = await verifyStripePayment('stripe-123')
      
      expect(result.success).toBe(true)
      expect(result.status).toBe('confirmed')
      expect(axios.get).toHaveBeenCalledWith('/api/stripe/status/stripe-123')
    })
  })
  
  describe('Authentication handling', () => {
    it('should handle unauthenticated users', async () => {
      // Mock no active session
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      } as any)
      
      const result = await initiateMercadoPago({
        amount: 100,
        method: 'pix',
        purchaseId: 'purchase-123'
      })
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Usuário não autenticado')
    })
  })
}) 