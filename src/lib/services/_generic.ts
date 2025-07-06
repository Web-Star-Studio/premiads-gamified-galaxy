import { getSupabaseClient } from '@/lib/supabaseClient'

interface FetchOpts {
  filters?: Record<string, any>
  single?: boolean
  orderBy?: { column: string; asc?: boolean }
  limit?: number
}

export async function fetchRecords<T = any>(
  table: string,
  opts: FetchOpts = {}
): Promise<T | T[]> {
  const supabase = await getSupabaseClient()
  let q = supabase.from(table).select('*')
  if (opts.filters) {
    Object.entries(opts.filters).forEach(([key, value]) => {
      q = q.eq(key, value)
    })
  }
  if (opts.orderBy) {
    q = q.order(opts.orderBy.column, { ascending: opts.orderBy.asc })
  }
  if (opts.limit) {
    q = q.limit(opts.limit)
  }
  const res = opts.single ? await q.single() : await q
  if (res.error) throw res.error
  return res.data
} 