import { getSupabaseClient } from '@/lib/supabaseClient'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'
import type { Lottery, LotteryFormValues } from '@/types/lottery'

async function callEdge(action: string, data: any) {
  const supabase = await getSupabaseClient()
  const { data: result, error } = await supabase.functions.invoke('admin-lottery-operations', {
    body: { action, data }
  })
  if (error) throw new Error(error.message || 'Admin raffle operation failed')
  return result
}

export const createRaffle = withPerf(
  async ({ values, imageFile }: { values: LotteryFormValues; imageFile?: File }): Promise<Lottery> => {
    const supabase = await getSupabaseClient()
    let imageUrl = ''
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('raffle-images')
        .upload(fileName, imageFile)
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage
        .from('raffle-images')
        .getPublicUrl(fileName)
      imageUrl = publicUrl
    }
    const payload = {
      ...values,
      imageUrl,
      startDate: values.startDate.toISOString(),
      endDate: values.endDate.toISOString()
    }
    const result = await callEdge('create', payload)
    if (!result.success) throw new Error(result.error || 'Failed to create raffle')
    return result.lottery as Lottery
  },
  'createRaffle'
)

export const updateRaffleStatus = withPerf(
  async ({ raffleId, newStatus }: { raffleId: string; newStatus: Lottery['status'] }): Promise<Lottery> => {
    const result = await callEdge('updateStatus', { id: raffleId, status: newStatus })
    if (!result.success) throw new Error(result.error || 'Failed to update raffle status')
    return result.lottery as Lottery
  },
  'updateRaffleStatus'
)

export const deleteRaffle = withPerf(
  async ({ raffleId }: { raffleId: string }): Promise<boolean> => {
    const result = await callEdge('delete', { id: raffleId })
    if (!result.success) throw new Error(result.error || 'Failed to delete raffle')
    return true
  },
  'deleteRaffle'
)

export const updateRaffle = withPerf(
  async ({ raffleId, updates }: { raffleId: string; updates: Partial<Lottery> }): Promise<Lottery> => {
    const result = await callEdge('update', { id: raffleId, ...updates })
    if (!result.success) throw new Error(result.error || 'Failed to update raffle')
    return result.lottery as Lottery
  },
  'updateRaffle'
)

export const adminRaffleService = {
  createRaffle: (values: LotteryFormValues, imageFile?: File) => createRaffle({ values, imageFile }),
  updateRaffleStatus: (raffleId: string, newStatus: Lottery['status']) => updateRaffleStatus({ raffleId, newStatus }),
  deleteRaffle: (raffleId: string) => deleteRaffle({ raffleId }),
  updateRaffle: (raffleId: string, updates: Partial<Lottery>) => updateRaffle({ raffleId, updates })
} 