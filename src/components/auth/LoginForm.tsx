import { useState } from "react";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { validateLogin } from "./authValidation";
import { resendConfirmationEmail } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import LoginFields from "./LoginFields";
import LoginTimeout from "./LoginTimeout";
import EmailNotConfirmedBox from "./EmailNotConfirmedBox";

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

  // Loading timeout view
  if (loadingTimeout) {
    return <LoginTimeout onRetry={() => setLoadingTimeout(false)} />;
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <LoginFields
        email={email}
        password={password}
        errors={errors}
        loading={loading}
        setEmail={setEmail}
        setPassword={setPassword}
      />
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
        <EmailNotConfirmedBox
          resendLoading={resendLoading}
          onResend={handleResendEmail}
        />
      )}
    </form>
  );
};

export default LoginForm;
