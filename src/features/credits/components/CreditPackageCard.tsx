
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
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
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
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
          <div className="absolute -top-3 -right-3 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded-md">
            +{bonusPercentage}%
          </div>
        )}
        
        {isSelected && (
          <div className="absolute top-2 left-2">
            <Check className="w-4 h-4 text-neon-pink" />
          </div>
        )}
        
        <div className="text-center mb-2">
          <div className="text-2xl font-bold">{base.toLocaleString()}</div>
          <div className="text-sm text-gray-400">créditos</div>
        </div>
        
        {bonus > 0 && (
          <div className="bg-neon-pink/20 rounded-md px-3 py-1 mb-3 text-center">
            <div className="text-sm font-medium text-neon-pink">+{bonus.toLocaleString()} bônus</div>
          </div>
        )}
        
        <div className="text-center mt-auto">
          <div className="text-lg font-bold">R$ {price.toFixed(2).replace('.', ',')}</div>
          <div className="text-xs text-gray-400">
            {total.toLocaleString()} créditos no total
          </div>
          <div className="text-xs text-gray-500 mt-1">
            R$ {(price / total).toFixed(3).replace('.', ',')} por crédito
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
