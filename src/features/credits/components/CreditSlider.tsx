import { useState, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import { useSounds } from '@/hooks/use-sounds'

interface CreditSliderProps {
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
}

function CreditSlider({ min, max, step, value, onChange }: CreditSliderProps) {
  const [sliderValue, setSliderValue] = useState<number[]>([value])
  const { playSound } = useSounds()
  
  useEffect(() => {
    setSliderValue([value])
  }, [value])
  
  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue)
    onChange(newValue[0])
    playSound('pop')
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

export { CreditSlider } 