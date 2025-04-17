
import { render, screen } from "@/utils/test-utils";
import OverviewContent from "@/components/admin/documentation/content/OverviewContent";

describe("OverviewContent", () => {
  test("renders all section headers", () => {
    render(<OverviewContent />);
    
    expect(screen.getByText("Sobre o PremiAds")).toBeInTheDocument();
    expect(screen.getByText("Arquitetura do Sistema")).toBeInTheDocument();
    expect(screen.getByText("Fluxo de Dados")).toBeInTheDocument();
    expect(screen.getByText("Versão Atual")).toBeInTheDocument();
  });
  
  test("renders system components list", () => {
    render(<OverviewContent />);
    
    expect(screen.getByText("Componentes Principais:")).toBeInTheDocument();
    expect(screen.getByText("Interface de administração (Painel Admin)")).toBeInTheDocument();
    expect(screen.getByText("Portal de anunciantes")).toBeInTheDocument();
    expect(screen.getByText("Aplicação para participantes")).toBeInTheDocument();
    expect(screen.getByText("Serviço de autenticação e controle de acesso")).toBeInTheDocument();
    expect(screen.getByText("Sistema de sorteios e premiações")).toBeInTheDocument();
    expect(screen.getByText("Motor de análise de dados")).toBeInTheDocument();
    expect(screen.getByText("API de integração")).toBeInTheDocument();
  });
  
  test("renders version information", () => {
    render(<OverviewContent />);
    
    expect(screen.getByText("Versão:", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("1.5.2")).toBeInTheDocument();
    expect(screen.getByText("Data da atualização:", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("17/04/2025")).toBeInTheDocument();
  });
  
  test("renders download changelog button", () => {
    render(<OverviewContent />);
    
    const button = screen.getByRole("button", { name: "Changelog" });
    expect(button).toBeInTheDocument();
    
    // Check if it contains the Download icon (harder to test directly)
    expect(button).toContainHTML("Download");
  });
});
