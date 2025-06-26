import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePendingSubmissions } from '@/hooks/advertiser/usePendingSubmissions';
import { useAuth } from '@/hooks/core/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Mock dos módulos
jest.mock('@/hooks/core/useAuth');
jest.mock('@/integrations/supabase/client');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockSupabase = supabase as jest.Mocked<typeof supabase>;

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createQueryClient()}>
    {children}
  </QueryClientProvider>
);

const createMockUser = (id: string, email: string): User => ({
  id,
  email,
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  phone: null,
  email_confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
});

describe('usePendingSubmissions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar undefined quando usuário não está autenticado', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      error: null
    });

    const { result } = renderHook(() => usePendingSubmissions(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('deve configurar consulta quando usuário está autenticado', () => {
    const mockUser = createMockUser('advertiser-123', 'test@test.com');
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      error: null
    });

    const { result } = renderHook(() => usePendingSubmissions(), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it('deve inicializar corretamente o hook', () => {
    const mockUser = createMockUser('advertiser-123', 'test@test.com');
    
    mockUseAuth.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      error: null
    });

    const { result } = renderHook(() => usePendingSubmissions(), { wrapper });

    expect(typeof result.current.refetch).toBe('function');
    expect(typeof result.current.data).toBe('undefined'); // Inicial
  });
}); 