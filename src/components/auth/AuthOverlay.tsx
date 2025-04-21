import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useState } from "react";

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay = ({ isOpen, onClose }: AuthOverlayProps) => {
  const [isLogin, setIsLogin] = useState(true);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark/80 backdrop-blur-md"
      onClick={onClose}
      data-testid="auth-overlay"
    >
      <motion.div
        className="glass-panel p-6 w-full max-w-md mx-4 relative z-10"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          PremiAds
        </h2>
        <div className="flex justify-center mb-4">
          <Button
            variant={isLogin ? "default" : "outline"}
            className="w-1/2 rounded-r-none"
            onClick={() => setIsLogin(true)}
            data-testid="login-tab"
          >
            Login
          </Button>
          <Button
            variant={!isLogin ? "default" : "outline"}
            className="w-1/2 rounded-l-none"
            onClick={() => setIsLogin(false)}
            data-testid="signup-tab"
          >
            Cadastro
          </Button>
        </div>
        {isLogin ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <SignupForm onSuccess={onClose} />
        )}
        <Button
          variant="link"
          className="w-full mt-2"
          onClick={onClose}
        >
          Voltar para a página inicial
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AuthOverlay;
