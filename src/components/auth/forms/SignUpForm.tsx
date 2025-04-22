
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpCredentials, UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";

interface SignUpFormProps {
  loading: boolean;
  onSubmit: (credentials: SignUpCredentials) => Promise<void>;
}

const SignUpForm = ({ loading, onSubmit }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    await onSubmit({ email, password, name, userType });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-galaxy-dark"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-signup">Email</Label>
        <Input
          id="email-signup"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-galaxy-dark"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password-signup">Senha</Label>
        <Input
          id="password-signup"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-galaxy-dark"
        />
        {password && password.length < 6 && (
          <p className="text-red-400 text-xs">A senha deve ter pelo menos 6 caracteres</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Tipo de conta</Label>
        {!showAdvancedOptions ? (
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={userType === "participante" ? "default" : "outline"}
              className={userType === "participante" ? "bg-neon-cyan/80 hover:bg-neon-cyan" : ""}
              onClick={() => setUserType("participante")}
            >
              Participante
            </Button>
            <Button
              type="button"
              variant={userType === "anunciante" ? "default" : "outline"}
              className={userType === "anunciante" ? "bg-neon-pink/80 hover:bg-neon-pink" : ""}
              onClick={() => setUserType("anunciante")}
            >
              Anunciante
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={userType === "admin" ? "default" : "outline"}
              className={userType === "admin" ? "bg-purple-600/80 hover:bg-purple-600" : ""}
              onClick={() => setUserType("admin")}
            >
              Admin
            </Button>
            <Button
              type="button"
              variant={userType === "moderator" ? "default" : "outline"}
              className={userType === "moderator" ? "bg-indigo-600/80 hover:bg-indigo-600" : ""}
              onClick={() => setUserType("moderator")}
            >
              Moderador
            </Button>
          </div>
        )}
        <div className="text-center mt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="text-xs text-muted-foreground"
          >
            {showAdvancedOptions ? "Opções Básicas" : "Opções Avançadas"}
          </Button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
};

export default SignUpForm;
