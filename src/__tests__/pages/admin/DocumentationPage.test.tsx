
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import DocumentationPage from "@/pages/admin/DocumentationPage";
import { toastInfo } from "@/utils/toast";

// Mock the components used in DocumentationPage
jest.mock("@/components/admin/AdminSidebar", () => function MockAdminSidebar() {
    return <div data-testid="admin-sidebar">Admin Sidebar</div>;
  });

jest.mock("@/components/admin/DashboardHeader", () => function MockDashboardHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
      <header data-testid="dashboard-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>
    );
  });

jest.mock("@/components/admin/documentation/DocHeader", () => function MockDocHeader({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: any }) {
    return (
      <div data-testid="doc-header">
        <input 
          data-testid="search-input" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
        />
      </div>
    );
  });

jest.mock("@/components/admin/documentation/DocNavigation", () => function MockDocNavigation({ activeSection, setActiveSection }: { activeSection: string; setActiveSection: any }) {
    return (
      <div data-testid="doc-navigation">
        <button data-testid="nav-overview" onClick={() => setActiveSection("overview")}>Overview</button>
        <button data-testid="nav-users" onClick={() => setActiveSection("users")}>Users</button>
        <div>Active: {activeSection}</div>
      </div>
    );
  });

jest.mock("@/components/admin/documentation/DocContentTabs", () => function MockDocContentTabs({ activeSection }: { activeSection: string }) {
    return (
      <div data-testid="doc-content-tabs">
        <div>Content for: {activeSection}</div>
      </div>
    );
  });

jest.mock("@/utils/toast", () => ({
  toastInfo: jest.fn(),
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  toastWarning: jest.fn()
}));

describe("DocumentationPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders all page components correctly", () => {
    render(<DocumentationPage />);
    
    // Check if all main components are rendered
    expect(screen.getByTestId("admin-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("dashboard-header")).toBeInTheDocument();
    expect(screen.getByTestId("doc-header")).toBeInTheDocument();
    expect(screen.getByTestId("doc-navigation")).toBeInTheDocument();
    expect(screen.getByTestId("doc-content-tabs")).toBeInTheDocument();
    
    // Check page title
    expect(screen.getByText("Documentação")).toBeInTheDocument();
    expect(screen.getByText("Base de conhecimento técnico")).toBeInTheDocument();
  });
  
  test("maintains active section state and passes it to children", () => {
    render(<DocumentationPage />);
    
    // Default section should be "overview"
    expect(screen.getByText("Active: overview")).toBeInTheDocument();
    expect(screen.getByText("Content for: overview")).toBeInTheDocument();
    
    // Click on Users navigation item
    fireEvent.click(screen.getByTestId("nav-users"));
    
    // Active section should update
    expect(screen.getByText("Active: users")).toBeInTheDocument();
    expect(screen.getByText("Content for: users")).toBeInTheDocument();
  });
  
  test("search functionality works correctly", () => {
    render(<DocumentationPage />);
    
    // Get the search input and type in it
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "authentication" } });
    
    // The search query state should be updated and passed to DocHeader
    expect(searchInput).toHaveValue("authentication");
  });
});
