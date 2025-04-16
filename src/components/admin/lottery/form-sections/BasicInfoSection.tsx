
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';

interface BasicInfoSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">Informações Básicas</h3>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="name">Nome do Sorteio</FormLabel>
            <FormControl>
              <Input
                {...field}
                id="name"
                placeholder="Ex: Sorteio de Smartphone Premium"
                className="bg-galaxy-dark/50 border-galaxy-purple/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInfoSection;
