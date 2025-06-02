import { useSounds } from '@/hooks/use-sounds'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus } from 'lucide-react'
import { CreditPackage } from '../useCreditPurchase.hook'

interface CreditSliderProps {
  min?: number
  max?: number
  step?: number
  value?: number
  onChange?: (value: number) => void
  packages?: CreditPackage[]
  selectedPackage?: CreditPackage | null
  setSelectedPackage?: (pkg: CreditPackage) => void
}

export function CreditSlider({ 
  min = 100, 
  max = 10000, 
  step = 100, 
  value = 1000, 
  onChange,
  packages = [],
  selectedPackage,
  setSelectedPackage
}: CreditSliderProps) {
  const { playSound } = useSounds()
  
  // Find the package with credit amount closest to a given value
  const findNearestPackage = (val: number): CreditPackage | undefined => {
    if (!packages.length) return undefined
    return packages.reduce((prev, curr) => {
      const prevDiff = Math.abs((prev.base + prev.bonus) - val)
      const currDiff = Math.abs((curr.base + curr.bonus) - val)
      return currDiff < prevDiff ? curr : prev
    })
  }

  const handleDecrease = () => {
    const newValue = Math.max(min, (value || min) - step)
    onChange && onChange(newValue)
    if (packages.length && setSelectedPackage) {
      const nearest = findNearestPackage(newValue)
      nearest && setSelectedPackage(nearest)
    }
    playSound('pop')
  }

  const handleIncrease = () => {
    const newValue = Math.min(max, (value || min) + step)
    onChange && onChange(newValue)
    if (packages.length && setSelectedPackage) {
      const nearest = findNearestPackage(newValue)
      nearest && setSelectedPackage(nearest)
    }
    playSound('pop')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseInt(e.target.value)
    if (!isNaN(num) && num >= min && num <= max) {
      onChange && onChange(num)
      if (packages.length && setSelectedPackage) {
        const nearest = findNearestPackage(num)
        nearest && setSelectedPackage(nearest)
      }
      playSound('pop')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Selecione um pacote:</span>
        <span className="text-sm font-medium">{value.toLocaleString()} rifas</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleDecrease}>
          <Minus className="w-4 h-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          className="w-24 text-center bg-galaxy-darkPurple border-galaxy-purple/50"
        />
        <Button variant="outline" size="icon" onClick={handleIncrease}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}
