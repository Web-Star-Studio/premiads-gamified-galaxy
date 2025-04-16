
import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

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
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Filtre os cupons de cashback por diferentes critérios
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Categoria</h3>
            <Select 
              value={selectedCategory} 
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
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
        </div>
        
        <SheetFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="w-full"
          >
            Limpar Filtros
          </Button>
          <SheetClose asChild>
            <Button className="w-full">Aplicar Filtros</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CashbackFilters;
