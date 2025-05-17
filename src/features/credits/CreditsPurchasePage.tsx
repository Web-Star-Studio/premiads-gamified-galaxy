import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { CreditCard, Info } from 'lucide-react'
import { useSounds } from '@/hooks/use-sounds'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useCreditPurchase } from './useCreditPurchase.hook'
import { CreditPackage } from './useCreditPurchase.hook'
import { PaymentMethod, PaymentProvider } from '@/lib/payments'
import {
  CreditPackageCard,
  CreditSlider,
  PaymentModal
} from './components'

// Define the custom package type
interface CustomPackage {
  base: number
  bonus: number
  total: number
  price: number
}

function CreditsPurchasePage() {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null)
  const [customAmount, setCustomAmount] = useState<number>(1000)
  const [useCustomAmount, setUseCustomAmount] = useState<boolean>(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState<boolean>(false)
  const { playSound } = useSounds()
  
  const {
    creditPackages,
    userCredits,
    isLoadingPackages,
    isLoadingCredits,
    isPurchasing,
    purchaseError,
    purchaseCredits,
    calculateCustomPackage,
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedPackage,
    setSelectedPackage
  } = useCreditPurchase()
  
  // When credit packages are loaded, select the default package (1000 credits)
  useEffect(() => {
    if (creditPackages && creditPackages.length > 0 && !selectedPackageId) {
      // Find the 1000 credit package or default to first package
      const defaultPackage = creditPackages.find(pkg => pkg.base === 1000) || creditPackages[0]
      setSelectedPackageId(defaultPackage.id)
      setSelectedPackage(defaultPackage)
    }
  }, [creditPackages, selectedPackageId, setSelectedPackage])
  
  // When selected package ID changes, update the selected package
  useEffect(() => {
    if (creditPackages && selectedPackageId) {
      const pkg = creditPackages.find(p => p.id === selectedPackageId)
      if (pkg) {
        setSelectedPackage(pkg)
        setUseCustomAmount(false)
      }
    }
  }, [selectedPackageId, creditPackages, setSelectedPackage])
  
  // Handle package selection
  const handlePackageSelect = (pkg: CreditPackage) => {
    setSelectedPackageId(pkg.id)
    playSound('pop')
  }
  
  // Handle slider change
  const handleSliderChange = (value: number) => {
    setCustomAmount(value)
    setUseCustomAmount(true)
    setSelectedPackageId(null)
    setSelectedPackage(null)
    playSound('pop')
  }
  
  // Calculate custom package details
  const customPackage: CustomPackage | null = useCustomAmount 
    ? calculateCustomPackage(customAmount) as CustomPackage 
    : null
  
  // Handle purchase button click
  const handlePurchaseClick = () => {
    setIsPaymentModalOpen(true)
    playSound('pop')
  }
  
  // Handle purchase confirmation
  const handlePurchase = (provider: PaymentProvider, method: PaymentMethod) => {
    const params = useCustomAmount
      ? { customAmount, paymentProvider: provider, paymentMethod: method }
      : { packageId: selectedPackageId!, paymentProvider: provider, paymentMethod: method }
    
    purchaseCredits(params, {
      onSuccess: () => {
        setPurchaseSuccess(true)
        playSound('reward')
      },
      onError: () => {
        playSound('error')
      }
    })
  }
  
  // Handle modal close
  const handleModalClose = () => {
    setIsPaymentModalOpen(false)
    setPurchaseSuccess(false)
  }
  
  // Loading state
  if (isLoadingPackages || isLoadingCredits) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="border-neon-pink/20">
          <CardHeader>
            <div className="h-7 bg-galaxy-purple/20 rounded w-1/3"></div>
            <div className="h-5 bg-galaxy-purple/20 rounded w-1/2"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="h-10 bg-galaxy-purple/20 rounded"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-40 bg-galaxy-purple/20 rounded"></div>
                ))}
              </div>
              <div className="h-60 bg-galaxy-purple/20 rounded"></div>
              <div className="h-12 bg-galaxy-purple/20 rounded w-full md:w-1/3 md:ml-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <Card className="border-neon-pink/20 shadow-[0_0_20px_rgba(255,0,200,0.1)]">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-neon-pink" />
            Comprar Créditos
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <CardDescription>
                    Créditos para criar e gerenciar campanhas
                  </CardDescription>
                  <Info className="w-3.5 h-3.5 text-gray-500" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple p-3">
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-sm">Conversão de valores</p>
                  <p>10 créditos = R$1,00</p>
                  <p>Cada crédito vale R$0,10</p>
                  <p className="text-gray-400 mt-1">Créditos são usados para impulsionar campanhas, alcançar mais usuários e desbloquear recursos premium.</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Credit Slider */}
            <CreditSlider
              min={500}
              max={10000}
              step={100}
              value={useCustomAmount ? customAmount : (selectedPackage?.base || 1000)}
              onChange={handleSliderChange}
            />
            
            {/* Credit Packages */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {creditPackages?.map(pkg => (
                <CreditPackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedPackageId === pkg.id}
                  onSelect={() => handlePackageSelect(pkg)}
                />
              ))}
            </div>
            
            {/* Purchase Button */}
            <div className="flex justify-end mt-6">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handlePurchaseClick}
                  className="bg-gradient-to-r from-purple-600/60 to-pink-500/60 hover:from-purple-600/80 hover:to-pink-500/80 px-8"
                  size="lg"
                  disabled={!selectedPackage && !useCustomAmount}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Comprar Créditos
                </Button>
              </motion.div>
            </div>
            
            {/* Current Credits */}
            <div className="flex items-center justify-between border-t border-gray-700 pt-4 mt-4">
              <span className="text-sm text-gray-400">Saldo atual</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{userCredits.toLocaleString()} créditos</span>
                <span className="text-xs text-gray-400">~R$ {(userCredits / 10).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <p className="text-xs text-center text-gray-400">
              Os créditos serão adicionados imediatamente após a confirmação do pagamento
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={handleModalClose}
        selectedPackage={selectedPackage}
        customPackage={customPackage}
        onPurchase={handlePurchase}
        isPurchasing={isPurchasing}
        purchaseError={purchaseError}
        purchaseSuccess={purchaseSuccess}
      />
    </div>
  )
}

export { CreditsPurchasePage } 