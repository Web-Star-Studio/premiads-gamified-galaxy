
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
  const { signIn, loading } = useAuthMethods();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors: newErrors } = validateLogin({ email, password });
    setErrors(newErrors);
    if (!valid) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    try {
      const success = await signIn({ email, password });
      if (success) onSuccess();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o login. Verifique suas credenciais.",
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
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>
      <Button type="submit" className="w-full neon-button" disabled={loading}>
        {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default LoginForm;
