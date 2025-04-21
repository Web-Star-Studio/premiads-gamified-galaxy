
import { User } from "@supabase/supabase-js";
import { vi } from "vitest";

// Mock user factories for different roles
export const createMockUser = (role: 'participante' | 'anunciante' | 'admin' = 'participante'): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  user_metadata: {
    user_type: role,
    full_name: 'Test User'
  },
  app_metadata: {},
  aud: 'authenticated',
  role: ''
});

// Mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn().mockImplementation((callback) => {
      return {
        data: { subscription: { unsubscribe: vi.fn() } }
      };
    })
  },
  from: vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn()
  })
});

// Helper to simulate auth state
export const mockAuthState = (user: User | null = null) => {
  const mockClient = createMockSupabaseClient();
  mockClient.auth.getSession.mockResolvedValue({
    data: {
      session: user ? {
        user,
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600
      } : null
    },
    error: null
  });
  return mockClient;
};
