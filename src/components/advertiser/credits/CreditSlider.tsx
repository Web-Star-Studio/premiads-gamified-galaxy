
import { Slider } from "@/components/ui/slider";
import { CreditSliderProps } from "./types";

const CreditSlider = ({ selectedAmount, creditPackages, onSliderChange }: CreditSliderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Selecione um pacote:</label>
        <span className="text-sm text-neon-pink">
          {creditPackages[selectedAmount[0] - 1].credits.toLocaleString()} créditos
          {creditPackages[selectedAmount[0] - 1].bonus > 0 && 
            ` (+${creditPackages[selectedAmount[0] - 1].bonus.toLocaleString()} bônus)`}
        </span>
      </div>
      
      <Slider
        value={selectedAmount}
        min={1}
        max={5}
        step={1}
        onValueChange={onSliderChange}
        className="py-4"
      />
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>500</span>
        <span>10.000</span>
      </div>
    </div>
  );
};

export default CreditSlider;
