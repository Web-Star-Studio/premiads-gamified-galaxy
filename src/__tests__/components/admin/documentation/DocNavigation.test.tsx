
import { render, screen, fireEvent } from "@/utils/test-utils";
import DocNavigation from "@/components/admin/documentation/DocNavigation";
import { toastInfo } from "@/utils/toast";

// Mock the toast function
jest.mock("@/utils/toast", () => ({
  toastInfo: jest.fn(),
  toastSuccess: jest.fn(),
  toastError: jest.fn(),
  toastWarning: jest.fn()
}));

describe("DocNavigation", () => {
  const mockSetActiveSection = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test("renders all navigation items", () => {
    render(
      <DocNavigation 
        activeSection="overview" 
        setActiveSection={mockSetActiveSection} 
      />
    );
    
    // Check if all sections are rendered
    expect(screen.getByText("Visão Geral")).toBeInTheDocument();
    expect(screen.getByText("Painel Principal")).toBeInTheDocument();
    expect(screen.getByText("Gestão de Usuários")).toBeInTheDocument();
    expect(screen.getByText("Controle de Acesso")).toBeInTheDocument();
    expect(screen.getByText("Configuração de Regras")).toBeInTheDocument();
    expect(screen.getByText("Monitoramento")).toBeInTheDocument();
    expect(screen.getByText("Relatórios")).toBeInTheDocument();
    expect(screen.getByText("Gestão de Sorteios")).toBeInTheDocument();
    expect(screen.getByText("Notificações")).toBeInTheDocument();
    expect(screen.getByText("Configurações")).toBeInTheDocument();
    expect(screen.getByText("Banco de Dados")).toBeInTheDocument();
    expect(screen.getByText("FAQ Técnico")).toBeInTheDocument();
  });
  
  test("marks the active section correctly", () => {
    render(
      <DocNavigation 
        activeSection="users" 
        setActiveSection={mockSetActiveSection} 
      />
    );
    
    // Find the Users button
    const usersButton = screen.getByText("Gestão de Usuários").closest("button");
    
    // It should have the active class
    expect(usersButton).toHaveClass("bg-galaxy-deepPurple/40");
  });
  
  test("calls setActiveSection and shows toast when a section is clicked", () => {
    render(
      <DocNavigation 
        activeSection="overview" 
        setActiveSection={mockSetActiveSection} 
      />
    );
    
    // Click on the Users section
    fireEvent.click(screen.getByText("Gestão de Usuários"));
    
    // Check if setActiveSection was called with the correct parameter
    expect(mockSetActiveSection).toHaveBeenCalledWith("users");
    
    // Check if the toast was displayed
    expect(toastInfo).toHaveBeenCalledWith("Seção \"Gestão de Usuários\" carregada");
  });
  
  test("sets a default section when activeSection is empty", () => {
    render(
      <DocNavigation 
        activeSection="" 
        setActiveSection={mockSetActiveSection} 
      />
    );
    
    // Should set the default section to "overview"
    expect(mockSetActiveSection).toHaveBeenCalledWith("overview");
  });
});
