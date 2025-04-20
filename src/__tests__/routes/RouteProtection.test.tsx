
import { render, screen, waitFor } from "@/utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import ClientRoutes from "@/routes/ClientRoutes";
import { useAuth } from "@/hooks/useAuth";

// Mock useAuth hook
jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn()
}));

describe("Route Protection", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("redirects to login when accessing protected route without auth", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      loading: false
    });

    render(
      <MemoryRouter initialEntries={["/cliente"]}>
        <ClientRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/auth");
    });
  });

  it("allows access to protected route when authenticated", async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: { name: "Test User" }
    });

    render(
      <MemoryRouter initialEntries={["/cliente"]}>
        <ClientRoutes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/cliente");
    });
  });

  it("shows loading state while checking auth", () => {
    (useAuth as jest.Mock).mockReturnValue({
      loading: true
    });

    render(
      <MemoryRouter initialEntries={["/cliente"]}>
        <ClientRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId("route-loading-spinner")).toBeInTheDocument();
  });
});
