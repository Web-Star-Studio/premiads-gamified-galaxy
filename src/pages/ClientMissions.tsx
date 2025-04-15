
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useUser } from "@/context/UserContext";
import { useMissions } from "@/hooks/useMissions";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchAndFilter from "@/components/client/missions/SearchAndFilter";
import MissionsList from "@/components/client/missions/MissionsList";
import MissionDetails from "@/components/client/missions/MissionDetails";
import FilteredMissionsList from "@/components/client/missions/FilteredMissionsList";
import MissionDialog from "@/components/client/missions/MissionDialog";
import { Loader2 } from "lucide-react";

const ClientMissions = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const { 
    loading, 
    missions, 
    selectedMission, 
    setSelectedMission, 
    currentFilter, 
    setFilter,
    submitMission
  } = useMissions({ initialFilter: "available" });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Redirect if user is not a participant
    if (userType !== "participante") {
      toast({
        title: "Acesso restrito",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [userType, navigate, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mission.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    mission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMissionClick = (mission: any) => {
    setSelectedMission(mission);
    playSound("pop");
  };

  const handleStartMission = () => {
    if (!selectedMission) return;
    
    setIsSubmissionOpen(true);
    playSound("pop");
  };

  const handleSubmitMission = async (submissionData: any) => {
    if (!selectedMission) return;
    
    setSubmitting(true);
    
    try {
      // Submit the mission
      const success = await submitMission(selectedMission.id, submissionData);
      
      if (success) {
        setSelectedMission(null);
        setIsSubmissionOpen(false);
        playSound("success");
        toast({
          title: "Missão enviada com sucesso!",
          description: "Sua submissão está sendo avaliada pela nossa equipe.",
        });
      }
    } catch (error) {
      console.error("Erro ao enviar missão:", error);
      toast({
        title: "Erro ao enviar missão",
        description: "Ocorreu um erro ao enviar sua missão. Tente novamente mais tarde.",
        variant: "destructive",
      });
      playSound("error");
    } finally {
      setSubmitting(false);
    }
  };

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
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-galaxy-dark bg-opacity-80"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-center p-6 rounded-xl bg-galaxy-deepPurple/50 border border-galaxy-purple/30"
              >
                <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-neon-cyan" />
                <h2 className="text-xl font-heading">Carregando missões...</h2>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8"
            >
              <SearchAndFilter 
                searchTerm={searchTerm}
                onSearchChange={handleSearchChange}
              />
              
              <Tabs defaultValue={currentFilter} onValueChange={(value) => setFilter(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-galaxy-deepPurple/50 border border-galaxy-purple/20">
                  <TabsTrigger value="available">Disponíveis</TabsTrigger>
                  <TabsTrigger value="in_progress">Em Progresso</TabsTrigger>
                  <TabsTrigger value="pending">Pendentes</TabsTrigger>
                  <TabsTrigger value="completed">Concluídas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="available" className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <MissionsList 
                        missions={filteredMissions} 
                        selectedMission={selectedMission} 
                        onMissionClick={handleMissionClick}
                        emptyMessage="Nenhuma missão disponível no momento."
                      />
                    </div>
                    
                    <div className="lg:col-span-2">
                      <MissionDetails 
                        mission={selectedMission}
                        onStartMission={handleStartMission}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="in_progress" className="mt-6">
                  <FilteredMissionsList 
                    missions={filteredMissions}
                    onMissionClick={(mission) => {
                      setSelectedMission(mission);
                      setIsSubmissionOpen(true);
                    }}
                    emptyMessage="Você não tem missões em progresso no momento."
                    type="in_progress"
                  />
                </TabsContent>
                
                <TabsContent value="pending" className="mt-6">
                  <FilteredMissionsList 
                    missions={filteredMissions}
                    emptyMessage="Você não tem missões pendentes de aprovação no momento."
                    type="pending"
                  />
                </TabsContent>
                
                <TabsContent value="completed" className="mt-6">
                  <FilteredMissionsList 
                    missions={filteredMissions}
                    emptyMessage="Você não tem missões concluídas ainda."
                    type="completed"
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <MissionDialog 
        isOpen={isSubmissionOpen}
        setIsOpen={setIsSubmissionOpen}
        selectedMission={selectedMission}
        loading={submitting}
        onSubmitMission={handleSubmitMission}
      />
    </div>
  );
};

export default ClientMissions;
