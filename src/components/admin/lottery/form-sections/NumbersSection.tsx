
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { motion } from 'framer-motion';

interface NumbersSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const NumbersSection: React.FC<NumbersSectionProps> = ({ form }) => (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className="text-base font-medium text-white flex items-center border-b border-galaxy-purple/20 pb-2 mb-4">
        <span className="bg-neon-cyan/20 text-neon-cyan p-1 rounded-md text-xs mr-2">2</span>
        Configurações de Números
      </h3>
      
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
                  placeholder="Ex: 0 (sem mínimo)"
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                0 = 60% do custo automático
              </p>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );

export default NumbersSection;
