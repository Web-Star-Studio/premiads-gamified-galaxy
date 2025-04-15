
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Form } from "@/components/ui/form";
import { useSounds } from '@/hooks/use-sounds';
import { toastSuccess, toastError } from "@/utils/toast";
import { lotteryFormSchema, LotteryFormValues, Lottery } from './types';
import BasicInfoSection from './form-sections/BasicInfoSection';
import DateSelectionSection from './form-sections/DateSelectionSection';
import StatusSelectionSection from './form-sections/StatusSelectionSection';
import FormActions from './form-sections/FormActions';

interface NewLotteryFormProps {
  onSuccess: (lottery: Lottery) => void;
  onCancel: () => void;
}

const NewLotteryForm: React.FC<NewLotteryFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playSound } = useSounds();
  
  const form = useForm<LotteryFormValues>({
    resolver: zodResolver(lotteryFormSchema),
    defaultValues: {
      name: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: 'pending',
    },
  });
  
  const onSubmit = async (values: LotteryFormValues) => {
    setIsSubmitting(true);
    
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    try {
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Criar novo sorteio (simulado)
      const newLottery: Lottery = {
        id: Date.now(), // Usar timestamp como ID temporário
        name: values.name,
        startDate: format(values.startDate, 'yyyy-MM-dd'),
        endDate: format(values.endDate, 'yyyy-MM-dd'),
        status: values.status,
        prizes: [] // Começar sem prêmios
      };
      
      toastSuccess('Sorteio criado', `O sorteio "${values.name}" foi criado com sucesso.`);
      
      try {
        playSound('reward');
      } catch (error) {
        console.log("Som não reproduzido", error);
      }
      
      onSuccess(newLottery);
    } catch (error) {
      console.error("Erro ao criar sorteio:", error);
      toastError('Erro', 'Não foi possível criar o sorteio. Tente novamente.');
      
      try {
        playSound('error');
      } catch (error) {
        console.log("Som não reproduzido", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoSection form={form} />
        <DateSelectionSection form={form} />
        <StatusSelectionSection form={form} />
        <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default NewLotteryForm;
