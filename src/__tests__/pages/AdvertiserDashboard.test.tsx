
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import AdvertiserDashboard from "@/pages/AdvertiserDashboard";
import * as router from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSounds } from "@/hooks/use-sounds";

// Mock the hooks
jest.mock("@/hooks/use-sounds", () => ({
  useSounds: jest.fn(),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock components to avoid rendering unnecessary complex UI
jest.mock("@/components/advertiser/DashboardTabs", () => ({ 
  activeTab, onTabChange 
}: { 
  activeTab: string; 
  onTabChange: (value: string) => void; 
}) => (
  <div data-testid="dashboard-tabs">
    <button data-testid="tab-overview" onClick={() => onTabChange("overview")}>Overview</button>
    <button data-testid="tab-campaigns" onClick={() => onTabChange("campaigns")}>Campaigns</button>
    <button data-testid="tab-analytics" onClick={() => onTabChange("analytics")}>Analytics</button>
    <button data-testid="tab-finance" onClick={() => onTabChange("finance")}>Finance</button>
    <div>Active Tab: {activeTab}</div>
  </div>
));

jest.mock("@/components/advertiser/NotificationBanner", () => ({ 
  pendingSubmissions, 
  onViewClick 
}: { 
  pendingSubmissions: number; 
  onViewClick: () => void; 
}) => (
  <div data-testid="notification-banner">
    <span>Pending: {pendingSubmissions}</span>
    <button onClick={onViewClick} data-testid="view-pending-btn">View Pending</button>
  </div>
));

describe("AdvertiserDashboard", () => {
  const navigate = jest.fn();
  const playSound = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      currentUser: { user_metadata: { user_type: "anunciante" } },
    });
    
    (useSounds as jest.Mock).mockReturnValue({
      playSound,
    });
    
    (router.useNavigate as jest.Mock).mockImplementation(() => navigate);
  });
  
  it("renders dashboard components correctly", async () => {
    render(<AdvertiserDashboard />);
    
    // Wait for loading state to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    expect(screen.getByText("Dashboard do Anunciante")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-tabs")).toBeInTheDocument();
    expect(screen.getByTestId("notification-banner")).toBeInTheDocument();
  });
  
  it("changes active tab when tabs are clicked", async () => {
    render(<AdvertiserDashboard />);
    
    // Wait for loading state to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Default tab should be "overview"
    expect(screen.getByText("Active Tab: overview")).toBeInTheDocument();
    
    // Click on campaigns tab
    fireEvent.click(screen.getByTestId("tab-campaigns"));
    expect(screen.getByText("Active Tab: campaigns")).toBeInTheDocument();
    expect(playSound).toHaveBeenCalledWith("pop");
    
    // Click on analytics tab
    fireEvent.click(screen.getByTestId("tab-analytics"));
    expect(screen.getByText("Active Tab: analytics")).toBeInTheDocument();
    
    // Click on finance tab
    fireEvent.click(screen.getByTestId("tab-finance"));
    expect(screen.getByText("Active Tab: finance")).toBeInTheDocument();
  });
  
  it("switches to finance tab when viewing pending submissions", async () => {
    render(<AdvertiserDashboard />);
    
    // Wait for loading state to finish
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
    
    // Click on view pending button in notification banner
    fireEvent.click(screen.getByTestId("view-pending-btn"));
    
    // Should switch to finance tab
    expect(screen.getByText("Active Tab: finance")).toBeInTheDocument();
  });
});
