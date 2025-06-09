
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useCashbacks } from './useCashbacks.hook';
import { CashbackCampaign, CreateCashbackInput } from './types';

interface CashbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  editCampaign?: CashbackCampaign | null;
  advertiserId: string;
  onSuccess?: () => void;
}

export const CashbackForm: React.FC<CashbackFormProps> = ({
  isOpen,
  onClose,
  editCampaign,
  advertiserId,
  onSuccess
}) => {
  const { toast } = useToast();
  const { createCashback, updateCashback, isCreating, isUpdating } = useCashbacks(advertiserId);
  
  const [formData, setFormData] = useState<CreateCashbackInput>({
    title: '',
    description: '',
    cashback_percentage: 5,
    minimum_purchase: null,
    end_date: '',
    category: '',
    advertiser_id: advertiserId,
    advertiser_logo: '',
    is_active: true
  });

  useEffect(() => {
    if (editCampaign) {
      setFormData({
        title: editCampaign.title,
        description: editCampaign.description,
        cashback_percentage: editCampaign.cashback_percentage,
        minimum_purchase: editCampaign.min_purchase,
        end_date: editCampaign.end_date,
        category: editCampaign.category,
        advertiser_id: editCampaign.advertiser_id,
        advertiser_logo: editCampaign.advertiser_logo,
        is_active: editCampaign.is_active ?? true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cashback_percentage: 5,
        minimum_purchase: null,
        end_date: '',
        category: '',
        advertiser_id: advertiserId,
        advertiser_logo: '',
        is_active: true
      });
    }
  }, [editCampaign, advertiserId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editCampaign && editCampaign.id) {
        await updateCashback({
          id: editCampaign.id,
          ...formData
        });
        toast({
          title: 'Sucesso',
          description: 'Campanha de cashback atualizada com sucesso!'
        });
      } else {
        await createCashback(formData);
        toast({
          title: 'Sucesso', 
          description: 'Campanha de cashback criada com sucesso!'
        });
      }
      
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar campanha',
        variant: 'destructive'
      });
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editCampaign ? 'Editar Campanha' : 'Nova Campanha de Cashback'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="cashback_percentage">Percentual de Cashback (%)</Label>
            <Input
              id="cashback_percentage"
              type="number"
              min="1"
              max="100"
              value={formData.cashback_percentage}
              onChange={(e) => setFormData({ ...formData, cashback_percentage: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <Label htmlFor="minimum_purchase">Compra Mínima (R$)</Label>
            <Input
              id="minimum_purchase"
              type="number"
              min="0"
              step="0.01"
              value={formData.minimum_purchase || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                minimum_purchase: e.target.value ? Number(e.target.value) : null 
              })}
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurantes">Restaurantes</SelectItem>
                <SelectItem value="varejo">Varejo</SelectItem>
                <SelectItem value="tecnologia">Tecnologia</SelectItem>
                <SelectItem value="saude">Saúde</SelectItem>
                <SelectItem value="beleza">Beleza</SelectItem>
                <SelectItem value="servicos">Serviços</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="end_date">Data de Término</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="advertiser_logo">URL do Logo</Label>
            <Input
              id="advertiser_logo"
              type="url"
              value={formData.advertiser_logo}
              onChange={(e) => setFormData({ ...formData, advertiser_logo: e.target.value })}
              placeholder="https://exemplo.com/logo.png"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Campanha ativa</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Salvando...' : editCampaign ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
