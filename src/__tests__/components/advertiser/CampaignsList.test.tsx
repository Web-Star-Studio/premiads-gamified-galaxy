
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import CampaignsList from "@/components/advertiser/CampaignsList";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";

// Mock hooks
jest.mock("@/hooks/use-sounds", () => ({
  useSounds: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock CampaignForm component to avoid rendering complex UI
jest.mock("@/components/advertiser/CampaignForm", () => ({
  onClose,
  editCampaign
}: any) => (
  <div data-testid="campaign-form">
    <div>Editing: {editCampaign ? editCampaign.title : 'New Campaign'}</div>
    <button onClick={onClose} data-testid="close-form-btn">Close Form</button>
  </div>
));

describe("CampaignsList", () => {
  const playSound = jest.fn();
  const toast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useSounds as jest.Mock).mockReturnValue({
      playSound,
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast,
    });
  });
  
  it("renders campaigns list with filter options", () => {
    render(<CampaignsList />);
    
    // Check if campaign header and table are rendered
    expect(screen.getByText(/Gerenciar Campanhas/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    
    // Check if sample campaigns are rendered
    expect(screen.getAllByRole("row").length).toBeGreaterThan(1);
  });
  
  it("shows campaign form when create new button is clicked", () => {
    render(<CampaignsList />);
    
    // Find and click create new campaign button
    const createButton = screen.getByRole("button", { name: /Nova Campanha/i });
    fireEvent.click(createButton);
    
    // Check if form is displayed
    expect(screen.getByTestId("campaign-form")).toBeInTheDocument();
    expect(playSound).toHaveBeenCalledWith("pop");
  });
  
  it("shows edit form when edit button is clicked", () => {
    render(<CampaignsList />);
    
    // Find first edit button and click it
    const editButtons = screen.getAllByRole("button", { name: /Editar campanha/i });
    fireEvent.click(editButtons[0]);
    
    // Check if form is displayed with campaign data
    expect(screen.getByTestId("campaign-form")).toBeInTheDocument();
    expect(screen.getByText(/Editing:/i)).toBeInTheDocument();
    expect(playSound).toHaveBeenCalledWith("pop");
  });
  
  it("removes campaign when delete button is clicked", () => {
    render(<CampaignsList />);
    
    // Count initial number of rows
    const initialRowCount = screen.getAllByRole("row").length;
    
    // Find first delete button and click it
    const deleteButtons = screen.getAllByRole("button", { name: /Excluir campanha/i });
    fireEvent.click(deleteButtons[0]);
    
    // Check if a row was removed
    expect(screen.getAllByRole("row").length).toBe(initialRowCount - 1);
    
    // Check if toast was shown and sound played
    expect(toast).toHaveBeenCalled();
    expect(playSound).toHaveBeenCalledWith("error");
  });
  
  it("adds new campaign when form is completed", () => {
    render(<CampaignsList />);
    
    // Count initial number of rows
    const initialRowCount = screen.getAllByRole("row").length;
    
    // Open form
    const createButton = screen.getByRole("button", { name: /Nova Campanha/i });
    fireEvent.click(createButton);
    
    // Close form (simulates form submission)
    const closeButton = screen.getByTestId("close-form-btn");
    fireEvent.click(closeButton);
    
    // Check if new campaign was added
    expect(screen.getAllByRole("row").length).toBe(initialRowCount + 1);
    
    // Check if toast was shown
    expect(toast).toHaveBeenCalled();
    expect(playSound).toHaveBeenCalledWith("pop");
  });
  
  it("filters campaigns when search is used", () => {
    render(<CampaignsList />);
    
    // Find search input
    const searchInput = screen.getByPlaceholderText(/Buscar campanha/i);
    
    // Type a search term that should match only one campaign
    fireEvent.change(searchInput, { target: { value: "Missão #1" } });
    
    // Should show only one campaign row plus header row
    expect(screen.getAllByRole("row").length).toBe(2);
  });
  
  it("filters campaigns by status when filter is changed", () => {
    render(<CampaignsList />);
    
    // Find and click the status filter dropdown
    const statusFilter = screen.getByRole("combobox");
    fireEvent.change(statusFilter, { target: { value: "ativa" } });
    
    // Should show only active campaigns
    screen.getAllByRole("row").forEach((row, index) => {
      if (index > 0) { // Skip header row
        expect(row).toHaveTextContent(/ativa/i);
      }
    });
  });
});
