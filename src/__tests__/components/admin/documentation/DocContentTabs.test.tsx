
import { render, screen, fireEvent } from "@/utils/test-utils";
import DocContentTabs from "@/components/admin/documentation/DocContentTabs";
import DocSectionContent from "@/components/admin/documentation/DocSectionContent";

// Mock the DocSectionContent component
jest.mock("@/components/admin/documentation/DocSectionContent", () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="mocked-section-content">Mocked Content</div>)
}));

describe("DocContentTabs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders correctly with default content tab active", () => {
    render(<DocContentTabs activeSection="overview" />);
    
    // Check if all tabs are rendered
    expect(screen.getByRole("tab", { name: "Conteúdo" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Exemplos" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "API" })).toBeInTheDocument();
    
    // Content tab should be active by default
    expect(screen.getByRole("tab", { name: "Conteúdo" })).toHaveAttribute("data-state", "active");
    
    // DocSectionContent should be rendered with the correct activeSection
    expect(DocSectionContent).toHaveBeenCalledWith({ sectionId: "overview" }, {});
  });
  
  test("switches between tabs correctly", () => {
    render(<DocContentTabs activeSection="dashboard" />);
    
    // Click the Examples tab
    fireEvent.click(screen.getByRole("tab", { name: "Exemplos" }));
    
    // Examples tab should be active
    expect(screen.getByRole("tab", { name: "Exemplos" })).toHaveAttribute("data-state", "active");
    expect(screen.getByText("Exemplos de Código")).toBeInTheDocument();
    
    // Click the API tab
    fireEvent.click(screen.getByRole("tab", { name: "API" }));
    
    // API tab should be active
    expect(screen.getByRole("tab", { name: "API" })).toHaveAttribute("data-state", "active");
    expect(screen.getByText("Documentação da API")).toBeInTheDocument();
    
    // Confirm the API tab shows the correct endpoint
    expect(screen.getByText("GET /api/v1/dashboard")).toBeInTheDocument();
    
    // Go back to Content tab
    fireEvent.click(screen.getByRole("tab", { name: "Conteúdo" }));
    expect(screen.getByRole("tab", { name: "Conteúdo" })).toHaveAttribute("data-state", "active");
  });
  
  test("displays API endpoint correctly based on activeSection", () => {
    render(<DocContentTabs activeSection="users" />);
    
    // Click the API tab
    fireEvent.click(screen.getByRole("tab", { name: "API" }));
    
    // Should show the correct endpoint for users section
    expect(screen.getByText("GET /api/v1/users")).toBeInTheDocument();
  });
});
