
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Share2, 
  Copy, 
  Award, 
  ChevronRight, 
  Mail, 
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
  CheckCircle,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useUser } from "@/context/UserContext";
import { useReferrals } from "@/hooks/useReferrals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import ReferralProgram from "@/components/client/ReferralProgram";

// Mock rewards data - in a real app, this would come from the database
const MOCK_REWARDS = [
  {
    id: 1,
    description: "Bônus de indicação - 3 amigos",
    type: "points" as const,
    value: 500,
    status: "claimed" as const
  },
  {
    id: 2,
    description: "Bônus de indicação - 5 amigos",
    type: "points" as const,
    value: 1000,
    status: "available" as const
  },
  {
    id: 3,
    description: "Bilhetes extras para sorteio",
    type: "tickets" as const,
    value: 3,
    status: "available" as const,
    expiresAt: "2025-05-30"
  },
  {
    id: 4,
    description: "Acesso VIP - Evento exclusivo",
    type: "special" as const,
    value: 1,
    status: "available" as const,
    expiresAt: "2025-06-15"
  }
];

const ClientReferrals = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { 
    loading, 
    referrals, 
    referralCode, 
    referralLink, 
    sendInvites 
  } = useReferrals();
  
  const [rewards, setRewards] = useState(MOCK_REWARDS);
  const [emailInputs, setEmailInputs] = useState<string[]>(["", "", ""]);
  const [inviteMessage, setInviteMessage] = useState("Junte-se a mim no PremiAds e ganhe pontos para trocar por prêmios incríveis! Use meu código:");

  useEffect(() => {
    // Redirect if user is not a participant
    if (userType !== "participante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [userType, navigate, toast]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    playSound("pop");
    toast({
      title: "Código copiado!",
      description: "Código de referência copiado para a área de transferência.",
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    playSound("pop");
    toast({
      title: "Link copiado!",
      description: "Link de referência copiado para a área de transferência.",
    });
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emailInputs];
    newEmails[index] = value;
    setEmailInputs(newEmails);
  };

  const handleSendInvites = async () => {
    // Filter out empty emails
    const validEmails = emailInputs.filter(email => email.trim() !== "");
    
    if (validEmails.length === 0) {
      playSound("error");
      toast({
        title: "Nenhum email válido",
        description: "Por favor, insira pelo menos um email para enviar convites.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await sendInvites(validEmails, inviteMessage);
    
    if (success) {
      // Reset email inputs
      setEmailInputs(["", "", ""]);
    }
  };

  const handleClaimReward = (rewardId: number) => {
    setRewards(rewards.map(reward => 
      reward.id === rewardId 
        ? { ...reward, status: "claimed" } 
        : reward
    ));
    
    playSound("reward");
    toast({
      title: "Recompensa resgatada!",
      description: "Sua recompensa foi adicionada à sua conta.",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-neon-cyan border-galaxy-purple rounded-full animate-spin"></div>
          <h2 className="text-xl font-heading neon-text-cyan">Carregando seu programa de referência...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <ClientDashboardHeader 
          title="Programa de Referência" 
          description="Convide seus amigos e ganhe recompensas exclusivas" 
          userName={userName} 
          showBackButton={true}
          backTo="/cliente"
        />
        
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <ReferralProgram />
              </motion.div>
            </div>
            
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-panel p-6"
              >
                <Tabs defaultValue="share">
                  <TabsList className="grid w-full grid-cols-3 bg-galaxy-deepPurple/50 border border-galaxy-purple/20">
                    <TabsTrigger value="share">Compartilhar</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                    <TabsTrigger value="rewards">Recompensas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="share" className="mt-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-heading">Seu Link de Referência</h3>
                        <div className="flex gap-2">
                          <Input 
                            value={referralLink} 
                            readOnly 
                            className="bg-galaxy-deepPurple font-medium border-galaxy-purple/30"
                          />
                          <Button 
                            variant="outline" 
                            className="shrink-0 text-neon-cyan border-galaxy-purple/30"
                            onClick={handleCopyLink}
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copiar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-heading">Compartilhar nas Redes</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <Button variant="outline" className="border-galaxy-purple/30">
                            <Facebook className="w-4 h-4 mr-2 text-blue-500" />
                            Facebook
                          </Button>
                          <Button variant="outline" className="border-galaxy-purple/30">
                            <Twitter className="w-4 h-4 mr-2 text-blue-400" />
                            Twitter
                          </Button>
                          <Button variant="outline" className="border-galaxy-purple/30">
                            <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                            Instagram
                          </Button>
                          <Button variant="outline" className="border-galaxy-purple/30">
                            <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                            LinkedIn
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-heading">Convidar por Email</h3>
                        <div className="space-y-3">
                          {emailInputs.map((email, index) => (
                            <div className="relative" key={index}>
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input 
                                placeholder="Email do amigo" 
                                type="email"
                                className="pl-10"
                                value={email}
                                onChange={(e) => handleEmailChange(index, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="invite-message" className="text-sm text-gray-400">Mensagem personalizada (opcional)</label>
                          <textarea 
                            id="invite-message"
                            className="w-full min-h-[80px] p-3 rounded-md bg-galaxy-deepPurple border border-galaxy-purple/30 focus:border-neon-cyan/50 focus:outline-none"
                            value={inviteMessage}
                            onChange={(e) => setInviteMessage(e.target.value)}
                          ></textarea>
                        </div>
                        
                        <Button 
                          className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
                          onClick={handleSendInvites}
                          disabled={loading || !emailInputs.some(email => email.trim() !== "")}
                        >
                          {loading ? "Enviando..." : "Enviar Convites"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="status" className="mt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
                          <div className="text-xs text-gray-400">Total de convites</div>
                          <div className="text-xl font-semibold">{referrals.length}</div>
                        </div>
                        <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
                          <div className="text-xs text-gray-400">Pendentes</div>
                          <div className="text-xl font-semibold">
                            {referrals.filter(r => r.status === "pending").length}
                          </div>
                        </div>
                        <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
                          <div className="text-xs text-gray-400">Registrados</div>
                          <div className="text-xl font-semibold">
                            {referrals.filter(r => r.status === "registered").length}
                          </div>
                        </div>
                        <div className="bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20">
                          <div className="text-xs text-gray-400">Pontos ganhos</div>
                          <div className="text-xl font-semibold">
                            {referrals.reduce((total, ref) => total + (ref.pointsEarned || 0), 0)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-heading">Histórico de Indicações</h3>
                        
                        {referrals.length === 0 ? (
                          <div className="text-center py-8 bg-galaxy-deepPurple/20 rounded-md">
                            <Users className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-gray-400">Você ainda não tem indicações.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {referrals.map(referral => (
                              <div key={referral.id} className="bg-galaxy-deepPurple/40 p-4 rounded border border-galaxy-purple/20">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{referral.name}</h4>
                                    <p className="text-sm text-gray-400">{referral.email}</p>
                                  </div>
                                  <div className="text-right">
                                    <span className={`text-sm px-2 py-1 rounded-full ${
                                      referral.status === "completed" 
                                        ? "bg-green-500/20 text-green-400" 
                                        : referral.status === "registered" 
                                          ? "bg-blue-500/20 text-blue-400" 
                                          : "bg-yellow-500/20 text-yellow-400"
                                    }`}>
                                      {referral.status === "completed" 
                                        ? "Completo" 
                                        : referral.status === "registered" 
                                          ? "Registrado" 
                                          : "Pendente"}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center mt-2 text-sm text-gray-400">
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>Convidado em: {new Date(referral.date).toLocaleDateString('pt-BR')}</span>
                                </div>
                                
                                {referral.status !== "pending" && (
                                  <div className="mt-3 pt-3 border-t border-galaxy-purple/10 flex justify-between">
                                    <div className="text-xs text-gray-400">
                                      <span>Missões: {referral.completedMissions || 0}</span>
                                    </div>
                                    {referral.status === "completed" && (
                                      <div className="text-xs text-neon-pink">
                                        <span>+{referral.pointsEarned} pontos</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rewards" className="mt-6">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-heading">Recompensas de Indicação</h3>
                        <span className="text-sm text-gray-400">
                          {referrals.filter(r => r.status === "completed").length} de {referrals.length} indicações completadas
                        </span>
                      </div>
                      
                      <div className="w-full bg-galaxy-deepPurple/40 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-neon-pink to-neon-cyan h-full rounded-full" 
                          style={{ width: `${(referrals.filter(r => r.status === "completed").length / 5) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        {rewards.map(reward => (
                          <div key={reward.id} className="bg-galaxy-deepPurple/40 p-4 rounded border border-galaxy-purple/20">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${
                                  reward.type === "points" 
                                    ? "bg-neon-pink/20" 
                                    : reward.type === "tickets" 
                                      ? "bg-neon-cyan/20" 
                                      : "bg-purple-500/20"
                                }`}>
                                  {reward.type === "points" ? (
                                    <Award className="w-6 h-6 text-neon-pink" />
                                  ) : reward.type === "tickets" ? (
                                    <MessageSquare className="w-6 h-6 text-neon-cyan" />
                                  ) : (
                                    <Award className="w-6 h-6 text-purple-400" />
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium">{reward.description}</h4>
                                  <p className="text-sm text-gray-400">
                                    {reward.type === "points" 
                                      ? `${reward.value} pontos` 
                                      : reward.type === "tickets" 
                                        ? `${reward.value} bilhetes` 
                                        : "Benefício VIP"}
                                  </p>
                                  {reward.expiresAt && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      Expira em: {new Date(reward.expiresAt).toLocaleDateString('pt-BR')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {reward.status === "available" ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="border-galaxy-purple/30 text-neon-cyan"
                                  onClick={() => handleClaimReward(reward.id)}
                                >
                                  Resgatar
                                </Button>
                              ) : (
                                <div className="flex items-center text-green-400 text-sm">
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Resgatado
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientReferrals;
