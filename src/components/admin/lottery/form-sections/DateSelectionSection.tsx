
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, InfoIcon } from "lucide-react";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

interface DateSelectionSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const DateSelectionSection: React.FC<DateSelectionSectionProps> = ({ form }) => {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <h3 className="text-base font-medium text-white flex items-center border-b border-galaxy-purple/20 pb-2 mb-4">
        <span className="bg-neon-orange/20 text-neon-orange p-1 rounded-md text-xs mr-2">4</span>
        Datas e Agendamento
      </h3>

      <Alert className="bg-galaxy-purple/10 border-galaxy-purple/30">
        <InfoIcon className="h-4 w-4 text-neon-cyan" />
        <AlertDescription className="text-sm">
          O sorteio será automaticamente agendado para 48 horas após atingir o número mínimo de pontos definido.
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="isAutoScheduled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-galaxy-purple/20 p-3 shadow-sm bg-galaxy-dark/30">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Agendamento Automático</FormLabel>
              <FormDescription>
                Sorteio ocorrerá 48h após atingir meta de pontos
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data Inicial</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal bg-galaxy-dark/50 border-galaxy-purple/20",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione data inicial</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data Final</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal bg-galaxy-dark/50 border-galaxy-purple/20",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione data final</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < (form.getValues("startDate") || new Date())}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </motion.div>
  );
};

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
});
FormDescription.displayName = "FormDescription";

export default DateSelectionSection;
