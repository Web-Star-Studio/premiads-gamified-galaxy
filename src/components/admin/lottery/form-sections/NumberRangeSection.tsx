import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { motion } from 'framer-motion';
import { Hash } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface NumberRangeSectionProps {
  form: UseFormReturn<LotteryFormValues>;
  onTestGenerator?: () => void;
}

const NumberRangeSection: React.FC<NumberRangeSectionProps> = ({ form, onTestGenerator }) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-base font-medium text-white flex items-center border-b border-galaxy-purple/20 pb-2 mb-4">
        <span className="bg-neon-cyan/20 text-neon-cyan p-1 rounded-md text-xs mr-2">2</span>
        Configurações de Números
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="numberRange.min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Mínimo</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number"
                  placeholder="Ex: 1" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                  value={field.value || 1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="numberRange.max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número Máximo</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number"
                  placeholder="Ex: 10000" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  onChange={e => field.onChange(parseInt(e.target.value) || 1000)}
                  value={field.value || 1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex items-end pb-1">
          <Button
            type="button"
            variant="outline"
            onClick={onTestGenerator}
            className="w-full border-neon-cyan/30 bg-neon-cyan/10 hover:bg-neon-cyan/20"
          >
            <Hash className="mr-2 h-4 w-4" />
            Testar Gerador
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="numbersTotal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de Números</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number"
                  placeholder="Ex: 1000" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="pointsPerNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontos por Número</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number"
                  placeholder="Ex: 100" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="minPoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pontuação Mínima</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number"
                  placeholder="Ex: 0" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormDescription className="text-xs">
                0 = 50% do custo automático
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="isAutoScheduled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-galaxy-purple/30 p-3 shadow-sm bg-galaxy-dark/30">
            <div className="space-y-0.5">
              <FormLabel>Agendamento Automático</FormLabel>
              <FormDescription className="text-xs">
                O sorteio será realizado automaticamente 72 horas após atingir o mínimo de tickets ou ao vender todos os números.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </motion.div>
  );
};

export default NumberRangeSection; 