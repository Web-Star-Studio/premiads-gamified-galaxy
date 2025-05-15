import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { PaymentMethod, PaymentProvider } from '@/lib/payments'

export interface CreditPackage {
  id: string
  base: number
  bonus: number
  price: number
  validityMonths: number
}

interface PurchaseCreditsParams {
  packageId?: string
  customAmount?: number
  paymentProvider: PaymentProvider
  paymentMethod: PaymentMethod
}

// Type for credit packages from database
interface DbCreditPackage {
  id: string
  base: number
  bonus: number
  price: number
  validity_months: number
  active: boolean
  created_at: string
  updated_at: string
}

/**
 * Hook for credit purchase operations
 */
function useCreditPurchase() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProvider | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch available credit packages
  const { 
    data: creditPackages, 
    isLoading: isLoadingPackages,
    error: packagesError 
  } = useQuery({
    queryKey: ['creditPackages'],
    queryFn: async () => {
      // Using any here to bypass type checking for the database schema
      // In a real project, you'd use proper database types
      const { data, error } = await supabase
        .from('credit_packages')
        .select('*')
        .eq('active', true)
        .order('base', { ascending: true }) as { data: DbCreditPackage[] | null, error: any }
      
      if (error) throw new Error(error.message)
      if (!data) return []
      
      return data.map(pkg => ({
        id: pkg.id,
        base: pkg.base,
        bonus: pkg.bonus,
        price: pkg.price,
        validityMonths: pkg.validity_months
      }))
    }
  })

  // Fetch user's current credits
  const { 
    data: userCredits,
    isLoading: isLoadingCredits
  } = useQuery({
    queryKey: ['userCredits'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      
      if (!userId) return 0
      
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single()
      
      if (error) throw new Error(error.message)
      
      return data?.credits || 0
    }
  })

  // Initiate credit purchase
  const { 
    mutate: purchaseCredits,
    isPending: isPurchasing,
    error: purchaseError
  } = useMutation({
    mutationFn: async ({ packageId, customAmount, paymentProvider, paymentMethod }: PurchaseCreditsParams) => {
      const { data: sessionData } = await supabase.auth.getSession()
      const userId = sessionData?.session?.user?.id
      
      if (!userId) {
        throw new Error('Usuário não autenticado')
      }
      
      // Call the purchase-credits edge function
      const response = await axios.post('/api/purchase-credits', {
        userId,
        packageId,
        customAmount,
        paymentProvider,
        paymentMethod
      })
      
      return response.data
    },
    onSuccess: (data) => {
      toast({
        title: 'Pagamento iniciado',
        description: 'Aguardando confirmação do pagamento...'
      })
      
      // Open payment URL in new tab if available
      if (data.payment?.payment_url) {
        window.open(data.payment.payment_url, '_blank')
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao iniciar pagamento',
        description: error.message || 'Ocorreu um erro ao processar sua compra',
        variant: 'destructive'
      })
    }
  })

  // Confirm payment (for testing/simulation purposes)
  const { mutate: confirmPayment } = useMutation({
    mutationFn: async ({ purchaseId, paymentId, status, provider }: { 
      purchaseId: string,
      paymentId: string,
      status: 'confirmed' | 'failed',
      provider: PaymentProvider
    }) => {
      // Call the confirm-payment edge function
      const response = await axios.post('/api/confirm-payment', {
        purchase_id: purchaseId,
        payment_id: paymentId,
        status,
        provider
      })
      
      return response.data
    },
    onSuccess: (data) => {
      if (data.status === 'confirmed') {
        toast({
          title: 'Pagamento confirmado',
          description: 'Seus créditos foram adicionados com sucesso!'
        })
      } else {
        toast({
          title: 'Pagamento falhou',
          description: 'O pagamento não pôde ser processado',
          variant: 'destructive'
        })
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['userCredits'] })
      queryClient.invalidateQueries({ queryKey: ['activityLog'] })
      
      // Close payment modal
      setIsPaymentModalOpen(false)
      setSelectedPackage(null)
      setSelectedPaymentProvider(null)
      setSelectedPaymentMethod(null)
    },
    onError: () => {
      toast({
        title: 'Erro na confirmação',
        description: 'Não foi possível confirmar o pagamento',
        variant: 'destructive'
      })
    }
  })

  // Calculate credits for custom amount
  function calculateCustomPackage(amount: number) {
    if (!creditPackages || !creditPackages.length) return { base: amount, bonus: 0, total: amount }
    
    let bonus = 0
    // Find the highest applicable bonus tier
    for (const pkg of creditPackages) {
      if (amount >= pkg.base) {
        const bonusPercentage = pkg.bonus / pkg.base
        bonus = Math.floor(amount * bonusPercentage)
      }
    }
    
    return {
      base: amount,
      bonus,
      total: amount + bonus,
      price: amount / 10 // 10 credits = R$1.00
    }
  }

  return {
    creditPackages,
    userCredits,
    isLoadingPackages,
    isLoadingCredits,
    isPurchasing,
    packagesError,
    purchaseError,
    purchaseCredits,
    confirmPayment,
    calculateCustomPackage,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedPackage,
    setSelectedPackage,
    selectedPaymentProvider,
    setSelectedPaymentProvider,
    selectedPaymentMethod,
    setSelectedPaymentMethod
  }
}

export { useCreditPurchase } 