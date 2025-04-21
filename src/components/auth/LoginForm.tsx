
import { useState } from "react";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/Icons";
import { validateLogin } from "./authValidation";
import { resendConfirmationEmail } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  onSuccess: () => void;
};

const LoginForm = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { signIn, loading } = useAuthMethods();
  const { toast } = useToast();

  // Timeout de loading para login travado
  function triggerTimeout() {
    setLoadingTimeout(false);
    setTimeout(() => {
      if (loading) setLoadingTimeout(true);
    }, 10000);
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTimeout(false);
    setEmailNotConfirmed(false);

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

    // Timer para detectar loading travado
    triggerTimeout();

    setLoginAttempt(prev => prev + 1);

    try {
      const success = await signIn({ email, password });

      // Espera alguns ms para garantir status de session/email.
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Buscar o usuário diretamente no supabase para checar status de email
      const {
        data: { user },
        error: userLookupError,
      } = await supabase.auth.getUser(email);

      if (userLookupError) {
        console.error("Erro ao buscar usuário pelo email:", userLookupError);
      }

      // Se sucesso e usuário com email confirmado, segue pro fluxo normal
      if (success && user && user.email_confirmed_at) {
        setErrors({});
        setLoginAttempt(0);
        setEmailNotConfirmed(false);
        setLoadingTimeout(false);
        onSuccess();
        return;
      }

      // Se login funciona mas email não está confirmado
      if (success && user && !user.email_confirmed_at) {
        setEmailNotConfirmed(true);
        setLoadingTimeout(false);
        toast({
          title: "Confirmação de email necessária",
          description: "Seu email ainda não foi confirmado. Verifique sua caixa de entrada ou reenvie o email de confirmação abaixo.",
          variant: "destructive",
        });
        return;
      }

      if (!success && loginAttempt >= 2) {
        toast({
          title: "Problemas para entrar?",
          description: "Verifique seu email e senha. Se esqueceu sua senha, use a opção 'Esqueci minha senha'.",
          variant: "destructive",
          duration: 6000,
        });
      }
    } catch (error: any) {
      // Checagem extra: se for email não confirmado
      if (error?.message?.includes("Email not confirmed")) {
        setEmailNotConfirmed(true);
        setLoadingTimeout(false);
        toast({
          title: "Confirmação de email necessária",
          description: "Seu email ainda não foi confirmado. Reenvie o email de verificação abaixo.",
          variant: "destructive",
        });
        return;
      }

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

  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      await resendConfirmationEmail(email);
      toast({
        title: "Email de confirmação enviado!",
        description: "Cheque sua caixa de entrada. O email pode levar alguns minutos.",
        variant: "default",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao reenviar confirmação",
        description: err?.message || "Não foi possível reenviar o email. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Sessão travada
  if (loadingTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[260px] p-4 space-y-3">
        <Icons.spinner className="animate-spin w-6 h-6 text-neon-cyan mx-auto" />
        <p className="text-center text-neon-cyan font-semibold">
          A verificação de login está demorando mais que o esperado.
        </p>
        <p className="text-center text-muted-foreground text-sm">
          Verifique sua conexão ou tente novamente. Se o problema persistir, aguarde alguns minutos.
        </p>
        <Button variant="outline" className="mt-2" onClick={() => setLoadingTimeout(false)}>
          Tentar novamente
        </Button>
      </div>
    );
  }

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
          Esqueceu sua senha?{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Recuperar senha
          </a>
        </p>
      )}

      {emailNotConfirmed && (
        <div className="bg-yellow-50 border border-yellow-400 rounded-md p-3 text-yellow-800 mt-2 text-sm flex flex-col items-center">
          <span>Seu email ainda não foi confirmado.</span>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={handleResendEmail}
            disabled={resendLoading}
          >
            {resendLoading ? <Icons.spinner className="animate-spin w-4 h-4 mr-2" /> : null}
            Reenviar email de confirmação
          </Button>
          <span className="text-xs text-muted-foreground mt-1">
            Verifique sua caixa de entrada/spam.
          </span>
        </div>
      )}
    </form>
  );
};

export default LoginForm;
