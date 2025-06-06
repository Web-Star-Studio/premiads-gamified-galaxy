
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CashbackCampaign, CreateCashbackInput } from './types'
import { useCashbacks } from './useCashbacks.hook'
import { CashbackPreview } from './CashbackPreview'
import { ImageUploader } from '@/components/ui/ImageUploader'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'react-hot-toast'

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const schema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres."),
  description: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres."),
  cashback_percentage: z.number().min(5).max(100), // Atualizado
  minimum_purchase: z.number().min(0).nullable(),
  end_date: z.string().min(1, "A data de validade é obrigatória."),
  category: z.string().min(1, "A categoria é obrigatória."),
  advertiser_logo: z.any()
    .refine((file) => file, "A imagem é obrigatória.")
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `O tamanho máximo é 2MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Apenas .jpg, .jpeg, .png and .webp são permitidos."
    ),
}).superRefine((val, ctx) => {
  if (val.cashback_percentage < 100 && (val.minimum_purchase === null || val.minimum_purchase === undefined)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Obrigatório se percentual < 100%',
      path: ['minimum_purchase']
    })
  }
})

export type FormData = z.infer<typeof schema>

interface CashbackFormProps {
  advertiserId: string
  initialData?: CashbackCampaign | null
  onClose: () => void
}

function CashbackForm({ advertiserId, initialData, onClose }: CashbackFormProps) {
  const isEdit = !!initialData
  const { createCashback, updateCashback, isCreating, isUpdating } = useCashbacks(advertiserId)
  
  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      ...initialData,
      minimum_purchase: initialData.min_purchase ?? 0,
    } : {
      title: '',
      description: '',
      cashback_percentage: 10, // Atualizado
      minimum_purchase: 0,
      end_date: '',
      category: '',
      advertiser_logo: null
    }
  })

  const watchedValues = watch()
  
  useEffect(() => {
    if (initialData?.advertiser_logo) {
      setValue('advertiser_logo', initialData.advertiser_logo)
    }
  }, [initialData, setValue])

  async function onSubmit(values: FormData) {
    try {
      let imageUrl = values.advertiser_logo;

      if (values.advertiser_logo && typeof values.advertiser_logo !== 'string') {
        const file = values.advertiser_logo;
        const filePath = `public/cashback-icons/${advertiserId}-${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('campaigns')
          .upload(filePath, file);

        if (uploadError) {
          throw new Error('Falha no upload da imagem: ' + uploadError.message);
        }

        const { data: { publicUrl } } = supabase.storage
          .from('campaigns')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      if (isEdit) {
        const dataToSave: CashbackCampaign = {
          ...initialData,
          ...values,
          advertiser_logo: imageUrl,
          advertiser_id: advertiserId,
        };
        await updateCashback(dataToSave);
        toast.success('Cashback atualizado com sucesso!');
      } else {
        const dataToSave: CreateCashbackInput = {
          title: values.title,
          description: values.description,
          cashback_percentage: values.cashback_percentage, // Atualizado
          minimum_purchase: values.minimum_purchase,
          end_date: values.end_date,
          category: values.category,
          advertiser_logo: imageUrl,
          advertiser_id: advertiserId,
          is_active: true,
        };
        await createCashback(dataToSave);
        toast.success('Cashback criado com sucesso!');
      }
      onClose();
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar cashback.');
    }
  }

  const isLoading = isSubmitting || isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {/* Coluna da Esquerda */}
      <div className="space-y-6 md:col-span-1">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="title">Título do Cupom</label>
          <Input id="title" {...register('title')} placeholder="Ex: 10% OFF em Beleza" />
          {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="description">Descrição</label>
          <Input id="description" {...register('description')} placeholder="Descrição breve do seu cupom" />
          {errors.description && <div className="text-xs text-red-500 mt-1">{errors.description.message}</div>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="end_date">Validade</label>
            <Input id="end_date" type="date" {...register('end_date')} />
            {errors.end_date && <div className="text-xs text-red-500 mt-1">{errors.end_date.message}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="moda">Moda</SelectItem>
                    <SelectItem value="beleza">Beleza</SelectItem>
                    <SelectItem value="tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <div className="text-xs text-red-500 mt-1">{errors.category.message}</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Percentual de Cashback</label>
          <input 
            type="range" 
            min={5} 
            max={100} 
            step={1} 
            {...register('cashback_percentage', { valueAsNumber: true })} 
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer" 
          />
          <div className="text-sm mt-1 text-right font-medium">{watchedValues.cashback_percentage}%</div>
          {errors.cashback_percentage && <div className="text-xs text-red-500">{errors.cashback_percentage.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="minimum_purchase">Valor Mínimo (R$)</label>
          <Input
            id="minimum_purchase"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register('minimum_purchase', { valueAsNumber: true, required: false })}
            disabled={watchedValues.cashback_percentage === 100}
          />
          {errors.minimum_purchase && <div className="text-xs text-red-500 mt-1">{errors.minimum_purchase.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Ícone do Cashback</label>
          <Controller
            name="advertiser_logo"
            control={control}
            render={({ field }) => (
              <ImageUploader 
                onFileChange={(file) => field.onChange(file)}
                initialImage={typeof field.value === 'string' ? field.value : null}
              />
            )}
          />
          {errors.advertiser_logo && <div className="text-xs text-red-500 mt-1">{errors.advertiser_logo.message as string}</div>}
        </div>
      </div>
      
      {/* Coluna da Direita (Preview) */}
      <div className="space-y-6 md:col-span-1">
        <label className="block text-sm font-medium">Pré-visualização</label>
        <div className="sticky top-6">
          <CashbackPreview data={watchedValues} />
        </div>
      </div>

      {/* Ações do Formulário */}
      <div className="md:col-span-2 flex justify-end gap-3 mt-4">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancelar</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : (isEdit ? 'Salvar Alterações' : 'Criar Cupom')}
        </Button>
      </div>
    </form>
  )
}

export default CashbackForm
