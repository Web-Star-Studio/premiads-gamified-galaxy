
import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

type EmailNotConfirmedBoxProps = {
  resendLoading: boolean;
  onResend: () => void;
};

const EmailNotConfirmedBox: React.FC<EmailNotConfirmedBoxProps> = ({
  resendLoading,
  onResend,
}) => (
  <div className="bg-yellow-50 border border-yellow-400 rounded-md p-3 text-yellow-800 mt-2 text-sm flex flex-col items-center">
    <span>Seu email ainda não foi confirmado.</span>
    <Button
      type="button"
      variant="outline"
      className="mt-2"
      onClick={onResend}
      disabled={resendLoading}
    >
      {resendLoading ? <Icons.spinner className="animate-spin w-4 h-4 mr-2" /> : null}
      Reenviar email de confirmação
    </Button>
    <span className="text-xs text-muted-foreground mt-1">
      Verifique sua caixa de entrada/spam.
    </span>
  </div>
);

export default EmailNotConfirmedBox;
