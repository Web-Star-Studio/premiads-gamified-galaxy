
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSounds } from "@/hooks/use-sounds";
import { useToast } from "@/hooks/use-toast";
import CampaignForm from "./CampaignForm";
import CampaignHeader from "./CampaignHeader";
import CampaignTable from "./CampaignTable";
import { mockCampaigns, Campaign } from "./campaignData";
import { supabase } from "@/integrations/supabase/client";

interface CampaignsListProps {
  initialFilter?: string | null;
}

const CampaignsList = ({ initialFilter = null }: CampaignsListProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(initialFilter);
  const [loading, setLoading] = useState(true);
  const { playSound } = useSounds();
  const { toast } = useToast();
  
  // Buscar campanhas quando o componente é montado
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCampaigns(mockCampaigns);
          setLoading(false);
          return;
        }
        
        // Buscar campanhas do usuário atual
        const { data, error } = await supabase
          .from('missions')
          .select('*')
          .eq('advertiser_id', session.user.id);
        
        if (error) {
          console.error("Erro ao buscar campanhas:", error);
          setCampaigns(mockCampaigns);
          setLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          // Converter dados do banco para o formato usado pelo componente
          const formattedCampaigns: Campaign[] = data.map(mission => ({
            id: mission.id,
            title: mission.title,
            status: mission.is_active ? "ativa" : "pendente",
            audience: mission.target_audience_gender || "todos",
            completions: 0, // Poderia buscar o número de submissões
            reward: `${mission.points}`,
            expires: mission.end_date ? new Date(mission.end_date).toLocaleDateString('pt-BR') : 'N/A',
          }));
          
          setCampaigns(formattedCampaigns);
        } else {
          // Se não houver dados, usar mock para demonstração
          setCampaigns(mockCampaigns);
        }
      } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
        setCampaigns(mockCampaigns);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  // Definir filtro inicial quando a prop muda
  useEffect(() => {
    setFilterStatus(initialFilter);
  }, [initialFilter]);
  
  // Filtrar campanhas com base no termo de busca e filtro de status
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus ? campaign.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string | number) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Excluir a missão/campanha do banco de dados
        const { error } = await supabase
          .from('missions')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error("Erro ao excluir campanha:", error);
          throw error;
        }
      }
      
      // Atualizar o estado removendo a campanha excluída
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
      
      playSound("error");
      toast({
        title: "Campanha removida",
        description: `A campanha foi removida com sucesso`,
      });
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
      toast({
        title: "Erro ao remover campanha",
        description: "Não foi possível remover a campanha. Tente novamente.",
        variant: "destructive"
      });
    }
  };
  
  const handleCreateNew = () => {
    setShowCreateForm(true);
    setEditingCampaign(null);
    playSound("pop");
  };
  
  const handleFormClose = async (formData?: any) => {
    setShowCreateForm(false);
    
    // Se não houver dados do formulário, apenas fechar o formulário
    if (!formData) {
      setEditingCampaign(null);
      return;
    }
    
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Usuário não autenticado");
      }
      
      // Preparar dados para inserir/atualizar no banco
      const missionData = {
        title: formData.title || (editingCampaign ? editingCampaign.title : "Nova Missão"),
        description: formData.description || "Descrição da missão",
        type: formData.type || "form",
        points: parseInt(formData.reward) || 50,
        is_active: formData.status === "ativa",
        advertiser_id: session.user.id,
        requirements: formData.requirements || null,
        end_date: formData.endDate || null,
        target_audience_gender: formData.audience || null
      };
      
      let result;
      
      if (editingCampaign) {
        // Atualizar missão existente
        result = await supabase
          .from('missions')
          .update(missionData)
          .eq('id', editingCampaign.id);
      } else {
        // Inserir nova missão
        result = await supabase
          .from('missions')
          .insert(missionData)
          .select();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Exibir toast de sucesso
      playSound("pop");
      toast({
        title: "Missão gerenciada",
        description: editingCampaign ? "Missão atualizada com sucesso!" : "Nova missão criada com sucesso!",
      });
      
      // Recarregar a lista de campanhas
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('advertiser_id', session.user.id);
      
      if (error) throw error;
      
      if (data) {
        const formattedCampaigns: Campaign[] = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          status: mission.is_active ? "ativa" : "pendente",
          audience: mission.target_audience_gender || "todos",
          completions: 0,
          reward: `${mission.points}`,
          expires: mission.end_date ? new Date(mission.end_date).toLocaleDateString('pt-BR') : 'N/A',
        }));
        
        setCampaigns(formattedCampaigns);
      }
    } catch (error) {
      console.error("Erro ao gerenciar campanha:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a campanha",
        variant: "destructive"
      });
    } finally {
      setEditingCampaign(null);
    }
  };
  
  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setShowCreateForm(true);
    playSound("pop");
  };
  
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (status: string | null) => {
    setFilterStatus(status);
  };
  
  return (
    <div className="space-y-6">
      {showCreateForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CampaignForm 
            onClose={handleFormClose} 
            editCampaign={editingCampaign}
          />
        </motion.div>
      ) : (
        <>
          <CampaignHeader 
            onCreateNew={handleCreateNew} 
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
          />
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <CampaignTable 
              campaigns={filteredCampaigns} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CampaignsList;
