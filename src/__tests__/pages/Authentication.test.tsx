
import { render, screen, fireEvent, waitFor } from "@/utils/test-utils";
import Authentication from "@/pages/Authentication";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Mock hooks
jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

// Mock Particles component
jest.mock("@/components/Particles", () => () => <div data-testid="particles" />);

describe("Authentication", () => {
  const signIn = jest.fn();
  const signUp = jest.fn();
  const toast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      signIn,
      signUp,
      loading: false,
    });
    
    (useToast as jest.Mock).mockReturnValue({
      toast,
    });
  });
  
  it("renders login and signup tabs", () => {
    render(<Authentication />);
    
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Cadastro")).toBeInTheDocument();
  });
  
  it("switches between login and signup forms", () => {
    render(<Authentication />);
    
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
    render(<Authentication />);
    
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
    render(<Authentication />);
    
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
    render(<Authentication />);
    
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
    render(<Authentication />);
    
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
    (useAuth as jest.Mock).mockReturnValue({
      signIn,
      signUp,
      loading: true,
    });
    
    render(<Authentication />);
    
    // Should show loading text on button
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Entrando..." })).toBeDisabled();
    
    // Switch to signup
    fireEvent.click(screen.getByRole("tab", { name: "Cadastro" }));
    
    // Should show loading text on signup button
    expect(screen.getByRole("button", { name: "Cadastrando..." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrando..." })).toBeDisabled();
  });
});
