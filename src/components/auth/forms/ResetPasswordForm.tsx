
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ResetPasswordFormProps {
  loading: boolean;
  isPasswordResetMode: boolean;
  onSubmit: (email: string) => Promise<void>;
  onUpdatePassword: (password: string) => Promise<void>;
}

const ResetPasswordForm = ({ 
  loading, 
  isPasswordResetMode, 
  onSubmit, 
  onUpdatePassword 
}: ResetPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPasswordResetMode) {
      if (!password) {
        toast({
          title: "Senha obrigatória",
          description: "Por favor, digite sua nova senha.",
          variant: "destructive",
        });
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          title: "Senhas não coincidem",
          description: "As senhas digitadas não são iguais.",
          variant: "destructive",
        });
        return;
      }
      
      await onUpdatePassword(password);
    } else {
      if (!email) {
        toast({
          title: "Email obrigatório",
          description: "Por favor, digite seu email para recuperar a senha.",
          variant: "destructive",
        });
        return;
      }
      
      await onSubmit(email);
    }
  };

  if (isPasswordResetMode) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="new-password">Nova senha</Label>
          <Input
            id="new-password"
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-galaxy-dark"
          />
          {password && password.length < 6 && (
            <p className="text-red-400 text-xs">A senha deve ter pelo menos 6 caracteres</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirme a senha</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-galaxy-dark"
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="text-red-400 text-xs">As senhas não coincidem</p>
          )}
        </div>
        
        <Button type="submit" className="w-full bg-neon-pink/80 hover:bg-neon-pink" disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar senha"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reset-email">Email</Label>
        <Input
          id="reset-email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-galaxy-dark"
        />
      </div>
      
      <Button type="submit" className="w-full bg-neon-pink/80 hover:bg-neon-pink" disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
