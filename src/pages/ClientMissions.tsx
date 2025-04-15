
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Image, 
  CheckCircle, 
  Clock, 
  Filter, 
  Search, 
  SlidersHorizontal, 
  Camera,
  Upload,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useUser } from "@/context/UserContext";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

// Types for missions
type MissionStatus = "available" | "in_progress" | "completed" | "pending_approval";

interface Mission {
  id: number;
  title: string;
  description: string;
  brand: string;
  type: "survey" | "photo" | "video" | "visit" | "share";
  points: number;
  deadline: string;
  status: MissionStatus;
  requirements: string[];
}

// Mock data
const MOCK_MISSIONS: Mission[] = [
  {
    id: 1,
    title: "Avalie nosso novo produto",
    description: "Compartilhe sua opinião sobre nosso lançamento e ganhe pontos!",
    brand: "TechGadgets",
    type: "survey",
    points: 150,
    deadline: "2025-05-01",
    status: "available",
    requirements: ["Ter mais de 18 anos", "Responder todas as perguntas da pesquisa"]
  },
  {
    id: 2,
    title: "Tire uma foto com nosso produto",
    description: "Mostre como você usa nosso produto no dia a dia",
    brand: "FashionStyle",
    type: "photo",
    points: 200,
    deadline: "2025-04-25",
    status: "available",
    requirements: ["Fotografar o produto em uso", "Garantir que a marca esteja visível"]
  },
  {
    id: 3,
    title: "Compartilhe nas redes sociais",
    description: "Compartilhe nossa promoção nas suas redes sociais",
    brand: "FitLife",
    type: "share",
    points: 100,
    deadline: "2025-04-30",
    status: "in_progress",
    requirements: ["Fazer o post com a hashtag #FitLifePromo", "Deixar o post público por 7 dias"]
  },
  {
    id: 4,
    title: "Visite nossa loja",
    description: "Faça check-in em uma de nossas lojas físicas",
    brand: "HomeDecor",
    type: "visit",
    points: 180,
    deadline: "2025-05-10",
    status: "completed",
    requirements: ["Permanecer na loja por pelo menos 10 minutos", "Fazer check-in pelo aplicativo"]
  },
  {
    id: 5,
    title: "Grave um vídeo de review",
    description: "Crie um vídeo falando sobre sua experiência com nosso serviço",
    brand: "StreamFlix",
    type: "video",
    points: 300,
    deadline: "2025-05-15",
    status: "pending_approval",
    requirements: ["Vídeo entre 30 segundos e 2 minutos", "Mencionar pelo menos 3 funcionalidades"]
  }
];

const ClientMissions = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [missionAnswer, setMissionAnswer] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    // Load missions (mock data for now)
    setTimeout(() => {
      setMissions(MOCK_MISSIONS);
      setLoading(false);
      playSound("chime");
    }, 1000);
  }, [userType, navigate, toast, playSound]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
    playSound("pop");
  };

  const handleStartMission = () => {
    if (!selectedMission) return;
    
    setIsSubmissionOpen(true);
    playSound("pop");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImagePreview(null);
  };

  const handleSubmitMission = () => {
    if (!selectedMission) return;

    setLoading(true);
    
    // Simulate submission process
    setTimeout(() => {
      // Update mission status
      const updatedMissions = missions.map(mission => 
        mission.id === selectedMission.id 
          ? { ...mission, status: "pending_approval" as MissionStatus } 
          : mission
      );
      
      setMissions(updatedMissions);
      setSelectedMission(null);
      setIsSubmissionOpen(false);
      setMissionAnswer("");
      setImagePreview(null);
      setAgreedToTerms(false);
      setLoading(false);
      
      playSound("reward");
      toast({
        title: "Missão enviada com sucesso!",
        description: "Sua submissão está em análise e será avaliada em breve.",
      });
    }, 1500);
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
          <h2 className="text-xl font-heading neon-text-cyan">Carregando missões disponíveis...</h2>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-galaxy-dark pb-20">
      <div className="container px-4 py-8 mx-auto">
        <ClientDashboardHeader 
          title="Missões e Desafios" 
          description="Complete missões, ganhe pontos e resgate prêmios exclusivos" 
          userName={userName} 
          showBackButton={true}
          backTo="/cliente"
        />
        
        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar missões..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" className="md:w-auto">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Ordenar
            </Button>
          </div>
          
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-galaxy-deepPurple/50 border border-galaxy-purple/20">
              <TabsTrigger value="available">Disponíveis</TabsTrigger>
              <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="completed">Concluídas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="glass-panel p-4">
                    <h3 className="text-lg font-heading mb-4">Missões Disponíveis</h3>
                    
                    {filteredMissions.filter(m => m.status === "available").length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Nenhuma missão disponível no momento.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredMissions
                          .filter(m => m.status === "available")
                          .map(mission => (
                            <div 
                              key={mission.id}
                              className={`bg-galaxy-deepPurple/40 p-3 rounded border border-galaxy-purple/20 cursor-pointer transition-all hover:border-neon-cyan/40 ${selectedMission?.id === mission.id ? 'border-neon-cyan' : ''}`}
                              onClick={() => handleMissionClick(mission)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{mission.title}</h4>
                                  <p className="text-sm text-gray-400">{mission.brand}</p>
                                </div>
                                <Badge variant="secondary">{mission.points} pts</Badge>
                              </div>
                              <div className="flex items-center mt-2 text-xs text-gray-400">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>Prazo: {new Date(mission.deadline).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  {selectedMission ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel p-6"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-heading">{selectedMission.title}</h2>
                          <p className="text-sm text-gray-400">{selectedMission.brand}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="text-lg px-3 py-1 bg-neon-cyan/20 text-neon-cyan"
                        >
                          {selectedMission.points} pts
                        </Badge>
                      </div>
                      
                      <p className="mb-6">{selectedMission.description}</p>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Requisitos</h3>
                        <ul className="space-y-1 list-disc pl-5">
                          {selectedMission.requirements.map((req, index) => (
                            <li key={index} className="text-gray-300">{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Tipo de Missão</h3>
                        <div className="flex items-center">
                          {selectedMission.type === "survey" && <FileText className="w-5 h-5 mr-2 text-neon-pink" />}
                          {selectedMission.type === "photo" && <Image className="w-5 h-5 mr-2 text-neon-pink" />}
                          {selectedMission.type === "video" && <Camera className="w-5 h-5 mr-2 text-neon-pink" />}
                          {selectedMission.type === "visit" && <CheckCircle className="w-5 h-5 mr-2 text-neon-pink" />}
                          {selectedMission.type === "share" && <Upload className="w-5 h-5 mr-2 text-neon-pink" />}
                          <span className="capitalize">{selectedMission.type.replace("_", " ")}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Prazo: {new Date(selectedMission.deadline).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80"
                        onClick={handleStartMission}
                      >
                        Iniciar Missão
                      </Button>
                    </motion.div>
                  ) : (
                    <div className="glass-panel p-8 text-center h-full flex flex-col items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          repeat: Infinity,
                          repeatType: "reverse",
                          duration: 2
                        }}
                      >
                        <div className="w-24 h-24 rounded-full bg-galaxy-deepPurple/50 flex items-center justify-center border border-neon-cyan/30">
                          <FileText className="w-12 h-12 text-neon-cyan" />
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-heading mt-6">Selecione uma Missão</h3>
                      <p className="text-gray-400 mt-2 max-w-md">
                        Escolha uma das missões disponíveis para ver detalhes e iniciar sua participação.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="in_progress" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredMissions.filter(m => m.status === "in_progress").length === 0 ? (
                  <div className="glass-panel p-8 text-center">
                    <p className="text-gray-400">Você não tem missões em progresso no momento.</p>
                  </div>
                ) : (
                  filteredMissions
                    .filter(m => m.status === "in_progress")
                    .map(mission => (
                      <div 
                        key={mission.id}
                        className="glass-panel p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{mission.title}</h4>
                            <p className="text-sm text-gray-400">{mission.brand}</p>
                          </div>
                          <Badge variant="secondary">{mission.points} pts</Badge>
                        </div>
                        <p className="mt-2 mb-4">{mission.description}</p>
                        <div className="flex justify-end">
                          <Button className="bg-neon-cyan text-galaxy-dark hover:bg-neon-cyan/80">
                            Continuar
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="pending" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredMissions.filter(m => m.status === "pending_approval").length === 0 ? (
                  <div className="glass-panel p-8 text-center">
                    <p className="text-gray-400">Você não tem missões pendentes de aprovação no momento.</p>
                  </div>
                ) : (
                  filteredMissions
                    .filter(m => m.status === "pending_approval")
                    .map(mission => (
                      <div 
                        key={mission.id}
                        className="glass-panel p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{mission.title}</h4>
                            <p className="text-sm text-gray-400">{mission.brand}</p>
                          </div>
                          <Badge className="bg-yellow-600">{mission.points} pts</Badge>
                        </div>
                        <p className="mt-2 mb-2">{mission.description}</p>
                        <div className="bg-yellow-600/20 rounded p-2 text-sm">
                          <p className="text-yellow-300">Aguardando aprovação do anunciante</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 gap-4">
                {filteredMissions.filter(m => m.status === "completed").length === 0 ? (
                  <div className="glass-panel p-8 text-center">
                    <p className="text-gray-400">Você não tem missões concluídas ainda.</p>
                  </div>
                ) : (
                  filteredMissions
                    .filter(m => m.status === "completed")
                    .map(mission => (
                      <div 
                        key={mission.id}
                        className="glass-panel p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{mission.title}</h4>
                            <p className="text-sm text-gray-400">{mission.brand}</p>
                          </div>
                          <Badge className="bg-green-600">{mission.points} pts</Badge>
                        </div>
                        <p className="mt-2 mb-2">{mission.description}</p>
                        <div className="bg-green-600/20 rounded p-2 text-sm flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          <p className="text-green-400">Concluída e aprovada</p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Mission Submission Dialog */}
      <Dialog open={isSubmissionOpen} onOpenChange={setIsSubmissionOpen}>
        <DialogContent className="bg-galaxy-deepPurple border-galaxy-purple">
          <DialogHeader>
            <DialogTitle>Submeter Missão</DialogTitle>
            <DialogDescription>
              {selectedMission?.title} - {selectedMission?.brand}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 my-4">
            {selectedMission?.type === "survey" && (
              <div className="space-y-2">
                <Label htmlFor="answer">Sua resposta</Label>
                <Textarea 
                  id="answer"
                  placeholder="Digite sua resposta aqui..."
                  className="min-h-[150px]"
                  value={missionAnswer}
                  onChange={(e) => setMissionAnswer(e.target.value)}
                />
              </div>
            )}
            
            {(selectedMission?.type === "photo" || selectedMission?.type === "video") && (
              <div className="space-y-2">
                <Label>Enviar {selectedMission.type === "photo" ? "foto" : "vídeo"}</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-[200px] w-full object-cover rounded-md" 
                    />
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={handleClearImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center">
                    <Camera className="mx-auto h-8 w-8 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="file-upload" className="cursor-pointer text-neon-cyan hover:underline">
                        Clique para enviar
                      </label>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept={selectedMission.type === "photo" ? "image/*" : "video/*"}
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedMission.type === "photo" 
                        ? "PNG, JPG ou GIF até 5MB" 
                        : "MP4 ou MOV até 50MB"}
                    </p>
                  </div>
                )}
                
                {selectedMission.type === "photo" && (
                  <p className="text-sm text-gray-400">
                    Dica: Certifique-se de que a foto esteja bem iluminada e claramente mostrando o produto.
                  </p>
                )}
              </div>
            )}
            
            {selectedMission?.type === "share" && (
              <div className="space-y-2">
                <Label htmlFor="share-link">Link da postagem</Label>
                <Input
                  id="share-link"
                  placeholder="Cole o link da sua postagem aqui..."
                  value={missionAnswer}
                  onChange={(e) => setMissionAnswer(e.target.value)}
                />
                <p className="text-sm text-gray-400">
                  Cole o link da sua postagem nas redes sociais contendo a hashtag solicitada.
                </p>
              </div>
            )}
            
            {selectedMission?.type === "visit" && (
              <div className="space-y-2">
                <Label>Check-in na loja</Label>
                <div className="bg-galaxy-deepPurple/80 rounded-md p-4">
                  <p className="text-center">
                    Pressione o botão abaixo para realizar check-in usando sua localização atual
                  </p>
                  <Button className="w-full mt-4">
                    Fazer Check-in
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-2 pt-4">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Declaro que li e concordo com os termos de submissão
                </Label>
                <p className="text-sm text-gray-400">
                  Autorizo o uso do conteúdo enviado para fins promocionais.
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmissionOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitMission}
              disabled={
                (!missionAnswer && !imagePreview && selectedMission?.type !== "visit") || 
                !agreedToTerms || 
                loading
              }
            >
              {loading ? "Enviando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientMissions;
