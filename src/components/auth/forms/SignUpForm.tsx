import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpCredentials, UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { validateReferralCodeMCP } from "@/hooks/useReferrals";

interface SignUpFormProps {
  loading: boolean;
  onSubmit: (credentials: SignUpCredentials & { referralCode?: string }) => Promise<void>;
}

const SignUpForm = ({ loading, onSubmit }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [referralCode, setReferralCode] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);
  const [codeOwnerName, setCodeOwnerName] = useState<string | null>(null);
  const { toast } = useToast();


  const handleReferralCodeChange = async (code: string) => {
    setReferralCode(code);
    setCodeValid(null);
    setCodeOwnerName(null);
    
    if (code.trim().length === 0) return;
    
    if (code.trim().length < 3) {
      setCodeValid(false);
      return;
    }
    
    setValidatingCode(true);
    try {
      const result = await validateReferralCodeMCP(code.trim().toUpperCase());
              setCodeValid(result.isValid);
        if (result.isValid && result.ownerName) {
        setCodeOwnerName(result.ownerName);
      }
    } catch (error) {
      console.error('Erro ao validar código:', error);
      setCodeValid(false);
    } finally {
      setValidatingCode(false);
    }
  };

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
    
    if (referralCode && codeValid === false) {
      toast({
        title: "Código inválido",
        description: "O código de indicação inserido não é válido.",
        variant: "destructive",
      });
      return;
    }
    
    await onSubmit({ 
      email, 
      password, 
      name, 
      userType, 
      referralCode: referralCode.trim() || undefined 
    });
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
      
      {userType === "participante" && (
        <div className="space-y-2">
          <Label htmlFor="referral-code">
            Código de indicação <span className="text-muted-foreground text-xs">(opcional)</span>
          </Label>
          <div className="relative">
            <Input
              id="referral-code"
              type="text"
              placeholder="Ex: PREMIUMUSER2025"
              value={referralCode}
              onChange={(e) => handleReferralCodeChange(e.target.value)}
              className={`bg-galaxy-dark ${
                referralCode 
                  ? codeValid === true 
                    ? 'border-green-500' 
                    : codeValid === false 
                      ? 'border-red-500' 
                      : 'border-yellow-500'
                  : ''
              }`}
              disabled={validatingCode}
            />
            {validatingCode && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
            )}
          </div>
          {referralCode && (
            <p className={`text-xs ${
              codeValid === true 
                ? 'text-green-400' 
                : codeValid === false 
                  ? 'text-red-400' 
                  : 'text-yellow-400'
            }`}>
              {codeValid === true 
                ? `✓ Código válido! Você ganhará pontos extras ao se cadastrar. Dono: ${codeOwnerName}` 
                : codeValid === false 
                  ? '✗ Código inválido ou expirado.' 
                  : 'Verificando código...'}
            </p>
          )}
        </div>
      )}
      
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
