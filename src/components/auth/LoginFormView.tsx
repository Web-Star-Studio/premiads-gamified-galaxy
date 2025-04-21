
import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import LoginFields from "./LoginFields";

type Props = {
  email: string;
  password: string;
  errors: Record<string, string>;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showForgot: boolean;
  forgotPrompt: React.ReactNode;
  emailNotConfirmed: boolean;
  resendLoading: boolean;
  onResend: () => void;
  emailNotConfirmedBoxComponent?: React.ReactNode;
};

const LoginFormView: React.FC<Props> = ({
  email,
  password,
  errors,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  showForgot,
  forgotPrompt,
  emailNotConfirmedBoxComponent
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <LoginFields
      email={email}
      password={password}
      errors={errors}
      loading={loading}
      setEmail={onEmailChange}
      setPassword={onPasswordChange}
    />
    <Button type="submit" className="w-full neon-button" disabled={loading}>
      {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? "Entrando..." : "Entrar"}
    </Button>
    {showForgot && forgotPrompt}
    {emailNotConfirmedBoxComponent}
  </form>
);

export default LoginFormView;
