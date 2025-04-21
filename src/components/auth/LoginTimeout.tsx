
import React from "react";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";

type LoginTimeoutProps = {
  onRetry: () => void;
};

const LoginTimeout: React.FC<LoginTimeoutProps> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center min-h-[260px] p-4 space-y-3">
    <Icons.spinner className="animate-spin w-6 h-6 text-neon-cyan mx-auto" />
    <p className="text-center text-neon-cyan font-semibold">
      A verificação de login está demorando mais que o esperado.
    </p>
    <p className="text-center text-muted-foreground text-sm">
      Verifique sua conexão ou tente novamente. Se o problema persistir, aguarde alguns minutos.
    </p>
    <Button variant="outline" className="mt-2" onClick={onRetry}>
      Tentar novamente
    </Button>
  </div>
);

export default LoginTimeout;
