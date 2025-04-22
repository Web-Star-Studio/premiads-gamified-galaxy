
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useAuth, SignUpCredentials, SignInCredentials } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Particles from "@/components/Particles";
import { UserType } from "@/types/auth";

const Authentication = () => {
  const [activeTab, setActiveTab] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("participante");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [searchParams] = useSearchParams();
  const [passwordResetMode, setPasswordResetMode] = useState(false);
  
  const { signIn, signUp, loading, resetPassword, updatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for password reset mode
  useEffect(() => {
    const isReset = searchParams.get('reset') === 'true';
    if (isReset) {
      setPasswordResetMode(true);
      setActiveTab('reset');
    }
  }, [searchParams]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    const credentials: SignInCredentials = {
      email,
      password
    };
    
    try {
      await signIn(credentials);
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }
    
    const credentials: SignUpCredentials = {
      email,
      password,
      name,
      userType
    };
    
    try {
      await signUp(credentials);
      setActiveTab("login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordResetMode) {
      // Update password mode
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
      
      try {
        await updatePassword(password);
        setActiveTab("login");
        setPasswordResetMode(false);
      } catch (error) {
        console.error("Password update error:", error);
      }
    } else {
      // Request password reset mode
      if (!email) {
        toast({
          title: "Email obrigatório",
          description: "Por favor, digite seu email para recuperar a senha.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        await resetPassword(email);
      } catch (error) {
        console.error("Password reset error:", error);
      }
    }
  };
  
  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
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
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-galaxy-dark"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button 
                    type="button" 
                    variant="link" 
                    className="text-xs text-neon-pink hover:underline"
                    onClick={() => setActiveTab("reset")}
                  >
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-galaxy-dark"
                />
              </div>
              
              <Button type="submit" className="w-full bg-neon-cyan/80 hover:bg-neon-cyan" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-galaxy-dark"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-galaxy-dark"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-signup">Senha</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-galaxy-dark"
                />
                {password && password.length < 6 && (
                  <p className="text-red-400 text-xs">A senha deve ter pelo menos 6 caracteres</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Tipo de conta</Label>
                {!showAdvancedOptions ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={userType === "participante" ? "default" : "outline"}
                      className={userType === "participante" ? "bg-neon-cyan/80 hover:bg-neon-cyan" : ""}
                      onClick={() => setUserType("participante")}
                    >
                      Participante
                    </Button>
                    <Button
                      type="button"
                      variant={userType === "anunciante" ? "default" : "outline"}
                      className={userType === "anunciante" ? "bg-neon-pink/80 hover:bg-neon-pink" : ""}
                      onClick={() => setUserType("anunciante")}
                    >
                      Anunciante
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={userType === "admin" ? "default" : "outline"}
                      className={userType === "admin" ? "bg-purple-600/80 hover:bg-purple-600" : ""}
                      onClick={() => setUserType("admin")}
                    >
                      Admin
                    </Button>
                    <Button
                      type="button"
                      variant={userType === "moderator" ? "default" : "outline"}
                      className={userType === "moderator" ? "bg-indigo-600/80 hover:bg-indigo-600" : ""}
                      onClick={() => setUserType("moderator")}
                    >
                      Moderador
                    </Button>
                  </div>
                )}
                <div className="text-center mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleAdvancedOptions}
                    className="text-xs text-muted-foreground"
                  >
                    {showAdvancedOptions ? "Opções Básicas" : "Opções Avançadas"}
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="reset">
            <form onSubmit={handleResetPassword} className="space-y-4">
              {!passwordResetMode ? (
                // Request password reset form
                <>
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
                </>
              ) : (
                // Set new password form
                <>
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
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="bg-galaxy-dark"
                    />
                    {confirmPassword && password !== confirmPassword && (
                      <p className="text-red-400 text-xs">As senhas não coincidem</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full bg-neon-pink/80 hover:bg-neon-pink" disabled={loading}>
                    {loading ? "Atualizando..." : "Atualizar senha"}
                  </Button>
                </>
              )}
            </form>
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
