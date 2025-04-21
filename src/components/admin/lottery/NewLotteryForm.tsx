
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
import NumbersSection from './form-sections/NumbersSection';
import FormActions from './form-sections/FormActions';
import { Card } from '@/components/ui/card';

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
      description: '',
      detailedDescription: '',
      prizeType: '',
      prizeValue: 0,
      imageUrl: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: 'pending',
      numbersTotal: 1000,
      pointsPerNumber: 100,
      minPoints: 0,
      isAutoScheduled: true,
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
        id: `${Date.now()}`, // Usar timestamp como ID temporário
        title: values.name,
        name: values.name,
        description: values.description,
        detailed_description: values.detailedDescription,
        detailedDescription: values.detailedDescription,
        prize_type: values.prizeType,
        prizeType: values.prizeType,
        prize_value: values.prizeValue,
        prizeValue: values.prizeValue,
        type: 'regular',
        imageUrl: values.imageUrl,
        start_date: format(values.startDate, 'yyyy-MM-dd'),
        startDate: format(values.startDate, 'yyyy-MM-dd'),
        end_date: format(values.endDate, 'yyyy-MM-dd'),
        endDate: format(values.endDate, 'yyyy-MM-dd'),
        draw_date: values.drawDate ? format(values.drawDate, 'yyyy-MM-dd') : format(values.endDate, 'yyyy-MM-dd'),
        drawDate: values.drawDate ? format(values.drawDate, 'yyyy-MM-dd') : format(values.endDate, 'yyyy-MM-dd'),
        status: values.status,
        numbers_total: values.numbersTotal,
        numbersTotal: values.numbersTotal,
        points: values.pointsPerNumber,
        pointsPerNumber: values.pointsPerNumber,
        minPoints: values.minPoints,
        isAutoScheduled: values.isAutoScheduled,
        minPointsReachedAt: null,
        prizes: [], // Começar sem prêmios
        progress: 0, // 0% inicial
        numbersSold: 0, // Nenhum número vendido inicialmente
        numbers: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        winner: null
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 p-4">
          <BasicInfoSection form={form} />
          <div className="my-8 border-t border-galaxy-purple/10"></div>
          <NumbersSection form={form} />
          <div className="my-8 border-t border-galaxy-purple/10"></div>
          <DateSelectionSection form={form} />
          <div className="my-8 border-t border-galaxy-purple/10"></div>
          <StatusSelectionSection form={form} />
        </Card>
        <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
      </form>
    </Form>
  );
};

export default NewLotteryForm;
