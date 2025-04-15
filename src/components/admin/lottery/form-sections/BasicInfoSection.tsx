
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LotteryFormValues } from '../types';

interface BasicInfoSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Nome do Sorteio</FormLabel>
          <FormControl>
            <Input placeholder="Ex: Sorteio Semanal" {...field} className="bg-galaxy-deep border-galaxy-purple/30" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BasicInfoSection;
