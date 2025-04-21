import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from "@/hooks/useAuth";
import { createMockUser, mockAuthState } from "../utils/auth-test-utils";

// Mock the Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: mockAuthState()
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes with no authenticated user", async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.currentUser).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });
  });

  it("handles successful sign in", async () => {
    const mockUser = createMockUser();
    const supabase = mockAuthState(mockUser);
    
    vi.mock("@/integrations/supabase/client", () => ({
      supabase
    }));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signIn({
        email: "test@example.com",
        password: "password"
      });
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.currentUser).toEqual(mockUser);
    });
  });

  it("handles sign out", async () => {
    const mockUser = createMockUser();
    const supabase = mockAuthState(mockUser);
    
    vi.mock("@/integrations/supabase/client", () => ({
      supabase
    }));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.signOut();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.currentUser).toBeNull();
    });
  });
});
