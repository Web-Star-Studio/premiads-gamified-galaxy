import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useCashbacks } from './useCashbacks.hook';
import { CashbackCampaign, CreateCashbackInput } from './types';
import { CashbackImageUploader } from '@/components/ui/CashbackImageUploader';
import { supabase } from '@/integrations/supabase/client';

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
    cashback_percentage: 0,
    end_date: '',
    category: '',
    advertiser_id: advertiserId,
    advertiser_logo: '',
    is_active: true
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (editCampaign) {
      setFormData({
        title: editCampaign.title,
        description: editCampaign.description,
        cashback_percentage: editCampaign.cashback_percentage,
        end_date: editCampaign.end_date,
        category: editCampaign.category,
        advertiser_id: advertiserId,
        advertiser_logo: editCampaign.advertiser_logo,
        is_active: editCampaign.is_active ?? true
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cashback_percentage: 0,
        end_date: '',
        category: '',
        advertiser_id: advertiserId,
        advertiser_logo: '',
        is_active: true
      });
    }
    setImageFile(null);
  }, [editCampaign, advertiserId]);

  const uploadImageToSupabase = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cashback/${advertiserId}/${Date.now()}.${fileExt}`;
      
      // Try cashback-images bucket first, fallback to raffle-images
      const bucketName = 'cashback-images'; // Change to 'raffle-images' if needed
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        // If cashback-images bucket doesn't exist, try raffle-images
        if (bucketName === 'cashback-images' && uploadError.message.includes('not found')) {
          const { error: fallbackError } = await supabase.storage
            .from('raffle-images')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });
          
          if (fallbackError) throw fallbackError;
          
          const { data: publicUrlData } = supabase.storage
            .from('raffle-images')
            .getPublicUrl(fileName);
            
          return publicUrlData.publicUrl;
        }
        
        throw uploadError;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
        
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw new Error('Falha ao fazer upload da imagem');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalFormData = { ...formData };
      
      // Se há um arquivo de imagem, fazer upload
      if (imageFile) {
        setIsUploadingImage(true);
        const uploadedImageUrl = await uploadImageToSupabase(imageFile);
        finalFormData.advertiser_logo = uploadedImageUrl;
      }
      
      if (editCampaign && editCampaign.id) {
        await updateCashback({
          id: editCampaign.id,
          ...finalFormData
        });
        toast({
          title: 'Sucesso',
          description: 'Campanha de cashback atualizada com sucesso!'
        });
      } else {
        await createCashback(finalFormData);
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
    } finally {
      setIsUploadingImage(false);
    }
  };

  const isLoading = isCreating || isUpdating || isUploadingImage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editCampaign ? 'Editar Campanha' : 'Nova Campanha de Cashback'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da campanha de cashback. A imagem será exibida como capa do cupom no marketplace.
          </DialogDescription>
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

          <CashbackImageUploader
            onFileChange={setImageFile}
            initialImage={editCampaign?.advertiser_logo}
            label="Imagem do Cupom"
            className="w-full"
          />

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
