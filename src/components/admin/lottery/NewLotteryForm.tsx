
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Lottery } from './LotteryList';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toastSuccess, toastError } from "@/utils/toast";
import { useSounds } from '@/hooks/use-sounds';
import ButtonLoadingSpinner from '@/components/ui/ButtonLoadingSpinner';

// Schema de validação
const formSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  startDate: z.date({ required_error: 'Data de início é obrigatória' }),
  endDate: z.date({ required_error: 'Data de término é obrigatória' }),
  status: z.enum(['active', 'pending'], { required_error: 'Status é obrigatório' }),
});

type FormSchema = z.infer<typeof formSchema>;

interface NewLotteryFormProps {
  onSuccess: (lottery: Lottery) => void;
  onCancel: () => void;
}

const NewLotteryForm: React.FC<NewLotteryFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playSound } = useSounds();
  
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      status: 'pending',
    },
  });
  
  const onSubmit = async (values: FormSchema) => {
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
  
  const handleCancel = () => {
    try {
      playSound('pop');
    } catch (error) {
      console.log("Som não reproduzido", error);
    }
    onCancel();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Nome do Sorteio</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sorteio Semanal" {...field} className="bg-galaxy-deep border-galaxy-purple/30" />
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
              <FormItem className="flex flex-col">
                <FormLabel className="text-white">Data de Início</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal bg-galaxy-deep border-galaxy-purple/30",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-galaxy-deepPurple border-galaxy-purple/30" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
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
                <FormLabel className="text-white">Data de Término</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal bg-galaxy-deep border-galaxy-purple/30",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy", { locale: pt })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-galaxy-deepPurple border-galaxy-purple/30" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => 
                        date < new Date() || 
                        (form.getValues().startDate && date < form.getValues().startDate)
                      }
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
        
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-neon-cyan/30 text-white transition-all duration-200"
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            className="bg-neon-pink hover:bg-neon-pink/80 transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mr-2"></span>
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
