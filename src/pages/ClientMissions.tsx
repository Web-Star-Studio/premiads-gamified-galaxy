
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSounds } from "@/hooks/use-sounds";
import { useUser } from "@/context/UserContext";
import { useMissions } from "@/hooks/useMissions";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ClientSidebar from "@/components/client/dashboard/ClientSidebar";
import ClientHeader from "@/components/client/ClientHeader";
import ClientDashboardHeader from "@/components/client/ClientDashboardHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SearchAndFilter from "@/components/client/missions/SearchAndFilter";
import MissionsList from "@/components/client/missions/MissionsList";
import MissionDetails from "@/components/client/missions/MissionDetails";
import FilteredMissionsList from "@/components/client/missions/FilteredMissionsList";
import MissionDialog from "@/components/client/missions/MissionDialog";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Mission as UnifiedMission } from "@/types/mission-unified";
import { Mission as UseMissionsTypeMission } from "@/hooks/useMissionsTypes";

const ClientMissions = () => {
  const { userName, userType } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { playSound } = useSounds();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { 
    loading, 
    missions: rawMissions, 
    selectedMission: rawSelectedMission, 
    setSelectedMission, 
    currentFilter, 
    setFilter,
    submitMission
  } = useMissions({ initialFilter: "available" });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmissionOpen, setIsSubmissionOpen] = useState(false);

  // Convert missions to the expected format for UI components
  const missions = rawMissions.map((mission: UnifiedMission): UseMissionsTypeMission => ({
    ...mission,
    brand: mission.brand || '',
    description: mission.description || '',
    cashback_reward: mission.cashback_reward || 0,
    tickets_reward: mission.tickets_reward || 0,
    cost_in_tokens: mission.cost_in_tokens || 0,
    requirements: Array.isArray(mission.requirements) ? mission.requirements : [mission.requirements || ''],
    start_date: mission.start_date || new Date().toISOString(),
  }));

  const selectedMission = rawSelectedMission ? {
    ...rawSelectedMission,
    brand: rawSelectedMission.brand || '',
    description: rawSelectedMission.description || '',
    cashback_reward: rawSelectedMission.cashback_reward || 0,
    tickets_reward: rawSelectedMission.tickets_reward || 0,
    cost_in_tokens: rawSelectedMission.cost_in_tokens || 0,
    requirements: Array.isArray(rawSelectedMission.requirements) ? rawSelectedMission.requirements : [rawSelectedMission.requirements || ''],
  } : null;

  useEffect(() => {
    // TEMPORARILY DISABLED: Redirect if user is not a participant
    // if (userType !== "participante") {
    //   toast({
    //     title: "Acesso restrito",
    //     description: "Você não tem permissão para acessar esta página",
    //     variant: "destructive",
    //   });
    //   navigate("/");
    // }
  }, [userType, navigate, toast]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredMissions = missions.filter(mission => 
    mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (mission.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    mission.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMissionClick = (mission: UseMissionsTypeMission) => {
    // Convert back to UnifiedMission format for setSelectedMission
    const unifiedMission: UnifiedMission = {
      ...mission,
      requirements: Array.isArray(mission.requirements) ? mission.requirements : [mission.requirements || ''],
      start_date: mission.start_date || new Date().toISOString(),
    };
    setSelectedMission(unifiedMission);
    playSound("pop");
  };

  const handleStartMission = () => {
    if (!selectedMission) return;
    
    setIsSubmissionOpen(true);
    playSound("pop");
  };

  const handleSubmitMission = async (
    submissionData: any,
    status: "in_progress" | "pending_approval" = "pending_approval"
  ) => {
    if (!selectedMission) return false;

    // Close dialog if action was cancelled
    if (submissionData === null) {
      setIsSubmissionOpen(false);
      return true;
    }

    // Forward the status chosen in MissionDialog to the submitMission hook
    const success = await submitMission(selectedMission.id, submissionData, status);

    if (success) {
      setSelectedMission(null);
      setIsSubmissionOpen(false);
    }

    return success;
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
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex h-screen w-full bg-galaxy-dark overflow-hidden">
        <ClientSidebar />
        <SidebarInset className="overflow-y-auto pb-20">
          <ClientHeader />
          
          <div className="container px-4 py-8 mx-auto">
            <ClientDashboardHeader 
              title="Missões e Desafios" 
              description="Complete missões, ganhe pontos e resgate prêmios exclusivos" 
              userName={userName} 
              showBackButton={true}
              backTo="/cliente"
            />
            
            <div className="mt-8">
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
                      const unifiedMission: UnifiedMission = {
                        ...mission,
                        requirements: Array.isArray(mission.requirements) ? mission.requirements : [mission.requirements || ''],
                        start_date: mission.start_date || new Date().toISOString(),
                      };
                      setSelectedMission(unifiedMission);
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
            </div>
          </div>
          
          <MissionDialog 
            isOpen={isSubmissionOpen}
            setIsOpen={setIsSubmissionOpen}
            selectedMission={selectedMission}
            loading={loading}
            onSubmitMission={handleSubmitMission}
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ClientMissions;
