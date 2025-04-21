import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/Icons";

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay = ({ isOpen, onClose }: AuthOverlayProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"participante" | "anunciante">("participante");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { signUp, signIn, loading } = useAuthMethods();
  const { toast } = useToast();

  const validateSignup = () => {
    let valid = true;
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
      valid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateLogin = () => {
    let valid = true;
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;

    try {
      // Ensure only "participante" or "anunciante" is passed
      const validUserType = userType === "participante" || userType === "anunciante"
        ? userType
        : "participante";
      const success = await signUp({ name, email, password, userType: validUserType });
      if (success) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível completar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      const success = await signIn({ email, password });
      if (success) {
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível realizar o login. Verifique suas credenciais.",
        variant: "destructive"
      });
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        className="glass-panel p-6 w-full max-w-md mx-4 relative z-10"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Entrar" : "Cadastre-se"}
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            isLogin ? handleLogin() : handleSignup();
          }}
          className="space-y-4"
        >
          {!isLogin && (
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                type="text"
                id="name"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input
              type="password"
              id="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          {!isLogin && (
            <div>
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          <Button type="submit" className="w-full neon-button" disabled={loading}>
            {loading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>
        <Button
          variant="link"
          className="w-full mt-2"
          onClick={toggleAuthMode}
          disabled={loading}
        >
          {isLogin
            ? "Não tem uma conta? Cadastre-se"
            : "Já tem uma conta? Entrar"}
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AuthOverlay;
