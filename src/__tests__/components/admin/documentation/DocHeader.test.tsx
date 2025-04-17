
import { render, screen, fireEvent } from "@/utils/test-utils";
import DocHeader from "@/components/admin/documentation/DocHeader";

describe("DocHeader", () => {
  const mockSetSearchQuery = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders correctly with title and search box", () => {
    render(<DocHeader searchQuery="" setSearchQuery={mockSetSearchQuery} />);
    
    // Check if title and description are rendered
    expect(screen.getByText("Documentação Técnica")).toBeInTheDocument();
    expect(screen.getByText("Guia completo de funcionamento e configuração do sistema PremiAds")).toBeInTheDocument();
    
    // Check if search box is rendered
    expect(screen.getByPlaceholderText("Pesquisar na documentação...")).toBeInTheDocument();
  });
  
  test("updates search query when typing", () => {
    render(<DocHeader searchQuery="" setSearchQuery={mockSetSearchQuery} />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText("Pesquisar na documentação...");
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: "usuários" } });
    
    // Check if setSearchQuery was called with the correct value
    expect(mockSetSearchQuery).toHaveBeenCalledWith("usuários");
  });
  
  test("shows the current search query", () => {
    const currentQuery = "configurações";
    
    render(<DocHeader searchQuery={currentQuery} setSearchQuery={mockSetSearchQuery} />);
    
    // Get the search input and check its value
    const searchInput = screen.getByPlaceholderText("Pesquisar na documentação...") as HTMLInputElement;
    expect(searchInput.value).toBe(currentQuery);
  });
});
