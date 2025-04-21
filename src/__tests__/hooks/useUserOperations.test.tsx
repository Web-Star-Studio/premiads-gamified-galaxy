
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import { useUserOperations } from "@/hooks/admin/useUserOperations";
import { supabase } from "@/integrations/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn()
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
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ 
      data: null, 
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    });

    await act(async () => {
      const success = await result.current.updateUserStatus('test-id', true);
      expect(success).toBe(true);
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('update_user_status', {
      user_id: 'test-id',
      is_active: true
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledTimes(1);
  });

  it('handles errors when updating user status', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock error response
    const mockError: PostgrestError = {
      message: 'Update failed',
      details: '',
      hint: '',
      code: 'ERROR',
      name: 'PostgrestError'
    };
    
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ 
      data: null, 
      error: mockError,
      count: null,
      status: 400,
      statusText: 'Bad Request'
    });

    await act(async () => {
      const success = await result.current.updateUserStatus('test-id', true);
      expect(success).toBe(false);
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('update_user_status', {
      user_id: 'test-id',
      is_active: true
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledTimes(1);
  });

  it('successfully deletes user', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock successful response
    vi.mocked(supabase.rpc).mockResolvedValueOnce({ 
      data: null, 
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    });

    await act(async () => {
      const success = await result.current.deleteUser('test-id');
      expect(success).toBe(true);
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('delete_user_account', {
      target_user_id: 'test-id'
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledTimes(1);
  });

  it('handles errors when deleting user', async () => {
    const { result } = renderHook(() => useUserOperations());

    // Mock error response
    const mockError: PostgrestError = {
      message: 'Delete failed',
      details: '',
      hint: '',
      code: 'ERROR',
      name: 'PostgrestError'
    };
    
    vi.mocked(supabase.rpc).mockResolvedValueOnce({
      data: null, 
      error: mockError,
      count: null,
      status: 400,
      statusText: 'Bad Request'
    });

    await act(async () => {
      const success = await result.current.deleteUser('test-id');
      expect(success).toBe(false);
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledWith('delete_user_account', {
      target_user_id: 'test-id'
    });

    expect(vi.mocked(supabase.rpc)).toHaveBeenCalledTimes(1);
  });
});
