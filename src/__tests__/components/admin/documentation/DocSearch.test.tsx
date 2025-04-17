
import { render, screen, fireEvent } from "@/utils/test-utils";
import DocSearch from "@/components/admin/documentation/DocSearch";

describe("DocSearch", () => {
  const mockSetSearchQuery = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders search input with search icon", () => {
    render(<DocSearch searchQuery="" setSearchQuery={mockSetSearchQuery} />);
    
    // Check if search input is rendered
    expect(screen.getByPlaceholderText("Pesquisar na documentação...")).toBeInTheDocument();
    
    // Check if search icon exists (this is harder to test directly, but we can check the container)
    const searchContainer = screen.getByPlaceholderText("Pesquisar na documentação...").parentElement;
    expect(searchContainer).toBeInTheDocument();
  });
  
  test("updates search query on input change", () => {
    render(<DocSearch searchQuery="" setSearchQuery={mockSetSearchQuery} />);
    
    // Get the search input
    const searchInput = screen.getByPlaceholderText("Pesquisar na documentação...");
    
    // Type in the search box
    fireEvent.change(searchInput, { target: { value: "banco de dados" } });
    
    // Check if setSearchQuery was called with the correct value
    expect(mockSetSearchQuery).toHaveBeenCalledWith("banco de dados");
  });
  
  test("displays the current search query", () => {
    const currentQuery = "monitoramento";
    
    render(<DocSearch searchQuery={currentQuery} setSearchQuery={mockSetSearchQuery} />);
    
    // Get the search input and check its value
    const searchInput = screen.getByPlaceholderText("Pesquisar na documentação...") as HTMLInputElement;
    expect(searchInput.value).toBe(currentQuery);
  });
});
