
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface DiscountRangeFilterProps {
  discountRange: [number, number];
  setDiscountRange: (value: [number, number]) => void;
}

const DiscountRangeFilter: React.FC<DiscountRangeFilterProps> = ({
  discountRange,
  setDiscountRange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Valor do Desconto (%)</h3>
        <span className="text-sm text-gray-400">
          {discountRange[0]} - {discountRange[1]}%
        </span>
      </div>
      <Slider
        defaultValue={[0, 100]}
        value={discountRange}
        onValueChange={(value) => setDiscountRange(value as [number, number])}
        min={0}
        max={100}
        step={5}
        className="my-4"
      />
    </div>
  );
};

export default DiscountRangeFilter;
