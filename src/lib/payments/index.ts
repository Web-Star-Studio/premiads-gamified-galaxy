export { initiateMercadoPago, verifyMercadoPagoPayment } from './mercadoPago'
export { initiateStripe, verifyStripePayment } from './stripe'

/**
 * Payment provider types
 */
export type PaymentProvider = 'mercado_pago' | 'stripe'

/**
 * Payment method types
 */
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'debit'

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'confirmed' | 'failed'

/**
 * Common payment parameters interface
 */
export interface PaymentParams {
  amount: number
  method: PaymentMethod
  purchaseId: string
  userId?: string
} 