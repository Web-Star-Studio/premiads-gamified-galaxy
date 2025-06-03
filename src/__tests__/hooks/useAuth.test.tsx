
import { renderHook, waitFor } from '@/utils/test-utils';
import { useAuth } from '@/hooks/useAuth';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      }))
    }
  }
}));

describe('useAuth Hook', () => {
  test('returns initial state', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
