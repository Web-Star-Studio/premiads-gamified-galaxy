
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';

interface StatusSelectionSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const StatusSelectionSection: React.FC<StatusSelectionSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Status do Sorteio</h3>
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
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
                <SelectItem value="pending">Pendente</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default StatusSelectionSection;
