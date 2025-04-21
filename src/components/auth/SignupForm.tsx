
import { useState } from "react";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/Icons";
import { validateSignup } from "./authValidation";

type Props = {
  onSuccess: () => void;
};

const SignupForm = ({ onSuccess }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"participante" | "anunciante">("participante");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signUp, loading } = useAuthMethods();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, errors: newErrors } = validateSignup({
      name,
      email,
      password,
      confirmPassword,
    });
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
      const validUserType = userType === "participante" || userType === "anunciante"
        ? userType
        : "participante";
      const success = await signUp({ name, email, password, userType: validUserType });
      if (success) onSuccess();
    } catch {
      toast({
        title: "Erro",
        description: "Não foi possível completar o cadastro. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          type="text"
          id="name"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
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
      <div>
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirmar Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={userType === "participante" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setUserType("participante")}
          disabled={loading}
        >
          Participante
        </Button>
        <Button
          type="button"
          variant={userType === "anunciante" ? "default" : "outline"}
          className="flex-1"
          onClick={() => setUserType("anunciante")}
          disabled={loading}
        >
          Anunciante
        </Button>
      </div>
      <Button type="submit" className="w-full neon-button" disabled={loading}>
        {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
};

export default SignupForm;
