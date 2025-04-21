
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthMethods } from "@/hooks/useAuthMethods";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Particles from "@/components/Particles";

// Use a more specific type for signup userType that excludes "admin"
type SignupUserType = "participante" | "anunciante";

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthOverlay = ({ isOpen, onClose }: AuthOverlayProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<SignupUserType>("participante");
  const { signIn, signUp, loading } = useAuthMethods();
  const { toast } = useToast();
  
  // Reset form when overlay opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab("login");
      setEmail("");
      setPassword("");
      setName("");
      setUserType("participante");
    }
  }, [isOpen]);
  
  const validateLogin = () => {
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  const validateSignup = () => {
    if (!name || !email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    try {
      const success = await signIn({ email, password });
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    
    try {
      const success = await signUp({ name, email, password, userType });
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <Particles className="absolute inset-0" count={30} />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 w-full max-w-md mx-4 glass-panel border border-galaxy-purple/50 p-6 rounded-lg shadow-xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
                PremiAds
              </h2>
              <p className="text-gray-300 mt-1">Entrar ou criar sua conta</p>
            </div>
            
            {/* Auth tabs */}
            <Tabs defaultValue="login" value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full neon-button"
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Input 
                      type="text"
                      placeholder="Seu nome"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input 
                      type="password"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="bg-galaxy-deepPurple/50 border-galaxy-purple/30"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-300 mb-2">Você é:</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        type="button"
                        variant={userType === "participante" ? "default" : "outline"}
                        className={userType === "participante" ? "bg-neon-cyan text-galaxy-dark" : ""}
                        onClick={() => setUserType("participante")}
                        disabled={loading}
                      >
                        Participante
                      </Button>
                      
                      <Button
                        type="button"
                        variant={userType === "anunciante" ? "default" : "outline"}
                        className={userType === "anunciante" ? "bg-neon-pink text-galaxy-dark" : ""}
                        onClick={() => setUserType("anunciante")}
                        disabled={loading}
                      >
                        Anunciante
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full neon-button"
                    disabled={loading}
                  >
                    {loading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <button 
                onClick={onClose}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Voltar para a página inicial
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthOverlay;
