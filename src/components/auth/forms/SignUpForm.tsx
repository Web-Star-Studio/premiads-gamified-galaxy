import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignUpCredentials, UserType } from "@/types/auth";
import { useToast } from "@/hooks/use-toast";
import { useReferrals } from "@/hooks/useReferrals";

interface SignUpFormProps {
  loading: boolean;
  onSubmit: (credentials: SignUpCredentials & { referralCode?: string }) => Promise<void>;
}

function SignUpForm({ loading, onSubmit }: SignUpFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [referralCode, setReferralCode] = useState("");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [debouncedCode, setDebouncedCode] = useState(referralCode);

  const [validationResult, setValidationResult] = useState<{
    isValid: boolean | null;
    ownerName?: string;
    error?: string;
  }>({ isValid: null });

  const { toast } = useToast();
  const { validateReferralCode, isValidating } = useReferrals();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCode(referralCode);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [referralCode]);

  const handleValidation = useCallback(async (code: string) => {
    if (!code.trim()) {
      setValidationResult({ isValid: null });
      return;
    }

    const result = await validateReferralCode(code);
    
    setValidationResult({
      isValid: result.valid,
      ownerName: result.ownerName,
      error: result.error
    });
  }, [validateReferralCode]);

  useEffect(() => {
    if (debouncedCode) {
      handleValidation(debouncedCode);
    } else {
      setValidationResult({ isValid: null });
    }
  }, [debouncedCode, handleValidation]);

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
    
    if (referralCode && validationResult.isValid === false) {
      toast({
        title: "Código inválido",
        description: validationResult.error || "O código de indicação inserido não é válido.",
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

  const getValidationMessage = () => {
    if (isValidating) return 'Verificando código...';
    if (validationResult.isValid === true) return `✓ Código válido! Dono: ${validationResult.ownerName}`;
    if (validationResult.isValid === false) return `✗ ${validationResult.error || 'Código inválido ou expirado.'}`;
    return null;
  };

  const validationMessage = getValidationMessage();

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
              onChange={(e) => setReferralCode(e.target.value)}
              className={`bg-galaxy-dark ${
                referralCode 
                  ? validationResult.isValid === true 
                    ? 'border-green-500' 
                    : validationResult.isValid === false 
                      ? 'border-red-500' 
                      : 'border-yellow-500'
                  : ''
              }`}
              disabled={isValidating}
            />
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
              </div>
            )}
          </div>
          {referralCode && validationMessage && (
            <p className={`text-xs ${
              validationResult.isValid === true 
                ? 'text-green-400' 
                : validationResult.isValid === false 
                  ? 'text-red-400' 
                  : 'text-yellow-400'
            }`}>
              {validationMessage}
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
      
      <Button type="submit" className="w-full" disabled={loading || isValidating}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}

export default SignUpForm;
