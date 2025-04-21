import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RouteGuard from "@/components/auth/RouteGuard";
import { createMockUser, mockAuthState } from "../../utils/auth-test-utils";

// Mock LoadingSpinner component
vi.mock("@/components/LoadingSpinner", () => ({
  default: () => <div data-testid="loading-spinner">Loading...</div>
}));

describe("RouteGuard Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redirects unauthenticated users to login", async () => {
    const supabase = mockAuthState(null);
    
    vi.mock("@/integrations/supabase/client", () => ({
      supabase
    }));

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route 
            path="/protected" 
            element={
              <RouteGuard>
                <div>Protected Content</div>
              </RouteGuard>
            } 
          />
          <Route path="/auth" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("allows access to authorized users", async () => {
    const mockUser = createMockUser("anunciante");
    const supabase = mockAuthState(mockUser);
    
    vi.mock("@/integrations/supabase/client", () => ({
      supabase
    }));

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route 
            path="/protected" 
            element={
              <RouteGuard userType="anunciante">
                <div>Protected Advertiser Content</div>
              </RouteGuard>
            } 
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Protected Advertiser Content")).toBeInTheDocument();
    });
  });

  it("redirects users with incorrect role", async () => {
    const mockUser = createMockUser("participante");
    const supabase = mockAuthState(mockUser);
    
    vi.mock("@/integrations/supabase/client", () => ({
      supabase
    }));

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route 
            path="/admin" 
            element={
              <RouteGuard userType="admin">
                <div>Admin Content</div>
              </RouteGuard>
            } 
          />
          <Route path="/cliente" element={<div>Client Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Client Dashboard")).toBeInTheDocument();
    });
  });
});
