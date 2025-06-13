import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import useAdvertiserProfile from '../useAdvertiserProfile'
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
  single: vi.fn()
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

describe('useAdvertiserProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve retornar dados iniciais quando não há usuário logado', async () => {
    ;(useAuth as any).mockReturnValue({
      currentUser: null
    })

    const { result } = renderHook(() => useAdvertiserProfile())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.profileData.full_name).toBe('')
    expect(result.current.profileData.email).toBe('')
    expect(result.current.error).toBe('Usuário não autenticado')
  })

  it('deve buscar dados do perfil corretamente para usuário autenticado', async () => {
    const mockUser = { 
      id: 'user-123',
      email: 'test@example.com'
    }
    
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    const mockProfileData = {
      id: 'user-123',
      full_name: 'João Silva',
      avatar_url: 'https://example.com/avatar.jpg',
      phone: '+55 11 99999-9999',
      website: 'https://example.com',
      description: 'Desenvolvedor experiente',
      user_type: 'anunciante',
      email_notifications: true,
      push_notifications: false,
      created_at: '2024-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: mockProfileData,
      error: null
    })

    const { result } = renderHook(() => useAdvertiserProfile())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.profileData.full_name).toBe('João Silva')
    expect(result.current.profileData.email).toBe('test@example.com')
    expect(result.current.profileData.phone).toBe('+55 11 99999-9999')
    expect(result.current.profileData.user_type).toBe('anunciante')
    expect(result.current.error).toBe(null)
  })

  it('deve usar fallbacks quando dados do perfil estão incompletos', async () => {
    const mockUser = { 
      id: 'user-123',
      email: 'test@example.com'
    }
    
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    const incompleteProfileData = {
      id: 'user-123',
      full_name: null,
      phone: null,
      website: null,
      description: null,
      user_type: 'anunciante',
      created_at: '2024-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: incompleteProfileData,
      error: null
    })

    const { result } = renderHook(() => useAdvertiserProfile())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.profileData.full_name).toBe('test') // fallback do email
    expect(result.current.profileData.email).toBe('test@example.com')
    expect(result.current.profileData.phone).toBe('')
    expect(result.current.profileData.website).toBe('')
    expect(result.current.profileData.description).toBe('')
    expect(result.current.error).toBe(null)
  })

  it('deve tratar erros corretamente', async () => {
    const mockUser = { 
      id: 'user-123',
      email: 'test@example.com'
    }
    
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Perfil não encontrado' }
    })

    const { result } = renderHook(() => useAdvertiserProfile())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.error).toContain('Erro ao buscar perfil')
    expect(result.current.profileData.full_name).toBe('test') // fallback
    expect(result.current.profileData.email).toBe('test@example.com')
  })

  it('deve validar user_type corretamente', async () => {
    const mockUser = { 
      id: 'user-123',
      email: 'admin@example.com'
    }
    
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    const mockProfileData = {
      id: 'user-123',
      full_name: 'Admin User',
      user_type: 'admin', // tipo válido
      created_at: '2024-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: mockProfileData,
      error: null
    })

    const { result } = renderHook(() => useAdvertiserProfile())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.profileData.user_type).toBe('admin')
  })

  it('deve usar fallback para user_type inválido', async () => {
    const mockUser = { 
      id: 'user-123',
      email: 'user@example.com'
    }
    
    ;(useAuth as any).mockReturnValue({
      currentUser: mockUser
    })

    const mockProfileData = {
      id: 'user-123',
      full_name: 'Test User',
      user_type: 'invalid_type', // tipo inválido
      created_at: '2024-01-01T00:00:00Z'
    }

    mockSupabase.single.mockResolvedValue({
      data: mockProfileData,
      error: null
    })

    const { result } = renderHook(() => useAdvertiserProfile())

    await waitForHook(() => !result.current.isLoading)

    expect(result.current.profileData.user_type).toBe('anunciante') // fallback
  })
}) 