
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import { useUserOperations } from "@/hooks/admin/useUserOperations";

const mockToast = vi.fn();

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: vi.fn()
  }
}));

describe('useUserOperations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully updates user status', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock successful response
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ error: null });

    await act(async () => {
      const success = await result.current.updateUserStatus('test-id', true);
      expect(success).toBe(true);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'User updated',
      description: 'User status updated to active'
    });
  });

  it('handles errors when updating user status', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock error response
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      error: new Error('Update failed')
    });

    await act(async () => {
      const success = await result.current.updateUserStatus('test-id', true);
      expect(success).toBe(false);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error updating user',
      description: 'Update failed',
      variant: 'destructive'
    });
  });

  it('successfully deletes user', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock successful response
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ error: null });

    await act(async () => {
      const success = await result.current.deleteUser('test-id');
      expect(success).toBe(true);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'User deleted',
      description: 'User has been deleted successfully'
    });
  });

  it('handles errors when deleting user', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock error response
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      error: new Error('Delete failed')
    });

    await act(async () => {
      const success = await result.current.deleteUser('test-id');
      expect(success).toBe(false);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error deleting user',
      description: 'Delete failed',
      variant: 'destructive'
    });
  });
});
