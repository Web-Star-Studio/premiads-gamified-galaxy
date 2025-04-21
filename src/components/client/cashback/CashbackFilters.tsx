
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  CategoryFilter,
  DiscountRangeFilter,
  FilterActions,
  FilterHeader
} from './filters';

interface CashbackFiltersProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  discountRange: [number, number];
  setDiscountRange: (value: [number, number]) => void;
  clearFilters: () => void;
}

const CashbackFilters: React.FC<CashbackFiltersProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  discountRange,
  setDiscountRange,
  clearFilters
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="border-galaxy-purple/30">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass-panel">
        <SheetHeader>
          <FilterHeader />
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          
          <DiscountRangeFilter 
            discountRange={discountRange}
            setDiscountRange={setDiscountRange}
          />
        </div>
        
        <SheetFooter className="flex flex-col sm:flex-row gap-2">
          <FilterActions clearFilters={clearFilters} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CashbackFilters;
