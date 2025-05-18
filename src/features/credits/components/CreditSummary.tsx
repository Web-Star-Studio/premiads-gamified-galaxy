
import { Card, CardContent } from '@/components/ui/card'
import { CreditPackage } from '../useCreditPurchase.hook'
import { InfoIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface CreditSummaryProps {
  selectedPackage: CreditPackage | null
  customPackage?: { base: number; bonus: number; total: number; price: number }
  paymentMethod?: string
}

export function CreditSummary({ selectedPackage, customPackage, paymentMethod }: CreditSummaryProps) {
  // Use either the selected package or custom package
  const pkg = customPackage || selectedPackage
  
  if (!pkg) return null
  
  const { base, bonus, price } = pkg
  const total = base + bonus
  const pricePerCredit = price / total
  
  return (
    <Card className="border-galaxy-purple/30 bg-galaxy-deepPurple/20">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">Resumo</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Créditos base</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-3.5 h-3.5 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple">
                    <p className="text-xs">Quantidade base de créditos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">{base.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Bônus</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-3.5 h-3.5 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple">
                    <p className="text-xs">Créditos extras incluídos no pacote</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium text-neon-pink">+{bonus.toLocaleString()}</span>
          </div>
          
          <div className="border-t border-gray-700 my-2 pt-2"></div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Total de créditos</span>
            </div>
            <span className="font-medium">{total.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Valor total</span>
            </div>
            <span className="font-medium">R$ {price.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Preço por crédito</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="w-3.5 h-3.5 text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-galaxy-darkPurple border-galaxy-purple">
                    <p className="text-xs">Valor dividido pelo total de créditos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">R$ {pricePerCredit.toFixed(3).replace('.', ',')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-400">Validade</span>
            </div>
            <span className="font-medium">12 meses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
