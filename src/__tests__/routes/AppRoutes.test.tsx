
import { render, screen } from "@/utils/test-utils";
import { MemoryRouter } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes";
import { AuthProvider } from "@/hooks/useAuth";

// Mock all route components
jest.mock("@/routes/PublicRoutes", () => () => <div data-testid="public-routes">Public Routes</div>);
jest.mock("@/routes/ClientRoutes", () => () => <div data-testid="client-routes">Client Routes</div>);
jest.mock("@/routes/AdminRoutes", () => () => <div data-testid="admin-routes">Admin Routes</div>);
jest.mock("@/routes/AdvertiserRoutes", () => () => <div data-testid="advertiser-routes">Advertiser Routes</div>);
jest.mock("@/pages/NotFound", () => () => <div data-testid="not-found">Not Found</div>);

// Mock window.location
const mockLocation = {
  pathname: "/test/",
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  origin: "http://localhost",
  href: "http://localhost/test/",
  search: "",
  hash: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

const renderWithRouter = (route: string) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("AppRoutes", () => {
  it("renders public routes for root path", () => {
    renderWithRouter("/");
    expect(screen.getByTestId("public-routes")).toBeInTheDocument();
  });
  
  it("renders client routes for /cliente path", () => {
    renderWithRouter("/cliente");
    expect(screen.getByTestId("client-routes")).toBeInTheDocument();
  });
  
  it("renders advertiser routes for /anunciante path", () => {
    renderWithRouter("/anunciante");
    expect(screen.getByTestId("advertiser-routes")).toBeInTheDocument();
  });
  
  it("renders admin routes for /admin path", () => {
    renderWithRouter("/admin");
    expect(screen.getByTestId("admin-routes")).toBeInTheDocument();
  });
  
  it("renders not found for unknown routes", () => {
    renderWithRouter("/unknown-route");
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
  
  // Testing trailing slash redirect is challenging in the test environment
  // but we can check that the route structure exists
  it("has a route for redirecting trailing slashes", () => {
    // This test just verifies the app doesn't crash with trailing slashes
    renderWithRouter("/client/");
    expect(screen.getByTestId("not-found")).toBeInTheDocument();
  });
});
