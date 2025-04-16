
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import CampaignsList from "@/components/advertiser/CampaignsList";
import { mockCampaigns } from "@/mocks/campaignMocks";
import { useNavigate } from "react-router-dom";
import { useSounds } from "@/hooks/use-sounds";

// Mock the hooks
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("@/hooks/use-sounds", () => ({
  useSounds: jest.fn(),
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("CampaignsList", () => {
  const navigate = jest.fn();
  const playSound = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
    (useSounds as jest.Mock).mockReturnValue({ playSound });
  });
  
  it("renders campaigns list correctly", () => {
    render(<CampaignsList campaigns={mockCampaigns} onDelete={jest.fn()} />);
    
    // Check if campaigns are rendered
    mockCampaigns.forEach(campaign => {
      expect(screen.getByText(campaign.title)).toBeInTheDocument();
    });
  });
  
  it("navigates to campaign detail when view button is clicked", () => {
    render(<CampaignsList campaigns={mockCampaigns} onDelete={jest.fn()} />);
    
    // Click on view button of first campaign
    const viewButtons = screen.getAllByText("Ver Detalhes");
    fireEvent.click(viewButtons[0]);
    
    // Check if navigate was called with correct path
    expect(navigate).toHaveBeenCalledWith(`/anunciante/campanhas/${mockCampaigns[0].id}`);
    expect(playSound).toHaveBeenCalledWith("pop");
  });
  
  it("navigates to edit page when edit button is clicked", () => {
    render(<CampaignsList campaigns={mockCampaigns} onDelete={jest.fn()} />);
    
    // Click on edit button of first campaign
    const editButtons = screen.getAllByText("Editar");
    fireEvent.click(editButtons[0]);
    
    // Check if navigate was called with correct path
    expect(navigate).toHaveBeenCalledWith(`/anunciante/campanhas/editar/${mockCampaigns[0].id}`);
    expect(playSound).toHaveBeenCalledWith("pop");
  });
  
  it("calls onDelete with campaign id when delete is confirmed", async () => {
    const onDeleteMock = jest.fn();
    render(<CampaignsList campaigns={mockCampaigns} onDelete={onDeleteMock} />);
    
    // Click on delete button of first campaign
    const deleteButtons = screen.getAllByText("Excluir");
    fireEvent.click(deleteButtons[0]);
    
    // Find and click confirm button in dialog
    const confirmButton = screen.getByText("Sim, excluir");
    fireEvent.click(confirmButton);
    
    // Wait for delete operation to complete
    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith(mockCampaigns[0].id);
    });
    
    expect(playSound).toHaveBeenCalledWith("error");
  });
  
  it("displays status badge with correct color", () => {
    render(<CampaignsList campaigns={mockCampaigns} onDelete={jest.fn()} />);
    
    // Check status badges
    const activeBadges = screen.getAllByText("Ativa");
    const draftBadges = screen.getAllByText("Rascunho");
    
    activeBadges.forEach(badge => {
      expect(badge.closest('div')).toHaveClass("bg-green-500/20");
    });
    
    draftBadges.forEach(badge => {
      expect(badge.closest('div')).toHaveClass("bg-gray-500/20");
    });
  });
  
  it("shows correct date format", () => {
    render(<CampaignsList campaigns={mockCampaigns} onDelete={jest.fn()} />);
    
    // Use the new helper function to find text matching a pattern
    const container = screen.getByTestId("campaigns-list");
    
    // NOTE: Using a string pattern instead of RegExp to fix the build error
    expect(screen.getByText("01/05/2023")).toBeInTheDocument();
    expect(screen.getByText("15/06/2023")).toBeInTheDocument();
  });
  
  it("displays empty message when no campaigns", () => {
    render(<CampaignsList campaigns={[]} onDelete={jest.fn()} />);
    
    expect(screen.getByText("Nenhuma campanha encontrada")).toBeInTheDocument();
  });
});
