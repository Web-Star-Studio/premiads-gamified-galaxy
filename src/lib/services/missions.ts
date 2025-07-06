import { fetchRecords } from './_generic'
import { withPerformanceMonitoring as withPerf } from '@/utils/performance-monitor'

export const getActiveMissions = withPerf(
  async ({ status }: { status?: string } = {}) => {
    const filters: Record<string, any> = { is_active: true }
    if (status) filters.status = status
    return fetchRecords('missions', { filters, orderBy: { column: 'created_at', asc: false } })
  },
  'getActiveMissions'
)

export const getMissionById = withPerf(
  async ({ id }: { id: string }) => {
    return fetchRecords('missions', { filters: { id }, single: true })
  },
  'getMissionById'
) 