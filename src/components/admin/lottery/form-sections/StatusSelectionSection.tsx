
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LotteryFormValues } from '../types';

interface StatusSelectionSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const StatusSelectionSection: React.FC<StatusSelectionSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white">Status Inicial</FormLabel>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-galaxy-deep border-galaxy-purple/30">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-galaxy-deepPurple border-galaxy-purple/30">
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default StatusSelectionSection;
