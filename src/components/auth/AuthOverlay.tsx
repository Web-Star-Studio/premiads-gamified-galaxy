
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { SignUpCredentials, SignInCredentials } from "@/types/auth";
import Particles from "../Particles";
import { motion } from "framer-motion";

type AuthStep = "login" | "signup" | "profile";

const AuthOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [authStep, setAuthStep] = useState<AuthStep>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"participante" | "anunciante">("participante");
  
  const { setUserName, setUserType: setContextUserType, setIsOverlayOpen } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loading, signIn, signUp } = useAuthMethods();
  
  // Check for a redirect URL in the location state
  const from = (location.state as any)?.from || "/";
  
  useEffect(() => {
    // Prevent scrolling when overlay is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
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
    
    const success = await signIn(credentials);
    if (success) {
      onClose();
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
    
    const credentials: SignUpCredentials = {
      email,
      password,
      name,
      userType
    };
    
    const success = await signUp(credentials);
    if (success) {
      onClose();
    }
  };
  
  const handleProfileCompletion = () => {
    setUserName(name);
    setContextUserType(userType);
    
    // Close overlay and navigate to appropriate dashboard
    setTimeout(() => {
      setIsOverlayOpen(false);
      onClose();
      
      // Navigate based on user type
      if (userType === "anunciante") {
        navigate("/anunciante");
      } else {
        navigate("/cliente");
      }
    }, 500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark/90 backdrop-blur-sm"
    >
      <Particles count={30} />
      
      <div className="absolute top-0 left-0 w-full h-full bg-purple-glow opacity-20"></div>
      
      <div className="glass-panel p-6 md:p-8 max-w-md w-full mx-4 relative z-10">
        {authStep === "profile" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              {userType === "participante" 
                ? "Como podemos chamar você?" 
                : "Qual o nome da sua empresa?"}
            </h2>
            
            <div className="space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={userType === "participante" ? "Seu nome" : "Nome da empresa"}
                className="bg-galaxy-deepPurple/50 border-galaxy-purple/30 h-12"
              />
              
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAuthStep("signup")}
                  className="flex-1"
                >
                  Voltar
                </Button>
                
                <Button 
                  type="button"
                  className="neon-button flex-1"
                  onClick={handleProfileCompletion}
                >
                  Continuar
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold neon-text-cyan mb-1">PremiAds</h1>
              <p className="text-muted-foreground">Entrar ou criar sua conta</p>
            </div>
            
            <Tabs value={authStep} onValueChange={(value) => setAuthStep(value as "login" | "signup")}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
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
                      <a href="#" className="text-xs text-neon-pink hover:underline">
                        Esqueceu a senha?
                      </a>
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
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Tipo de conta</Label>
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
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Button variant="link" className="p-0 h-auto text-sm" onClick={onClose}>
                Voltar para a página inicial
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AuthOverlay;
