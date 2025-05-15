import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { PaymentMethod, PaymentProvider } from '@/lib/payments'
import { CreditPackage } from '../useCreditPurchase.hook'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { CreditSummary } from './CreditSummary'
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPackage: CreditPackage | null
  customPackage?: { base: number; bonus: number; total: number; price: number }
  onPurchase: (provider: PaymentProvider, method: PaymentMethod) => void
  isPurchasing: boolean
  purchaseError: Error | null
  purchaseSuccess: boolean
}

function PaymentModal({
  isOpen,
  onClose,
  selectedPackage,
  customPackage,
  onPurchase,
  isPurchasing,
  purchaseError,
  purchaseSuccess
}: PaymentModalProps) {
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  
  const handlePurchase = () => {
    if (selectedProvider && selectedMethod) {
      onPurchase(selectedProvider, selectedMethod)
    }
  }
  
  const canPurchase = selectedProvider !== null && selectedMethod !== null && !isPurchasing
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-galaxy-darkPurple border-galaxy-purple">
        <DialogHeader>
          <DialogTitle>Finalizar Compra</DialogTitle>
          <DialogDescription>
            Escolha o método de pagamento para concluir sua compra de créditos.
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          {purchaseSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold">Pagamento Iniciado</h3>
              <p className="text-center text-gray-400 mt-2 mb-6">
                Você será redirecionado para a página de pagamento.
                Seus créditos serão adicionados após a confirmação.
              </p>
              <Button onClick={onClose}>Fechar</Button>
            </motion.div>
          ) : purchaseError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-bold">Erro no Pagamento</h3>
              <p className="text-center text-gray-400 mt-2 mb-2">
                Ocorreu um erro ao processar seu pagamento.
              </p>
              <p className="text-center text-red-400 mb-6">
                {purchaseError.message || 'Tente novamente mais tarde.'}
              </p>
              <Button onClick={onClose} variant="outline">Fechar</Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid gap-6">
                <CreditSummary 
                  selectedPackage={selectedPackage}
                  customPackage={customPackage}
                />
                
                <PaymentMethodSelector
                  selectedProvider={selectedProvider}
                  selectedMethod={selectedMethod}
                  onSelectProvider={setSelectedProvider}
                  onSelectMethod={setSelectedMethod}
                />
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handlePurchase}
                  disabled={!canPurchase}
                  className="bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80"
                >
                  {isPurchasing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Finalizar Compra
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export { PaymentModal } 