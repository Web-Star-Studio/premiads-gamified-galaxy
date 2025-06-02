import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check, Sparkles, TrendingUp } from 'lucide-react'
import { CreditPackage } from '../useCreditPurchase.hook'

interface CreditPackageCardProps {
  pkg: CreditPackage
  isSelected: boolean
  onSelect: () => void
}

export function CreditPackageCard({ pkg, isSelected, onSelect }: CreditPackageCardProps) {
  const { base, bonus, price } = pkg
  const total = base + bonus
  const bonusPercentage = bonus > 0 ? Math.round((bonus / base) * 100) : 0
  
  // Calculate value indicator (price per credit)
  const pricePerCredit = price / total
  const valueIndicator = pricePerCredit <= 0.09 ? 'MELHOR VALOR' : ''
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="h-full"
    >
      <Card 
        className={cn(
          'relative cursor-pointer border-2 transition-all duration-200 p-4 flex flex-col items-center justify-between h-full',
          isSelected 
            ? 'border-neon-pink shadow-[0_0_15px_rgba(255,0,200,0.3)] bg-galaxy-deepPurple/40' 
            : 'border-galaxy-purple/30 hover:border-neon-pink/50 bg-galaxy-deepPurple/20'
        )}
      >
        {bonusPercentage > 0 && (
          <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded-md shadow-lg">
            +{bonusPercentage}% BÔNUS
          </div>
        )}
        
        {valueIndicator && (
          <div className="absolute -top-3 -left-3 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg">
            <TrendingUp className="w-3 h-3" />
            {valueIndicator}
          </div>
        )}
        
        {isSelected && (
          <div className="absolute top-2 left-2">
            <Check className="w-4 h-4 text-neon-pink" />
          </div>
        )}
        
        <div className="text-center mb-3 mt-2">
          <div className="text-2xl font-bold">{base.toLocaleString()}</div>
          <div className="text-sm text-gray-400">rifas</div>
        </div>
        
        {bonus > 0 && (
          <div className="bg-neon-pink/20 rounded-md px-3 py-1.5 mb-3 text-center flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-neon-pink" />
            <div className="text-sm font-medium text-neon-pink">+{bonus.toLocaleString()} bônus</div>
          </div>
        )}
        
        <div className="text-center mt-auto w-full">
          <div className="text-lg font-bold">R$ {(price / 10).toFixed(2).replace('.', ',')}</div>
          <div className="text-xs text-gray-400 mt-1">
            {total.toLocaleString()} rifas no total
          </div>
          <div className="text-xs text-gray-500 mt-1">
            R$ {(price / 10 / total).toFixed(3).replace('.', ',')} por rifa
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
