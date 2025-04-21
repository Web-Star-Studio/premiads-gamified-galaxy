
import { useState } from "react";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { validateLogin } from "./authValidation";
import { resendConfirmationEmail } from "@/utils/auth";
import { supabase } from "@/integrations/supabase/client";
import LoginFormView from "./LoginFormView";
import EmailNotConfirmedBox from "./EmailNotConfirmedBox";
import LoginTimeout from "./LoginTimeout";
import ForgotPasswordPrompt from "./ForgotPasswordPrompt";
import { useNavigation } from "@/components/header/useNavigation";

type Props = {
  onSuccess: () => void;
};

const LoginFormContainer = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loginAttempt, setLoginAttempt] = useState(0);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const { signIn, loading } = useAuthMethods();
  const { toast } = useToast();
  const { navigateToDashboard } = useNavigation();

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

    triggerTimeout();
    setLoginAttempt(prev => prev + 1);

    try {
      const success = await signIn({ email, password });
      await new Promise((resolve) => setTimeout(resolve, 400));
      const {
        data: { user },
        error: userLookupError,
      } = await supabase.auth.getUser(email);

      if (userLookupError) {
        console.error("Erro ao buscar usuário pelo email:", userLookupError);
      }

      if (success && user && user.email_confirmed_at) {
        setErrors({});
        setLoginAttempt(0);
        setEmailNotConfirmed(false);
        setLoadingTimeout(false);
        // IMPORTANT: Immediately redirect after login
        navigateToDashboard();
        onSuccess();
        return;
      }

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

  if (loadingTimeout) {
    return <LoginTimeout onRetry={() => setLoadingTimeout(false)} />;
  }

  return (
    <LoginFormView
      email={email}
      password={password}
      errors={errors}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      showForgot={loginAttempt > 0}
      forgotPrompt={<ForgotPasswordPrompt />}
      emailNotConfirmed={emailNotConfirmed}
      resendLoading={resendLoading}
      onResend={handleResendEmail}
      emailNotConfirmedBoxComponent={
        emailNotConfirmed ? (
          <EmailNotConfirmedBox
            resendLoading={resendLoading}
            onResend={handleResendEmail}
          />
        ) : null
      }
    />
  );
};

export default LoginFormContainer;
