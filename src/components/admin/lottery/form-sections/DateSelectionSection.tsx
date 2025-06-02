
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";

interface DateSelectionSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const DateSelectionSection: React.FC<DateSelectionSectionProps> = ({ form }) => (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <h3 className="text-base font-medium text-white flex items-center border-b border-galaxy-purple/20 pb-2 mb-4">
        <span className="bg-galaxy-blue/20 text-galaxy-blue p-1 rounded-md text-xs mr-2">2</span>
        Período do Sorteio
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Início</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal bg-galaxy-dark/50 border-galaxy-purple/20 ${!field.value && "text-muted-foreground"}`}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
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
                    locale={ptBR}
                    initialFocus
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
              <FormLabel>Data de Término</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={`w-full pl-3 text-left font-normal bg-galaxy-dark/50 border-galaxy-purple/20 ${!field.value && "text-muted-foreground"}`}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
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
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="isAutoScheduled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-galaxy-purple/20 p-4 space-y-0 bg-galaxy-dark/50">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Agendamento Automático</FormLabel>
              <FormDescription>
                O sorteio será realizado automaticamente 48 horas após atingir o mínimo de tickets ou ao vender todos os números.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                className="data-[state=checked]:bg-neon-pink"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </motion.div>
  );

export default DateSelectionSection;
