
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import AuthOverlay from "@/components/auth/AuthOverlay";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";

// Mock hooks
jest.mock("@/hooks/useAuthMethods", () => ({
  useAuthMethods: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock Particles component
jest.mock("@/components/Particles", () => () => <div data-testid="particles" />);

describe("AuthOverlay", () => {
  const signIn = jest.fn();
  const signUp = jest.fn();
  const toast = jest.fn();
  const onClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuthMethods as jest.Mock).mockReturnValue({
      signIn,
      signUp,
      loading: false,
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast,
    });
  });
  
  it("renders when isOpen is true", () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    expect(screen.getByText("PremiAds")).toBeInTheDocument();
    expect(screen.getByText("Entrar ou criar sua conta")).toBeInTheDocument();
  });
  
  it("doesn't render when isOpen is false", () => {
    render(<AuthOverlay isOpen={false} onClose={onClose} />);
    
    expect(screen.queryByText("PremiAds")).not.toBeInTheDocument();
  });
  
  it("switches between login and signup forms", () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    // By default, login form should be shown
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
    
    // Switch to signup form
    fireEvent.click(screen.getByRole("tab", { name: "Cadastro" }));
    
    // Signup form should now be shown
    expect(screen.getByPlaceholderText("Seu nome")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrar" })).toBeInTheDocument();
    expect(screen.getByText("Participante")).toBeInTheDocument();
    expect(screen.getByText("Anunciante")).toBeInTheDocument();
  });
  
  it("validates login form before submission", async () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    
    // Should show error toast
    expect(toast).toHaveBeenCalledWith({
      title: "Campos obrigatórios",
      description: "Por favor, preencha todos os campos.",
      variant: "destructive",
    });
    
    // Login function should not be called
    expect(signIn).not.toHaveBeenCalled();
  });
  
  it("validates signup form before submission", async () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    // Switch to signup
    fireEvent.click(screen.getByRole("tab", { name: "Cadastro" }));
    
    // Try to submit empty form
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    
    // Should show error toast
    expect(toast).toHaveBeenCalledWith({
      title: "Campos obrigatórios",
      description: "Por favor, preencha todos os campos.",
      variant: "destructive",
    });
    
    // Signup function should not be called
    expect(signUp).not.toHaveBeenCalled();
  });
  
  it("submits login form with valid data", async () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "test@example.com" },
    });
    
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "password123" },
    });
    
    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Entrar" }));
    
    // Login function should be called with correct data
    expect(signIn).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });
  
  it("submits signup form with valid data", async () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    // Switch to signup
    fireEvent.click(screen.getByRole("tab", { name: "Cadastro" }));
    
    // Fill in form
    fireEvent.change(screen.getByPlaceholderText("Seu nome"), {
      target: { value: "Test User" },
    });
    
    fireEvent.change(screen.getByPlaceholderText("seu@email.com"), {
      target: { value: "test@example.com" },
    });
    
    fireEvent.change(screen.getByPlaceholderText("********"), {
      target: { value: "password123" },
    });
    
    // Select anunciante user type
    fireEvent.click(screen.getByRole("button", { name: "Anunciante" }));
    
    // Submit form
    fireEvent.click(screen.getByRole("button", { name: "Cadastrar" }));
    
    // Signup function should be called with correct data
    expect(signUp).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      userType: "anunciante",
    });
  });
  
  it("shows loading state during authentication", async () => {
    // Mock loading state
    (useAuthMethods as jest.Mock).mockReturnValue({
      signIn,
      signUp,
      loading: true,
    });
    
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    // Should show loading text on button
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
    
    // Switch to signup
    fireEvent.click(screen.getByRole("tab", { name: "Cadastro" }));
    
    // Should show loading text on signup button
    expect(screen.getByRole("button", { name: "Cadastrando..." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrando..." })).toBeDisabled();
  });
  
  it("calls onClose when close button is clicked", () => {
    render(<AuthOverlay isOpen={true} onClose={onClose} />);
    
    fireEvent.click(screen.getByText("Voltar para a página inicial"));
    
    expect(onClose).toHaveBeenCalled();
  });
});
