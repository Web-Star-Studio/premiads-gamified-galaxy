import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SubmissionsList from "./SubmissionsList";
import SubmissionsLoading from "./SubmissionsLoading";
import SubmissionsEmptyState from "./SubmissionsEmptyState";
import { Badge } from "@/components/ui/badge";
import FilterPopover from "./components/FilterPopover";
import { useAuth } from "@/hooks/useAuth";
import { missionService } from "@/services/supabase";

export interface FilterOptions {
  status: string[];
  missionId?: string;
  dateRange?: [Date | null, Date | null];
}

export interface Submission {
  id: string;
  user_id: string;
  mission_id: string;
  proof_url?: string[];
  proof_text?: string;
  status: string;
  missions?: {
    title: string;
  };
  submitted_at?: string;
  updated_at: string;
  user?: {
    name?: string;
    avatar_url?: string;
  };
}

// Props to trigger a manual refresh from parent
interface ModerationContentProps {
  refreshKey?: number
}

const ModerationContent = ({ refreshKey }: ModerationContentProps) => {
  const [activeTab, setActiveTab] = useState<string>("pendentes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: [],
  });
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Mapear abas para status de submissão
  const tabToStatusMap: Record<string, string> = {
    'pendentes': 'pending',
    'aprovadas': 'approved',
    'rejeitadas': 'rejected',
    'segunda_instancia': 'segunda_instancia'
  };

  // Buscar submissões
  const fetchSubmissions = async () => {
    if (!currentUser?.id) return;
    
    setIsLoading(true);
    
    try {
      // Primeiro, buscar missões criadas por este anunciante
      const { data: missions, error: missionsError } = await missionService.supabase
        .from('missions')
        .select('id')
        .eq('advertiser_id', currentUser.id);
      
      if (missionsError) throw missionsError;
      
      // Se não houver missões, não há submissões para mostrar
      if (!missions || missions.length === 0) {
        setSubmissions([]);
        setFilteredSubmissions([]);
        setIsLoading(false);
        return;
      }
      
      const missionIds = missions.map(m => m.id);
      
      // Agora buscar as submissões para estas missões com base no status atual
      let query = missionService.supabase
        .from('mission_submissions')
        .select('*, missions(title)')
        .in('mission_id', missionIds);
      
      // Aplicar filtro de status se necessário
      if (tabToStatusMap[activeTab]) {
        query = query.eq('status', tabToStatusMap[activeTab]);
      }
      
      // Ordenar por data de atualização (mais recentes primeiro)
      const { data: fetchedSubmissions, error: submissionsError } = await query
        .order('updated_at', { ascending: false });
      
      if (submissionsError) throw submissionsError;
      
      console.log(`Encontradas ${fetchedSubmissions?.length || 0} submissões para a aba ${activeTab}`);
      
      // Buscar detalhes dos usuários para as submissões
      const enhancedSubmissions = await Promise.all(
        (fetchedSubmissions || []).map(async (submission) => {
          try {
            // Buscar informações do usuário
            const { data: userData } = await missionService.supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', submission.user_id)
              .single();
            
            return {
              ...submission,
              user: {
                name: userData?.full_name || 'Usuário',
                avatar_url: userData?.avatar_url || ''
              }
            };
          } catch (error) {
            return {
              ...submission,
              user: {
                name: 'Usuário',
                avatar_url: ''
              }
            };
          }
        })
      );
      
      setSubmissions(enhancedSubmissions);
      setFilteredSubmissions(enhancedSubmissions);
    } catch (error) {
      console.error('Erro ao buscar submissões:', error);
      toast({
        title: 'Erro ao carregar submissões',
        description: 'Não foi possível carregar as submissões para moderação.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Aprovar uma submissão
  const handleApproveSubmission = async (submissionId: string) => {
    if (!currentUser?.id) return;
    
    try {
      await missionService.validateSubmission(
        submissionId,
        currentUser.id,
        'aprovado',
        false
      );
      
      toast({
        title: 'Submissão aprovada',
        description: 'A submissão foi aprovada com sucesso!'
      });
      
      // Atualizar lista de submissões
      fetchSubmissions();
    } catch (error) {
      console.error('Erro ao aprovar submissão:', error);
      toast({
        title: 'Erro ao aprovar submissão',
        description: 'Não foi possível aprovar esta submissão.',
        variant: 'destructive'
      });
    }
  };

  // Rejeitar uma submissão
  const handleRejectSubmission = async (submissionId: string, reason?: string) => {
    if (!currentUser?.id) return;
    
    try {
      await missionService.validateSubmission(
        submissionId,
        currentUser.id,
        'rejeitado',
        false,
        reason
      );
      
      toast({
        title: 'Submissão rejeitada',
        description: 'A submissão foi rejeitada e enviada para segunda validação.'
      });
      
      // Atualizar lista de submissões
      fetchSubmissions();
    } catch (error) {
      console.error('Erro ao rejeitar submissão:', error);
      toast({
        title: 'Erro ao rejeitar submissão',
        description: 'Não foi possível rejeitar esta submissão.',
        variant: 'destructive'
      });
    }
  };

  // Filtrar submissões com base na pesquisa
  const filterSubmissions = () => {
    let filtered = [...submissions];
    
    // Filtrar por termo de pesquisa
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((submission) => 
        submission.missions?.title.toLowerCase().includes(lowerCaseQuery) ||
        submission.proof_text?.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filtrar por opções de filtro
    if (filterOptions.missionId) {
      filtered = filtered.filter((submission) => 
        submission.mission_id === filterOptions.missionId
      );
    }
    
    // Filtrar por intervalo de datas
    if (filterOptions.dateRange && filterOptions.dateRange[0] && filterOptions.dateRange[1]) {
      const startDate = filterOptions.dateRange[0];
      const endDate = filterOptions.dateRange[1];
      
      filtered = filtered.filter((submission) => {
        // Use submitted_at if available, otherwise fall back to updated_at
        const dateValue = submission.submitted_at || submission.updated_at;
        const submissionDate = new Date(dateValue);
        return submissionDate >= startDate && submissionDate <= endDate;
      });
    }
    
    setFilteredSubmissions(filtered);
  };

  // Ao mudar de aba ou por refreshKey, buscar submissões correspondentes
  useEffect(() => {
    fetchSubmissions();
  }, [activeTab, currentUser?.id, refreshKey]);

  // Ao mudar a pesquisa ou filtros, aplicar filtros
  useEffect(() => {
    filterSubmissions();
  }, [searchQuery, filterOptions, submissions]);

  // Renderização condicional com base no estado de carregamento
  const renderContent = () => {
    if (isLoading) {
      return <SubmissionsLoading />;
    }
    
    if (filteredSubmissions.length === 0) {
      return <SubmissionsEmptyState activeTab={activeTab} />;
    }
    
    return (
      <SubmissionsList 
        submissions={filteredSubmissions} 
        onApprove={handleApproveSubmission}
        onReject={handleRejectSubmission}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Moderação de Submissões</h1>
        <p className="text-muted-foreground">
          Avalie as submissões de usuários para suas campanhas publicitárias
        </p>
      </div>
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar submissões..."
              className="pl-8 bg-galaxy-darkPurple"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <FilterPopover
            onFilterChange={setFilterOptions}
            currentFilters={filterOptions}
          >
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </FilterPopover>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-galaxy-darkPurple">
            {filteredSubmissions.length} submissões
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-galaxy-darkPurple grid grid-cols-4 mb-6">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
          <TabsTrigger value="rejeitadas">Rejeitadas</TabsTrigger>
          <TabsTrigger value="segunda_instancia">Segunda Instância</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes" className="space-y-4 mt-0">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="aprovadas" className="space-y-4 mt-0">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="rejeitadas" className="space-y-4 mt-0">
          {renderContent()}
        </TabsContent>
        
        <TabsContent value="segunda_instancia" className="space-y-4 mt-0">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationContent;
