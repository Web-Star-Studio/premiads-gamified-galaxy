import { useState } from 'react'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CashbackCampaign, CreateCashbackInput } from './types'
import { useCashbacks } from './useCashbacks.hook'
import { CashbackPreview } from './CashbackPreview'

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  discount_percentage: z.number().min(5).max(100),
  minimum_purchase: z.number().min(0).nullable(),
  end_date: z.string().min(1),
  category: z.string().min(1),
  advertiser_logo: z.string().url()
}).superRefine((val, ctx) => {
  if (val.discount_percentage < 100 && (val.minimum_purchase === null || val.minimum_purchase === undefined)) {
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
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData ? {
      ...initialData,
      minimum_purchase: initialData.minimum_purchase ?? 0,
      title: initialData.title || '',
      description: initialData.description || '',
      discount_percentage: initialData.discount_percentage || 10,
      end_date: initialData.end_date || '',
      category: initialData.category || '',
      advertiser_logo: initialData.advertiser_logo || ''
    } : {
      title: '',
      description: '',
      discount_percentage: 10,
      minimum_purchase: 0,
      end_date: '',
      category: '',
      advertiser_logo: ''
    }
  })

  const watchedValues = watch()

  async function onSubmit(values: FormData) {
    setError(null)
    try {
      if (isEdit && initialData) {
        const dataToUpdate = { 
          ...values, 
          id: initialData.id, 
          advertiser_id: advertiserId,
          is_active: initialData.is_active
        }
        await updateCashback(dataToUpdate)
      } else {
        const dataToSave: CreateCashbackInput = {
          ...values,
          advertiser_id: advertiserId,
          is_active: true
        }
        await createCashback(dataToSave)
      }
      onClose()
    } catch (e: any) {
      setError(e.message || 'Erro ao salvar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">Título</label>
          <Input id="title" {...register('title')} />
          {errors.title && <div className="text-xs text-red-500 mt-1">{errors.title.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="description">Descrição</label>
          <Input id="description" {...register('description')} />
          {errors.description && <div className="text-xs text-red-500 mt-1">{errors.description.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Percentual de Cashback</label>
          <input type="range" min={5} max={100} step={1} {...register('discount_percentage', { valueAsNumber: true })} className="w-full" />
          <div className="text-xs mt-1">{watchedValues.discount_percentage}%</div>
          {errors.discount_percentage && <div className="text-xs text-red-500">{errors.discount_percentage.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="minimum_purchase">Valor Mínimo (R$)</label>
          <Input
            id="minimum_purchase"
            type="number"
            step="0.01"
            {...register('minimum_purchase', { valueAsNumber: true })}
            disabled={watchedValues.discount_percentage === 100}
          />
          {errors.minimum_purchase && <div className="text-xs text-red-500 mt-1">{errors.minimum_purchase.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="end_date">Validade</label>
          <Input id="end_date" type="date" {...register('end_date')} />
          {errors.end_date && <div className="text-xs text-red-500 mt-1">{errors.end_date.message}</div>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
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
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="advertiser_logo">URL do Ícone</label>
          <Input id="advertiser_logo" {...register('advertiser_logo')} />
          {errors.advertiser_logo && <div className="text-xs text-red-500 mt-1">{errors.advertiser_logo.message}</div>}
        </div>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        <div className="flex gap-2 mt-4">
          <Button type="submit" disabled={isSubmitting || isCreating || isUpdating}>
            {isEdit ? 'Salvar Alterações' : 'Criar Cupom'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
      <div className="flex-1 md:max-h-[calc(100vh-200px)] md:overflow-y-auto p-1">
        <CashbackPreview data={watchedValues} />
      </div>
    </form>
  )
}

export { CashbackForm } 