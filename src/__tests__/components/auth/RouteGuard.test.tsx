
import { render, screen, waitFor } from "@/utils/test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RouteGuard from "@/components/auth/RouteGuard";
import { useAuth } from "@/hooks/useAuth";

// Mock useAuth hook
jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

// Mock LoadingSpinner component
jest.mock("@/components/LoadingSpinner", () => () => (
  <div data-testid="loading-spinner">Loading...</div>
));

describe("RouteGuard", () => {
  const mockNavigate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock navigate function
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));
  });
  
  it("renders loading spinner when authentication is in progress", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      currentUser: null,
    });
    
    render(
      <MemoryRouter>
        <RouteGuard>
          <div data-testid="protected-content">Protected Content</div>
        </RouteGuard>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
  
  it("redirects to auth page when user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      currentUser: null,
    });
    
    render(
      <MemoryRouter initialEntries={["/cliente"]}>
        <Routes>
          <Route 
            path="/cliente" 
            element={
              <RouteGuard>
                <div data-testid="protected-content">Protected Content</div>
              </RouteGuard>
            } 
          />
          <Route path="/auth" element={<div data-testid="auth-page">Auth Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId("auth-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
  
  it("renders children when user is authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      currentUser: { user_metadata: { user_type: "participante" } },
    });
    
    render(
      <MemoryRouter>
        <RouteGuard>
          <div data-testid="protected-content">Protected Content</div>
        </RouteGuard>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
  });
  
  it("redirects to appropriate dashboard when user type doesn't match required type", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      currentUser: { user_metadata: { user_type: "anunciante" } },
    });
    
    render(
      <MemoryRouter initialEntries={["/cliente"]}>
        <Routes>
          <Route 
            path="/cliente" 
            element={
              <RouteGuard allowedRoles={["participante"]}>
                <div data-testid="client-content">Client Content</div>
              </RouteGuard>
            } 
          />
          <Route path="/anunciante" element={<div data-testid="advertiser-dashboard">Advertiser Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId("advertiser-dashboard")).toBeInTheDocument();
    expect(screen.queryByTestId("client-content")).not.toBeInTheDocument();
  });
});
