
import { render, screen } from "@/utils/test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdvertiserRoutes from "@/routes/AdvertiserRoutes";
import { AuthProvider } from "@/hooks/useAuth";

// Mock lazy-loaded components
jest.mock("@/pages/AdvertiserDashboard", () => () => <div data-testid="advertiser-dashboard">Dashboard</div>);
jest.mock("@/pages/advertiser/AdvertiserCampaigns", () => () => <div data-testid="advertiser-campaigns">Campaigns</div>);
jest.mock("@/pages/advertiser/NewCampaign", () => () => <div data-testid="new-campaign">New Campaign</div>);
jest.mock("@/pages/advertiser/AnalyticsPage", () => () => <div data-testid="analytics-page">Analytics</div>);
jest.mock("@/pages/advertiser/CreditsPage", () => () => <div data-testid="credits-page">Credits</div>);
jest.mock("@/pages/advertiser/NotificationsPage", () => () => <div data-testid="notifications-page">Notifications</div>);
jest.mock("@/pages/advertiser/SettingsPage", () => () => <div data-testid="settings-page">Settings</div>);
jest.mock("@/pages/advertiser/ProfilePage", () => () => <div data-testid="profile-page">Profile</div>);
jest.mock("@/pages/advertiser/ModerationPage", () => () => <div data-testid="moderation-page">Moderation</div>);
jest.mock("@/pages/NotFound", () => () => <div data-testid="not-found">Not Found</div>);

// Helper to render component at specific route
const renderWithRouter = (route: string) => render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/anunciante/*" element={<AdvertiserRoutes />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );

describe("AdvertiserRoutes", () => {
  // Disable React.lazy warnings in test environment
  const originalConsoleError = console.error;
  beforeAll(() => {
    console.error = jest.fn((message) => {
      if (!message.includes("React.lazy")) {
        originalConsoleError(message);
      }
    });
  });
  
  afterAll(() => {
    console.error = originalConsoleError;
  });
  
  it("renders dashboard at root route", async () => {
    renderWithRouter("/anunciante");
    expect(await screen.findByTestId("advertiser-dashboard")).toBeInTheDocument();
  });
  
  it("renders campaigns page at /campanhas route", async () => {
    renderWithRouter("/anunciante/campanhas");
    expect(await screen.findByTestId("advertiser-campaigns")).toBeInTheDocument();
  });
  
  it("renders new campaign page at /nova-campanha route", async () => {
    renderWithRouter("/anunciante/nova-campanha");
    expect(await screen.findByTestId("new-campaign")).toBeInTheDocument();
  });
  
  it("renders analytics page at /analises route", async () => {
    renderWithRouter("/anunciante/analises");
    expect(await screen.findByTestId("analytics-page")).toBeInTheDocument();
  });
  
  it("renders credits page at /creditos route", async () => {
    renderWithRouter("/anunciante/creditos");
    expect(await screen.findByTestId("credits-page")).toBeInTheDocument();
  });
  
  it("renders notifications page at /notificacoes route", async () => {
    renderWithRouter("/anunciante/notificacoes");
    expect(await screen.findByTestId("notifications-page")).toBeInTheDocument();
  });
  
  it("renders profile page at /perfil route", async () => {
    renderWithRouter("/anunciante/perfil");
    expect(await screen.findByTestId("profile-page")).toBeInTheDocument();
  });
  
  it("renders settings page at /configuracoes route", async () => {
    renderWithRouter("/anunciante/configuracoes");
    expect(await screen.findByTestId("settings-page")).toBeInTheDocument();
  });
  
  it("renders moderation page at /moderacao route", async () => {
    renderWithRouter("/anunciante/moderacao");
    expect(await screen.findByTestId("moderation-page")).toBeInTheDocument();
  });
  
  it("renders 404 page for unknown routes", async () => {
    renderWithRouter("/anunciante/unknown-route");
    expect(await screen.findByTestId("not-found")).toBeInTheDocument();
  });
});
