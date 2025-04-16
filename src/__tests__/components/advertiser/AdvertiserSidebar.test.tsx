
import { render, screen, fireEvent } from "@/utils/test-utils";
import { BrowserRouter } from "react-router-dom";
import AdvertiserSidebar from "@/components/advertiser/AdvertiserSidebar";
import * as router from "react-router-dom";

// Mock the useNavigate function
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("AdvertiserSidebar", () => {
  const navigate = jest.fn();
  
  beforeEach(() => {
    jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it("renders sidebar links correctly", () => {
    render(<AdvertiserSidebar />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Campanhas")).toBeInTheDocument();
    expect(screen.getByText("Moderação")).toBeInTheDocument();
    expect(screen.getByText("Créditos")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });
  
  it("navigates to correct routes when links are clicked", () => {
    render(<AdvertiserSidebar />);
    
    // Dashboard
    fireEvent.click(screen.getByText("Dashboard"));
    expect(navigate).toHaveBeenCalledWith("/anunciante");
    
    // Campaigns
    fireEvent.click(screen.getByText("Campanhas"));
    expect(navigate).toHaveBeenCalledWith("/anunciante/campanhas");
    
    // Moderation
    fireEvent.click(screen.getByText("Moderação"));
    expect(navigate).toHaveBeenCalledWith("/anunciante/moderacao");
    
    // Credits
    fireEvent.click(screen.getByText("Créditos"));
    expect(navigate).toHaveBeenCalledWith("/anunciante/creditos");
    
    // Profile
    fireEvent.click(screen.getByText("Perfil"));
    expect(navigate).toHaveBeenCalledWith("/anunciante/perfil");
  });
});
