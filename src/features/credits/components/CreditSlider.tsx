
import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { useSounds } from '@/hooks/use-sounds'
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
  const [sliderValue, setSliderValue] = useState<number[]>([value])
  const { playSound } = useSounds()
  
  useEffect(() => {
    if (value) setSliderValue([value])
  }, [value])
  
  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue)
    if (onChange) onChange(newValue[0])
    
    // If we have packages and setSelectedPackage function, find nearest package
    if (packages && packages.length > 0 && setSelectedPackage) {
      const nearestPackage = findNearestPackage(newValue[0])
      if (nearestPackage && (!selectedPackage || nearestPackage.id !== selectedPackage.id)) {
        setSelectedPackage(nearestPackage)
      }
    }
    
    playSound('pop')
  }
  
  // Find the package with credit amount closest to the slider value
  const findNearestPackage = (value: number): CreditPackage | undefined => {
    if (!packages || !packages.length) return undefined
    
    return packages.reduce((prev, curr) => {
      const prevDiff = Math.abs((prev.base + prev.bonus) - value)
      const currDiff = Math.abs((curr.base + curr.bonus) - value)
      return currDiff < prevDiff ? curr : prev
    })
  }
  
  // Calculate percentage for gradient background
  const percentage = ((sliderValue[0] - min) / (max - min)) * 100
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Selecione um pacote:</span>
        <span className="text-sm font-medium">{sliderValue[0].toLocaleString()} créditos</span>
      </div>
      
      <div className="px-1">
        <Slider
          defaultValue={sliderValue}
          value={sliderValue}
          max={max}
          min={min}
          step={step}
          onValueChange={handleSliderChange}
          className="[&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
          style={{
            background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${percentage}%, rgba(124, 58, 237, 0.2) ${percentage}%, rgba(124, 58, 237, 0.2) 100%)`
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
      </div>
    </div>
  )
}
