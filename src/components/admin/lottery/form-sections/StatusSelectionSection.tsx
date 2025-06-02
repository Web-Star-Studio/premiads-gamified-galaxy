
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { motion } from 'framer-motion';

interface StatusSelectionSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const StatusSelectionSection: React.FC<StatusSelectionSectionProps> = ({ form }) => (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="text-base font-medium text-white flex items-center border-b border-galaxy-purple/20 pb-2 mb-4">
        <span className="bg-neon-lime/20 text-neon-lime p-1 rounded-md text-xs mr-2">3</span>
        Status do Sorteio
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Inicial</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="bg-galaxy-dark/50 border-galaxy-purple/20">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Rascunho</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              <p className="text-xs text-muted-foreground mt-1">
                O status será atualizado automaticamente conforme as datas do sorteio.
              </p>
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );

export default StatusSelectionSection;
