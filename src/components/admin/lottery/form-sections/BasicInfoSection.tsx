import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from 'react-hook-form';
import { LotteryFormValues } from '../types';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BasicInfoSectionProps {
  form: UseFormReturn<LotteryFormValues>;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ form }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('imageFile', file);
      
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Clear the URL field since we're using a file
      form.setValue('imageUrl', '');
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const clearImagePreview = () => {
    setPreviewUrl(null);
    form.setValue('imageFile', undefined);
  };

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
            name="imageFile"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Imagem do Prêmio</FormLabel>
                <FormControl>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        {...field}
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="flex items-center justify-center h-10 px-4 py-2 rounded-md border border-galaxy-purple/30 bg-galaxy-dark/50 text-sm cursor-pointer transition-colors hover:bg-galaxy-purple/10 hover:border-galaxy-purple/50"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Escolher imagem
                      </label>
                      {previewUrl && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={clearImagePreview}
                          className="border-galaxy-purple/30 hover:bg-red-600/20 hover:border-red-500/50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remover
                        </Button>
                      )}
                    </div>
                    {previewUrl && (
                      <div className="mt-2 relative w-full max-w-xs">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="w-full h-auto max-h-32 object-contain rounded-md border border-galaxy-purple/30" 
                        />
                      </div>
                    )}
                  </div>
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
}

export default BasicInfoSection;
