import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CreateCashbackInput } from './types';

interface CashbackFormProps {
  onSuccess?: () => void;
}

const CashbackForm = ({ onSuccess }: CashbackFormProps) => {
  const [formData, setFormData] = useState<CreateCashbackInput>({
    title: '',
    description: '',
    cashback_percentage: 0,
    minimum_purchase: 0,
    category: '',
    start_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('cashback_campaigns')
        .insert([{
          title: formData.title,
          description: formData.description,
          cashback_percentage: formData.cashback_percentage,
          min_purchase: formData.minimum_purchase || 0,
          category: formData.category,
          start_date: formData.start_date,
          end_date: formData.end_date,
          advertiser_id: user.id,
          is_active: true
        }]);

      if (error) throw error;

      toast({
        title: 'Campanha criada com sucesso!',
        description: 'Sua campanha de cashback foi criada e está ativa.',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        cashback_percentage: 0,
        minimum_purchase: 0,
        category: '',
        start_date: '',
        end_date: ''
      });

      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating cashback campaign:', error);
      toast({
        title: 'Erro ao criar campanha',
        description: error.message || 'Ocorreu um erro ao criar a campanha',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'varejo', label: 'Varejo' },
    { value: 'servicos', label: 'Serviços' },
    { value: 'alimentacao', label: 'Alimentação' },
    { value: 'entretenimento', label: 'Entretenimento' },
    { value: 'outros', label: 'Outros' },
  ];

  return (
    <Card className="border-galaxy-purple/30 bg-galaxy-darkPurple/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-heading neon-text-cyan">
          Criar Campanha de Cashback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">
              Título da Campanha
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Ex: Cashback de Natal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">
              Descrição
            </Label>
            <Textarea
              id="description"
              placeholder="Ex: Ganhe 10% de volta em todas as compras"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 min-h-[100px]"
              required
            />
          </div>
          <div>
            <Label htmlFor="cashback_percentage" className="text-white">
              Porcentagem de Cashback
            </Label>
            <Input
              id="cashback_percentage"
              type="number"
              placeholder="Ex: 10"
              value={formData.cashback_percentage === 0 ? '' : formData.cashback_percentage}
              onChange={(e) => setFormData({ ...formData, cashback_percentage: Number(e.target.value) })}
              className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
              required
            />
          </div>
          <div>
            <Label htmlFor="minimum_purchase" className="text-white">
              Valor Mínimo da Compra
            </Label>
            <Input
              id="minimum_purchase"
              type="number"
              placeholder="Ex: 50"
              value={formData.minimum_purchase === 0 ? '' : formData.minimum_purchase}
              onChange={(e) => setFormData({ ...formData, minimum_purchase: Number(e.target.value) })}
              className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
              required
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-white">
              Categoria
            </Label>
            <Select
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              defaultValue={formData.category}
            >
              <SelectTrigger className="bg-galaxy-deepPurple/50 border-galaxy-purple/30">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-white">
                Data de Início
              </Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="text-white">
                Data de Término
              </Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-neon-cyan to-neon-pink hover:from-neon-cyan/80 hover:to-neon-pink/80"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Campanha'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CashbackForm;
