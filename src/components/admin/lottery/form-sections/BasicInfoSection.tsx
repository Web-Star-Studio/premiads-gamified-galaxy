
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';

interface BasicInfoSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  return (
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
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título do Sorteio</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Ex: iPhone 15 Pro Max 256GB"
                className="bg-galaxy-dark/50 border-galaxy-purple/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="prizeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Prêmio</FormLabel>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="bg-galaxy-dark/50 border-galaxy-purple/20">
                    <SelectValue placeholder="Selecione o tipo de prêmio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electronics">Eletrônico</SelectItem>
                  <SelectItem value="travel">Viagem</SelectItem>
                  <SelectItem value="cash">Dinheiro</SelectItem>
                  <SelectItem value="service">Serviço</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder="Ex: 5000.00"
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição do Sorteio</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Descrição breve do sorteio que será exibida nos cards."
                className="bg-galaxy-dark/50 border-galaxy-purple/20 resize-none h-20"
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
                placeholder="Especificações detalhadas do prêmio e termos do sorteio."
                className="bg-galaxy-dark/50 border-galaxy-purple/20 resize-none h-32"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
            <p className="text-xs text-muted-foreground mt-1">
              Insira uma URL de imagem válida que represente o prêmio. Recomendamos proporção 16:9.
            </p>
          </FormItem>
        )}
      />
    </motion.div>
  );
};

export default BasicInfoSection;
