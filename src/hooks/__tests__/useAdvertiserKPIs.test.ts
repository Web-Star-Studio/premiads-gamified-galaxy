import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useAdvertiserKPIs from '../useAdvertiserKPIs'
import { useAuth } from '../useAuth'

// Mock do useAuth
vi.mock('../useAuth', () => ({
  useAuth: vi.fn()
}))

// Mock do Supabase
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis()
}

vi.mock('@/services/supabase', () => ({
  supabase: mockSupabase
}))

// Helper para aguardar mudanças assíncronas
const waitForHook = async (callback: () => boolean, timeout = 1000) => {
  return new Promise<void>((resolve, reject) => {
    const startTime = Date.now()
    const checkCondition = () => {
      if (callback()) {
        resolve()
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'))
      } else {
        setTimeout(checkCondition, 10)
      }
    }
    checkCondition()
  })
}

describe('useAdvertiserKPIs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar valores iniciais quando não há usuário logado', async () => {
    ;(useAuth as any).mockReturnValue({
      currentUser: null
    })

    const { result } = renderHook(() => useAdvertiserKPIs())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.kpis).toEqual({
      totalCampaigns: 0,
      activeUsers: 0,
      monthlySpend: 'R$ 0,00',
      avgReward: 'R$ 0,00'
    })
    expect(result.current.error).toBe('Usuário não autenticado')
  })

  it('deve buscar KPIs corretamente para usuário autenticado', async () => {
    const mockUser = { id: 'user-123' }
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    // Mock para contagem de campanhas
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'missions') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            count: 5,
            error: null
          })
        }
      }
      return mockSupabase
    })

    const { result } = renderHook(() => useAdvertiserKPIs())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.kpis.totalCampaigns).toBe(5)
    expect(result.current.error).toBe(null)
  })

  it('deve tratar erros corretamente', async () => {
    const mockUser = { id: 'user-123' }
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    // Mock para erro na busca de campanhas
    mockSupabase.from.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        count: null,
        error: { message: 'Erro de conexão' }
      })
    }))

    const { result } = renderHook(() => useAdvertiserKPIs())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.error).toContain('Erro ao buscar campanhas')
    expect(result.current.kpis).toEqual({
      totalCampaigns: 0,
      activeUsers: 0,
      monthlySpend: 'R$ 0,00',
      avgReward: 'R$ 0,00'
    })
  })

  it('deve calcular estimativas corretamente', async () => {
    const mockUser = { id: 'user-123' }
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    let callCount = 0
    mockSupabase.from.mockImplementation((table) => {
      callCount++
      
      if (table === 'missions' && callCount === 1) {
        // Primeira chamada: contagem de campanhas
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            count: 3,
            error: null
          })
        }
      } else if (table === 'missions' && callCount === 2) {
        // Segunda chamada: buscar IDs das missões
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [{ id: 'mission-1' }, { id: 'mission-2' }],
            error: null
          })
        }
      } else if (table === 'mission_submissions') {
        // Terceira chamada: usuários ativos
        return {
          select: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [
              { user_id: 'user-1' },
              { user_id: 'user-2' },
              { user_id: 'user-1' } // usuário duplicado
            ],
            error: null
          })
        }
      }
      
      return mockSupabase
    })

    const { result } = renderHook(() => useAdvertiserKPIs())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.kpis.totalCampaigns).toBe(3)
    expect(result.current.kpis.activeUsers).toBe(2) // Usuários únicos
    expect(result.current.kpis.monthlySpend).toBe('R$ 450,00') // 3 campanhas * R$ 150
    expect(result.current.error).toBe(null)
  })
}) 