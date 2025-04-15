
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toastSuccess, toastError } from "@/utils/toast";
import { useSounds } from "@/hooks/use-sounds";

// Schema para validação do formulário
const lotterySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  startDate: z.string().min(1, "Data de início é obrigatória"),
  endDate: z.string().min(1, "Data de término é obrigatória"),
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: "A data de término deve ser posterior à data de início",
  path: ["endDate"], 
});

type LotteryFormValues = z.infer<typeof lotterySchema>;

interface NewLotteryFormProps {
  onSuccess: (newLottery: any) => void;
  onCancel: () => void;
}

const NewLotteryForm: React.FC<NewLotteryFormProps> = ({ onSuccess, onCancel }) => {
  const { playSound } = useSounds();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const form = useForm<LotteryFormValues>({
    resolver: zodResolver(lotterySchema),
    defaultValues: {
      name: '',
      startDate: new Date().toISOString().split('T')[0], // Data atual como padrão
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Uma semana depois como padrão
    },
  });

  const onSubmit = async (data: LotteryFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Aqui seria feita a inserção no banco de dados
      // Como estamos usando dados fictícios por enquanto, vamos simular
      const newLottery = {
        id: Math.floor(Math.random() * 1000), // ID temporário
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        status: 'pending',
        prizes: [],
      };
      
      // Simular um pequeno atraso como se estivesse salvando
      await new Promise(resolve => setTimeout(resolve, 800));
      
      playSound('chime');
      toastSuccess('Sorteio criado', 'O novo sorteio foi criado com sucesso.');
      onSuccess(newLottery);
    } catch (error) {
      console.error('Erro ao criar sorteio:', error);
      playSound('error');
      toastError('Erro', 'Não foi possível criar o sorteio. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Sorteio</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sorteio Semanal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" {...field} />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" {...field} />
                    <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-neon-pink hover:bg-neon-pink/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              'Criar Sorteio'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewLotteryForm;
