
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import Particles from "@/components/Particles";
import LoginForm from "@/components/auth/forms/LoginForm";
import SignUpForm from "@/components/auth/forms/SignUpForm";
import ResetPasswordForm from "@/components/auth/forms/ResetPasswordForm";
import { SignUpCredentials, SignInCredentials } from "@/types/auth";

const Authentication = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "reset">("login");
  const [searchParams] = useSearchParams();
  const [passwordResetMode, setPasswordResetMode] = useState(false);
  
  const { signIn, signUp, loading, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  // Check for password reset mode
  useEffect(() => {
    const isReset = searchParams.get('reset') === 'true';
    if (isReset) {
      setPasswordResetMode(true);
      setActiveTab('reset');
    }
  }, [searchParams]);
  
  const handleLogin = async (credentials: SignInCredentials) => {
    try {
      await signIn(credentials);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleSignup = async (credentials: SignUpCredentials) => {
    try {
      await signUp(credentials);
      setActiveTab("login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  
  const handleResetPassword = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };
  
  const handleUpdatePassword = async (password: string) => {
    try {
      await updatePassword(password);
      setActiveTab("login");
      setPasswordResetMode(false);
    } catch (error) {
      console.error("Password update error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-galaxy-dark overflow-hidden">
      <Particles count={30} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 rounded-xl border border-galaxy-purple/30 bg-galaxy-darkPurple/60 backdrop-blur-md shadow-xl"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold neon-text-cyan mb-1">PremiAds</h1>
          <p className="text-muted-foreground">Entrar ou criar sua conta</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup" | "reset")}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Cadastro</TabsTrigger>
            <TabsTrigger value="reset">Recuperar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              loading={loading} 
              onSubmit={handleLogin}
              onResetClick={() => setActiveTab("reset")}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm 
              loading={loading} 
              onSubmit={handleSignup}
            />
          </TabsContent>
          
          <TabsContent value="reset">
            <ResetPasswordForm 
              loading={loading}
              isPasswordResetMode={passwordResetMode}
              onSubmit={handleResetPassword}
              onUpdatePassword={handleUpdatePassword}
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <a href="/" className="underline hover:text-white">
            Voltar para a página inicial
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default Authentication;
