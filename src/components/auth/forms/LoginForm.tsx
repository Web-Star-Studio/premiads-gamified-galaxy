
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignInCredentials } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  loading: boolean;
  onSubmit: (credentials: SignInCredentials) => Promise<void>;
  onResetClick: () => void;
}

const LoginForm = ({ loading, onSubmit, onResetClick }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-galaxy-dark"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Button 
            type="button" 
            variant="link" 
            className="text-xs text-neon-pink hover:underline"
            onClick={onResetClick}
          >
            Esqueceu a senha?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-galaxy-dark"
        />
      </div>
      
      <Button type="submit" className="w-full bg-neon-cyan/80 hover:bg-neon-cyan" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default LoginForm;
