import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { PaymentMethod, PaymentProvider } from '@/lib/payments'
import { CreditCard, QrCode, Receipt, Landmark } from 'lucide-react'
import { useSounds } from '@/hooks/use-sounds'

interface PaymentMethodSelectorProps {
  onSelectProvider: (provider: PaymentProvider) => void
  onSelectMethod: (method: PaymentMethod) => void
  selectedProvider: PaymentProvider | null
  selectedMethod: PaymentMethod | null
}

function PaymentMethodSelector({
  onSelectProvider,
  onSelectMethod,
  selectedProvider,
  selectedMethod
}: PaymentMethodSelectorProps) {
  const [activeTab, setActiveTab] = useState<PaymentProvider>('mercado_pago')
  const { playSound } = useSounds()
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as PaymentProvider)
    onSelectProvider(value as PaymentProvider)
    playSound('pop')
  }
  
  const handleMethodSelect = (method: PaymentMethod) => {
    onSelectMethod(method)
    playSound('pop')
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Escolha a forma de pagamento</h3>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mercado_pago">Mercado Pago</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mercado_pago" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <PaymentMethodCard
              method="pix"
              icon={<QrCode className="w-5 h-5" />}
              title="Pix"
              description="Pagamento instantâneo"
              isSelected={selectedMethod === 'pix' && selectedProvider === 'mercado_pago'}
              onSelect={() => handleMethodSelect('pix')}
            />
            <PaymentMethodCard
              method="credit_card"
              icon={<CreditCard className="w-5 h-5" />}
              title="Cartão de Crédito"
              description="Visa, Mastercard, etc."
              isSelected={selectedMethod === 'credit_card' && selectedProvider === 'mercado_pago'}
              onSelect={() => handleMethodSelect('credit_card')}
            />
            <PaymentMethodCard
              method="boleto"
              icon={<Receipt className="w-5 h-5" />}
              title="Boleto"
              description="Prazo de 3 dias úteis"
              isSelected={selectedMethod === 'boleto' && selectedProvider === 'mercado_pago'}
              onSelect={() => handleMethodSelect('boleto')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stripe" className="mt-4">
          <div className="grid grid-cols-2 gap-3">
            <PaymentMethodCard
              method="credit_card"
              icon={<CreditCard className="w-5 h-5" />}
              title="Cartão de Crédito"
              description="Visa, Mastercard, etc."
              isSelected={selectedMethod === 'credit_card' && selectedProvider === 'stripe'}
              onSelect={() => handleMethodSelect('credit_card')}
            />
            <PaymentMethodCard
              method="debit"
              icon={<Landmark className="w-5 h-5" />}
              title="Débito"
              description="Transferência bancária"
              isSelected={selectedMethod === 'debit' && selectedProvider === 'stripe'}
              onSelect={() => handleMethodSelect('debit')}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PaymentMethodCardProps {
  method: PaymentMethod
  icon: React.ReactNode
  title: string
  description: string
  isSelected: boolean
  onSelect: () => void
}

function PaymentMethodCard({
  icon,
  title,
  description,
  isSelected,
  onSelect
}: PaymentMethodCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <Card 
        className={cn(
          'cursor-pointer border transition-all duration-200',
          isSelected 
            ? 'border-neon-pink shadow-[0_0_10px_rgba(255,0,200,0.2)] bg-galaxy-deepPurple/40' 
            : 'border-galaxy-purple/30 hover:border-neon-pink/50 bg-galaxy-deepPurple/20'
        )}
      >
        <CardContent className="p-4 flex items-center gap-3">
          <div className={cn(
            'p-2 rounded-full',
            isSelected ? 'bg-neon-pink/20 text-neon-pink' : 'bg-galaxy-purple/20 text-galaxy-purple'
          )}>
            {icon}
          </div>
          <div>
            <h4 className="font-medium">{title}</h4>
            <p className="text-xs text-gray-400">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export { PaymentMethodSelector } 