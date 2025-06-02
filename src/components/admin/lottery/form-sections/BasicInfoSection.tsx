
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { motion } from 'framer-motion';

interface BasicInfoSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-base font-medium text-white flex items-center border-b border-galaxy-purple/20 pb-2 mb-4">
        <span className="bg-neon-pink/20 text-neon-pink p-1 rounded-md text-xs mr-2">1</span>
        Informações Básicas
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Sorteio</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ex: iPhone 15 Pro Max" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="prizeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Prêmio</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="Ex: Eletrônico, Viagem, etc" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Imagem</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="https://exemplo.com/imagem.jpg" 
                    className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="prizeValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor do Prêmio (R$)</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  type="number"
                  placeholder="Ex: 1999.90" 
                  className="bg-galaxy-dark/50 border-galaxy-purple/20"
                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Curta</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Breve descrição do sorteio" 
                className="resize-none bg-galaxy-dark/50 border-galaxy-purple/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="detailedDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição Detalhada</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Descrição completa e detalhada do sorteio e do prêmio" 
                className="resize-none min-h-[100px] bg-galaxy-dark/50 border-galaxy-purple/20"
                value={field.value || ''}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );

export default BasicInfoSection;
