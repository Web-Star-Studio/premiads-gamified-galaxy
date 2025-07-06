import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Form } from "@/components/ui/form";
import { useSounds } from '@/hooks/use-sounds';
import { toast } from "@/hooks/use-toast";
import { lotteryFormSchema, LotteryFormValues, Lottery } from './types';
import BasicInfoSection from './form-sections/BasicInfoSection';
import DateSelectionSection from './form-sections/DateSelectionSection';
import StatusSelectionSection from './form-sections/StatusSelectionSection';
import NumberRangeSection from './form-sections/NumberRangeSection';
import FormActions from './form-sections/FormActions';
import { Card } from '@/components/ui/card';
import NumberGenerator from './NumberGenerator';
import { adminRaffleService } from '@/services/admin-raffles';

interface NewLotteryFormProps {
  onSuccess: (lottery: Lottery) => void;
  onCancel: () => void;
}

const NewLotteryForm: React.FC<NewLotteryFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNumberGenerator, setShowNumberGenerator] = useState(false);
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
      numberRange: {
        min: 1,
        max: 10000
      },
      isAutoScheduled: true,
    },
  });
  
  const onTestGenerator = () => {
    const { min, max } = form.getValues().numberRange;
    
    if (min >= max) {
      toast({
        title: 'Erro',
        description: 'O número mínimo deve ser menor que o máximo.',
        variant: 'destructive'
      });
      return;
    }
    
    setShowNumberGenerator(true);
    playSound('pop');
  };
  
  const onSubmit = async (values: LotteryFormValues) => {
    setIsSubmitting(true);
    
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    
    try {
      // Upload image and create raffle using admin service
      const newLottery = await adminRaffleService.createRaffle(values, values.imageFile);
      
      toast({
        title: 'Sorteio criado',
        description: `O sorteio "${values.name}" foi criado com sucesso.`
      });
      
      try {
        playSound('reward');
      } catch (error) {
        console.log("Som não reproduzido", error);
      }
      
      onSuccess(newLottery);
    } catch (error) {
      console.error("Erro ao criar sorteio:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o sorteio. Tente novamente.',
        variant: 'destructive'
      });
      
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
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 p-4">
            <BasicInfoSection form={form} />
            <div className="my-8 border-t border-galaxy-purple/10"></div>
            <NumberRangeSection form={form} onTestGenerator={onTestGenerator} />
            <div className="my-8 border-t border-galaxy-purple/10"></div>
            <DateSelectionSection form={form} />
            <div className="my-8 border-t border-galaxy-purple/10"></div>
            <StatusSelectionSection form={form} />
          </Card>
          <FormActions isSubmitting={isSubmitting} onCancel={onCancel} />
        </form>
      </Form>
      
      <NumberGenerator 
        isVisible={showNumberGenerator}
        onClose={() => setShowNumberGenerator(false)}
        min={form.getValues().numberRange.min}
        max={form.getValues().numberRange.max}
      />
    </>
  );
};

export default NewLotteryForm;
