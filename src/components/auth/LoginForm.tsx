
import { useState } from "react";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/Icons";
import { validateLogin } from "./authValidation";

type Props = {
  onSuccess: () => void;
};

const LoginForm = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempt, setLoginAttempt] = useState(0);
  const { signIn, loading } = useAuthMethods();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    const { valid, errors: newErrors } = validateLogin({ email, password });
    setErrors(newErrors);
    
    if (!valid) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos corretamente.",
        variant: "destructive",
      });
      return;
    }
    
    // Track login attempt to provide more detailed feedback on multiple failures
    setLoginAttempt(prev => prev + 1);
    
    try {
      const success = await signIn({ email, password });
      
      if (success) {
        // Reset errors and counter on success
        setErrors({});
        setLoginAttempt(0);
        onSuccess();
      } else if (loginAttempt >= 2) {
        // Show more detailed help after multiple failures
        toast({
          title: "Problemas para entrar?",
          description: "Verifique seu email e senha. Se esqueceu sua senha, use a opção 'Esqueci minha senha'.",
          variant: "destructive",
          duration: 6000,
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Show specific error message based on error type
      let errorMessage = "Não foi possível realizar o login. Verifique suas credenciais.";
      
      if (error?.message?.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos. Verifique suas credenciais.";
      } else if (error?.message?.includes("Email not confirmed")) {
        errorMessage = "Por favor, confirme seu email antes de fazer login.";
      } else if (error?.message?.includes("rate limit")) {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
      } else if (error?.message?.includes("network")) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      }
      
      toast({
        title: "Erro de login",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          type="email"
          id="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input
          type="password"
          id="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <Button type="submit" className="w-full neon-button" disabled={loading}>
        {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Entrando..." : "Entrar"}
      </Button>
      
      {loginAttempt > 0 && (
        <p className="text-sm text-muted-foreground mt-2">
          Esqueceu sua senha? <a href="#" className="text-blue-400 hover:underline">Recuperar senha</a>
        </p>
      )}
    </form>
  );
};

export default LoginForm;
